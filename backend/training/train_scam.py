import pandas as pd
import joblib
import os
import sys

# Add backend/ to path so we can import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
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
print("  SCAM RADAR — Enhanced Training Pipeline")
print("=" * 60)

# ── Dataset 1: Classic SMS Spam (Kaggle) ──
print("\n[1/3] Loading spam.csv ...")
csv1 = os.path.join(DATA_DIR, "spam.csv")
df1 = pd.read_csv(csv1, encoding="latin-1")[["v1", "v2"]]
df1.columns = ["label", "message"]
print(f"      → {len(df1)} samples")

# ── Dataset 2: Indian Scam/Ham Messages ──
print("[2/3] Loading spam_ham_india.csv ...")
csv2 = os.path.join(DATA_DIR, "spam_ham_india.csv")
df2 = pd.read_csv(csv2)
df2.columns = ["message", "label"]
df2 = df2[["label", "message"]]
print(f"      → {len(df2)} samples")

# ── Dataset 3: Hardcoded Indian Scam Samples ──
print("[3/3] Adding hardcoded Indian scam examples ...")
indian_scams = [
    {"label": "spam", "message": "Your KYC will be blocked. Update immediately to avoid account suspension."},
    {"label": "spam", "message": "UPI collect request pending. Approve now or your account will be frozen."},
    {"label": "spam", "message": "Digital arrest notice issued. Pay fine immediately to avoid legal action."},
    {"label": "spam", "message": "Dear customer your SBI account is suspended. Send OTP to 9876543210."},
    {"label": "spam", "message": "Congratulations! You won Rs 50000 in lucky draw. Claim your prize now."},
    {"label": "spam", "message": "RBI notice: Your bank account will be closed. Verify KYC within 24 hours."},
    {"label": "spam", "message": "Urgent: Your Aadhaar linked account is blocked. Call immediately."},
    {"label": "spam", "message": "You have a pending UPI payment request of Rs 9999. Approve or decline now."},
    {"label": "spam", "message": "Your loan is approved. No documents needed. Click link to claim Rs 200000."},
    {"label": "spam", "message": "Income tax refund of Rs 15420 pending. Update bank details to receive."},
    {"label": "spam", "message": "Cyber crime department notice: FIR registered against your Aadhaar. Pay fine now."},
    {"label": "spam", "message": "Your PhonePe account will be blocked in 24hrs. Verify your KYC immediately."},
    {"label": "spam", "message": "You are selected for government scheme. Send Rs 500 processing fee to claim Rs 100000."},
    {"label": "spam", "message": "HDFC Bank: Your debit card is blocked due to suspicious activity. Call 9876543210."},
    {"label": "spam", "message": "Bitcoin investment opportunity! Get 200% returns in 7 days guaranteed."},
    {"label": "ham",  "message": "Your OTP for login is 452781. Valid for 10 minutes. Do not share."},
    {"label": "ham",  "message": "Your order has been shipped. Expected delivery by tomorrow."},
    {"label": "ham",  "message": "Your UPI transaction of Rs 500 to Rahul was successful."},
    {"label": "ham",  "message": "Meeting scheduled for tomorrow at 10am. Please confirm attendance."},
    {"label": "ham",  "message": "Hey, are we still meeting for lunch today?"},
    {"label": "ham",  "message": "Your electricity bill of Rs 2340 is due on 15th March. Pay via CESC app."},
]

indian_df = pd.DataFrame(indian_scams)

# ── Merge All ──
df = pd.concat([df1, df2, indian_df], ignore_index=True)
df = df.dropna(subset=["message"])

# Normalize labels
df["label"] = df["label"].str.strip().str.lower()
df["label_num"] = df["label"].map({"ham": 0, "spam": 1})
df = df.dropna(subset=["label_num"])
df["label_num"] = df["label_num"].astype(int)

print(f"\n  TOTAL: {len(df)} samples ({(df['label_num'] == 1).sum()} spam, {(df['label_num'] == 0).sum()} ham)")

# ─────────────────────────────────────────
# Step 2: Preprocess
# ─────────────────────────────────────────
print("\nPreprocessing text ...")
df["cleaned"] = df["message"].astype(str).apply(clean_text)

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
# Step 4: Vectorize (Enhanced TF-IDF)
# ─────────────────────────────────────────
print("Vectorizing (TF-IDF with bigrams+trigrams) ...")
vectorizer = TfidfVectorizer(
    max_features=8000,
    ngram_range=(1, 3),
    sublinear_tf=True,
    min_df=2
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec  = vectorizer.transform(X_test)

# ─────────────────────────────────────────
# Step 5: Train Ensemble Model
# ─────────────────────────────────────────
print("Training Ensemble (LR + SVM + RF) ...")

lr  = LogisticRegression(max_iter=2000, C=1.0)
svm = CalibratedClassifierCV(LinearSVC(max_iter=2000), cv=3)
rf  = RandomForestClassifier(n_estimators=200, max_depth=20, random_state=42)

model = VotingClassifier(
    estimators=[("lr", lr), ("svm", svm), ("rf", rf)],
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
print(classification_report(y_test, y_pred, target_names=["ham", "spam"]))

# ─────────────────────────────────────────
# Step 7: Save Models
# ─────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)

scam_model_path = os.path.join(MODEL_DIR, "scam_model.pkl")
scam_vec_path   = os.path.join(MODEL_DIR, "scam_vectorizer.pkl")

joblib.dump(model,      scam_model_path)
joblib.dump(vectorizer, scam_vec_path)

print(f"\n✓ scam_model.pkl     saved → {scam_model_path}")
print(f"✓ scam_vectorizer.pkl saved → {scam_vec_path}")
print("\n🛡️  Scam Radar training complete!")
