import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# Model Paths
SCAM_MODEL_PATH = os.path.join(MODEL_DIR, 'scam_model.pkl')
SCAM_VECTORIZER_PATH = os.path.join(MODEL_DIR, 'scam_vectorizer.pkl')

FAKE_NEWS_MODEL_PATH = os.path.join(MODEL_DIR, 'fake_news_model.pkl')
FAKE_NEWS_VECTORIZER_PATH = os.path.join(MODEL_DIR, 'fake_news_vectorizer.pkl')

BEHAVIOR_MODEL_PATH = os.path.join(MODEL_DIR, 'behavior_model.pkl')

# Thresholds
RISK_THRESHOLD_HIGH = 70
RISK_THRESHOLD_MEDIUM = 40
