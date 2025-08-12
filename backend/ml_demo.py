# Helper to generate synthetic data and helper functions used by the demo endpoints
import pandas as pd
import numpy as np
import random

def generate_synthetic_data(num_books=80, num_branches=5, weeks=52, seed=42):
    random.seed(seed)
    np.random.seed(seed)
    books = [{'book_id': i+1, 'title': f'Book {i+1}'} for i in range(num_books)]
    branches = [{'branch_id': j+1, 'name': f'Branch {j+1}', 'capacity': random.randint(2000,5000)} for j in range(num_branches)]
    records = []
    for b in books:
        # each book has a base popularity score
        base_pop = np.random.poisson(2) + 0.5
        for br in branches:
            # random initial copies between 0 and 10
            copies = np.random.randint(0, 12)
            for w in range(1, weeks+1):
                # borrow rate depends on base_pop, branch affinity, seasonality
                season = 1.0 + 0.3 * np.sin(2 * np.pi * (w/52))
                branch_affinity = np.random.choice([0.5, 0.8, 1.0, 1.2], p=[0.1, 0.2, 0.5, 0.2])
                borrows = np.random.poisson(max(0.0, base_pop * branch_affinity * season))
                records.append({'book_id': b['book_id'], 'branch_id': br['branch_id'], 'week': w, 'borrows': borrows, 'copies': copies, 'capacity': br['capacity']})
    df = pd.DataFrame.from_records(records)
    return df

def build_next_period_df(df, week=53):
    # Build a dataframe of features for week 'week' for all observed book-branch combos
    last = df.groupby(['book_id','branch_id']).agg({'borrows': list, 'copies':'last', 'capacity':'last'}).reset_index()
    # rolling_4 mean
    last['rolling_4'] = last['borrows'].apply(lambda lst: float(np.mean(lst[-4:]) if len(lst)>0 else 0.0))
    last['week'] = week
    next_df = last[['book_id','branch_id','week','rolling_4','copies','capacity']].copy()
    return next_df

def current_copies_from_demo(df):
    cur = df.groupby(['book_id','branch_id']).agg({'copies':'last'}).reset_index()
    return cur
