import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "model.pkl"

class DemandModel:
    def __init__(self):
        self.model = None

    def train(self, df):
        # df must have columns: book_id, branch_id, week, borrows, copies, capacity
        # Feature engineering: encode book_id and branch_id as categorical codes, use lags/rolling means
        df = df.copy()
        df['book_code'] = df['book_id'].astype('category').cat.codes
        df['branch_code'] = df['branch_id'].astype('category').cat.codes
        # compute simple rolling mean per book-branch if available
        df = df.sort_values(['book_id','branch_id','week'])
        df['rolling_4'] = df.groupby(['book_id','branch_id'])['borrows'].transform(lambda x: x.rolling(4,min_periods=1).mean())
        X = df[['book_code','branch_code','week','rolling_4','copies','capacity']].fillna(0)
        y = df['borrows']
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        self.model = model
        # save
        pickle.dump({'model': model, 'book_categories': df[['book_id','book_code']].drop_duplicates().set_index('book_id')['book_code'].to_dict(),
                     'branch_categories': df[['branch_id','branch_code']].drop_duplicates().set_index('branch_id')['branch_code'].to_dict()}, MODEL_PATH.open('wb'))
        return model

    def load(self):
        import pickle, pathlib
        if MODEL_PATH.exists():
            data = pickle.load(MODEL_PATH.open('rb'))
            self.model = data['model']
            self.book_categories = data.get('book_categories', {})
            self.branch_categories = data.get('branch_categories', {})
            return True
        return False

    def predict(self, df_next):
        # df_next must have same feature columns as train X
        df = df_next.copy()
        df['book_code'] = df['book_id'].map(getattr(self, 'book_categories', {}))
        df['branch_code'] = df['branch_id'].map(getattr(self, 'branch_categories', {}))
        df['rolling_4'] = df.get('rolling_4', 0)
        X = df[['book_code','branch_code','week','rolling_4','copies','capacity']].fillna(0)
        preds = self.model.predict(X)
        df['predicted_borrows'] = np.maximum(0, preds)
        return df[['book_id','branch_id','predicted_borrows','copies','capacity']]
