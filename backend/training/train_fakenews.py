import pandas as pd
import joblib
import os
import sys

# Add backend/ to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier, LogisticRegression
from sklearn.ensemble import VotingClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from config import DATA_DIR, MODEL_DIR
from utils.text_preprocessing import clean_text

# ─────────────────────────────────────────
# Step 1: Load & Merge ALL Datasets
# ─────────────────────────────────────────
print("=" * 60)
print("  FAKE NEWS DETECTOR — Enhanced Training Pipeline")
print("=" * 60)

# ── Dataset 1: True.csv + Fake.csv (Main) ──
print("\n[1/2] Loading True.csv + Fake.csv ...")
true_path = os.path.join(DATA_DIR, "True.csv")
fake_path = os.path.join(DATA_DIR, "Fake.csv")

true_df = pd.read_csv(true_path)
fake_df = pd.read_csv(fake_path)

true_df["label"] = "REAL"
fake_df["label"] = "FAKE"

df1 = pd.concat([true_df, fake_df], ignore_index=True)
# Combine title + text
if "title" in df1.columns and "text" in df1.columns:
    df1["content"] = df1["title"].fillna("") + " " + df1["text"].fillna("")
elif "text" in df1.columns:
    df1["content"] = df1["text"].fillna("")
else:
    df1["content"] = df1["title"].fillna("")
df1 = df1[["content", "label"]]
print(f"      → {len(df1)} samples")

# ── Dataset 2: Indian Fake News Examples (Hardcoded) ──
print("[2/2] Adding Indian context examples ...")
indian_examples = [
    {"content": "Government gives free Rs 10000 to all Aadhaar card holders click link to claim", "label": "FAKE"},
    {"content": "WhatsApp will be shut down next week unless you forward this message to 10 people", "label": "FAKE"},
    {"content": "New vaccine causes 5G activation in human body government hiding truth", "label": "FAKE"},
    {"content": "RBI announces free loan of Rs 500000 for all Indian citizens apply now", "label": "FAKE"},
    {"content": "PM Modi announces free electricity for all households below poverty line", "label": "FAKE"},
    {"content": "BREAKING: India banning all social media platforms from next month says IT ministry", "label": "FAKE"},
    {"content": "Drinking hot water with lemon kills coronavirus confirmed by WHO", "label": "FAKE"},
    {"content": "Government to give Rs 6000 per month to every unemployed youth register now on this link", "label": "FAKE"},
    {"content": "Forward this message to 25 people and get Rs 500 Jio recharge free government verified", "label": "FAKE"},
    {"content": "Chinese hackers hacked entire Indian banking system all accounts compromised", "label": "FAKE"},
    {"content": "Supreme Court of India upholds new privacy law protecting citizen data", "label": "REAL"},
    {"content": "RBI raises repo rate by 25 basis points to control inflation", "label": "REAL"},
    {"content": "Indian economy grows at 7.2 percent in Q3 says finance ministry report", "label": "REAL"},
    {"content": "ISRO successfully launches Chandrayaan-3 mission to moon", "label": "REAL"},
    {"content": "India reports 15000 new COVID cases as Omicron variant spreads in metro cities", "label": "REAL"},
    {"content": "Bangalore tech startup raises 50 million dollars in Series B funding from Sequoia Capital", "label": "REAL"},
    {"content": "Indian cricket team wins T20 World Cup defeating Australia in the final match", "label": "REAL"},
]

indian_df = pd.DataFrame(indian_examples)
df = pd.concat([df1, indian_df], ignore_index=True)
df = df.dropna(subset=["content"])

# Shuffle
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# ─────────────────────────────────────────
# Step 2: Preprocess
# ─────────────────────────────────────────
print("\nPreprocessing text ...")
df["cleaned"] = df["content"].astype(str).apply(clean_text)
df["label_num"] = df["label"].map({"REAL": 0, "FAKE": 1})
df = df.dropna(subset=["cleaned", "label_num"])
df["label_num"] = df["label_num"].astype(int)

print(f"\n  TOTAL: {len(df)} samples ({(df['label_num'] == 1).sum()} FAKE, {(df['label_num'] == 0).sum()} REAL)")

# ─────────────────────────────────────────
# Step 3: Split
# ─────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    df["cleaned"],
    df["label_num"],
    test_size=0.2,
    random_state=42,
    stratify=df["label_num"]
)

# ─────────────────────────────────────────
# Step 4: Vectorize (Enhanced)
# ─────────────────────────────────────────
print("Vectorizing (TF-IDF with bigrams) ...")
vectorizer = TfidfVectorizer(
    max_features=15000,
    ngram_range=(1, 2),
    stop_words="english",
    sublinear_tf=True,
    min_df=2
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec  = vectorizer.transform(X_test)

# ─────────────────────────────────────────
# Step 5: Train Ensemble
# ─────────────────────────────────────────
print("Training Ensemble (PAC + LR + SVM) ...")

pac = PassiveAggressiveClassifier(max_iter=1000)
lr  = LogisticRegression(max_iter=2000, C=1.0)
svm = CalibratedClassifierCV(LinearSVC(max_iter=2000), cv=3)

model = VotingClassifier(
    estimators=[("pac", CalibratedClassifierCV(pac, cv=3)), ("lr", lr), ("svm", svm)],
    voting="soft"
)
model.fit(X_train_vec, y_train)

# ─────────────────────────────────────────
# Step 6: Evaluate
# ─────────────────────────────────────────
y_pred   = model.predict(X_test_vec)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n{'=' * 40}")
print(f"  ACCURACY: {accuracy * 100:.2f}%")
print(f"{'=' * 40}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["REAL", "FAKE"]))

# ─────────────────────────────────────────
# Step 7: Save Models
# ─────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)

news_model_path = os.path.join(MODEL_DIR, "fake_news_model.pkl")
news_vec_path   = os.path.join(MODEL_DIR, "fake_news_vectorizer.pkl")

joblib.dump(model,      news_model_path)
joblib.dump(vectorizer, news_vec_path)

print(f"\n✓ fake_news_model.pkl      saved → {news_model_path}")
print(f"✓ fake_news_vectorizer.pkl saved → {news_vec_path}")
print("\n🛡️  Fake News Detector training complete!")
