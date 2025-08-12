from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from pathlib import Path
from ml import DemandModel
import db

app = FastAPI(title='Library Utilization Optimizer AI (Demo)')

model = DemandModel()

class TrainRequest(BaseModel):
    # expects a CSV-like payload path or data; for demo we'll accept nothing and use embedded data
    pass

class PredictRequest(BaseModel):
    # optionally accept parameters like weeks_ahead; we'll default to 4-week period
    weeks_ahead: int = 4

@app.on_event("startup")
def startup_event():
    db.init_db()
    # try to load model if present
    model.load()

@app.post("/train")
def train(req: TrainRequest = None):
    # For demo, we'll regenerate synthetic data in ml.demo_data and train on it
    from ml_demo import generate_synthetic_data
    df = generate_synthetic_data()
    model.train(df)
    return {"status":"trained","rows": len(df)}

@app.get("/predict")
def predict(weeks_ahead: int = 4):
    # For demo, generate next-period features and predict
    from ml_demo import generate_synthetic_data, build_next_period_df
    df = generate_synthetic_data(weeks=52)
    next_df = build_next_period_df(df, week=53)
    preds = model.predict(next_df)
    # aggregate predictions per branch
    agg = preds.groupby('branch_id')['predicted_borrows'].sum().reset_index().to_dict(orient='records')
    return {"predictions_per_branch": agg}

@app.get("/optimize")
def optimize():
    # simple optimization demo: for each book, find deficit branches and suggest moves from surplus
    from ml_demo import generate_synthetic_data, build_next_period_df, current_copies_from_demo
    df = generate_synthetic_data(weeks=52)
    next_df = build_next_period_df(df, week=53)
    preds = model.predict(next_df)
    copies = current_copies_from_demo(df)
    # merge preds with copies
    merged = preds.merge(copies, on=['book_id','branch_id'], how='left')
    suggestions = []
    # compute for each book demands and copies
    books = merged['book_id'].unique()
    for book in books:
        bk = merged[merged['book_id']==book].copy()
        bk['need'] = bk['predicted_borrows'] - bk['copies']
        # branches needing >1
        needy = bk[bk['need']>1].sort_values('need', ascending=False)
        surplus = bk[bk['need']<0].sort_values('need')
        for _, nrow in needy.iterrows():
            need = int(math.ceil(nrow['need']))
            # pull from largest surplus branches
            for _, srow in surplus.iterrows():
                avail = int(-math.floor(srow['need']))
                if avail<=0: continue
                move = min(avail, need)
                if move<=0: continue
                suggestions.append({"book_id": int(book), "from_branch": int(srow['branch_id']), "to_branch": int(nrow['branch_id']), "count": move,
                                    "reason": f'Predicted demand {nrow["predicted_borrows"]:.1f} vs copies {nrow["copies"]} at destination.'})
                need -= move
                srow['need'] += move  # reduce surplus
                if need<=0:
                    break
    # return top 50 suggestions
    return {"suggestions": suggestions[:50]}
