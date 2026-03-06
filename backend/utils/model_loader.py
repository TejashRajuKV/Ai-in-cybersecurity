import joblib
import os

def load_model(path):
    if os.path.exists(path):
        return joblib.load(path)
    return None
