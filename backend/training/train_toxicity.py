import pandas as pd
import joblib
import os
import sys

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
# Step 1: Load & Merge ALL Non-Financial Datasets
# ─────────────────────────────────────────
print("=" * 60)
print("  TOXICITY SHIELD — Enhanced Training Pipeline")
print("=" * 60)

all_frames = []

# ── Dataset 1: labeled_data.csv (24K+ tweets) ──
# class: 0=hate_speech, 1=offensive, 2=neither
path1 = os.path.join(DATA_DIR, "labeled_data.csv")
if os.path.exists(path1):
    print("\n[1/4] Loading labeled_data.csv ...")
    df1 = pd.read_csv(path1)
    # Map: hate_speech(0) & offensive(1) → toxic(1), neither(2) → safe(0)
    df1["toxic"] = df1["class"].apply(lambda x: 0 if x == 2 else 1)
    df1 = df1.rename(columns={"tweet": "text"})[["text", "toxic"]]
    print(f"      → {len(df1)} samples ({(df1['toxic']==1).sum()} toxic, {(df1['toxic']==0).sum()} safe)")
    all_frames.append(df1)

# ── Dataset 2: twitter_parsed_dataset.csv ──
# Annotation: none/racism/sexism, oh_label: 0/1
path2 = os.path.join(DATA_DIR, "twitter_parsed_dataset.csv")
if os.path.exists(path2):
    print("[2/4] Loading twitter_parsed_dataset.csv ...")
    df2 = pd.read_csv(path2)
    df2 = df2.rename(columns={"Text": "text", "oh_label": "toxic"})[["text", "toxic"]]
    df2 = df2.dropna(subset=["text"])
    print(f"      → {len(df2)} samples")
    all_frames.append(df2)

# ── Dataset 3: kaggle_parsed_dataset.csv ──
path3 = os.path.join(DATA_DIR, "kaggle_parsed_dataset.csv")
if os.path.exists(path3):
    print("[3/4] Loading kaggle_parsed_dataset.csv ...")
    df3 = pd.read_csv(path3)
    df3 = df3.rename(columns={"Text": "text", "oh_label": "toxic"})[["text", "toxic"]]
    df3 = df3.dropna(subset=["text"])
    print(f"      → {len(df3)} samples")
    all_frames.append(df3)

# ── Dataset 4: youtube_parsed_dataset.csv ──
path4 = os.path.join(DATA_DIR, "youtube_parsed_dataset.csv")
if os.path.exists(path4):
    print("[4/4] Loading youtube_parsed_dataset.csv ...")
    df4 = pd.read_csv(path4)
    df4 = df4.rename(columns={"Text": "text", "oh_label": "toxic"})[["text", "toxic"]]
    df4 = df4.dropna(subset=["text"])
    print(f"      → {len(df4)} samples")
    all_frames.append(df4)

# ── Merge ──
if not all_frames:
    print("ERROR: No datasets found!")
    sys.exit(1)

df = pd.concat(all_frames, ignore_index=True)
df = df.dropna(subset=["text", "toxic"])
df["toxic"] = df["toxic"].astype(int)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

toxic_count = (df['toxic'] == 1).sum()
safe_count  = (df['toxic'] == 0).sum()
print(f"\n  TOTAL: {len(df)} samples ({toxic_count} toxic, {safe_count} safe)")

# ─────────────────────────────────────────
# Step 2: Preprocess
# ─────────────────────────────────────────
print("\nPreprocessing text ...")
df["cleaned"] = df["text"].astype(str).apply(clean_text)

# Remove empty after cleaning
df = df[df["cleaned"].str.strip().str.len() > 0]

# ─────────────────────────────────────────
# Step 3: Balance dataset (undersample majority)
# ─────────────────────────────────────────
min_class_count = df["toxic"].value_counts().min()
max_sample = min(min_class_count, 15000)  # Cap at 15K per class for speed

df_balanced = pd.concat([
    df[df["toxic"] == 0].sample(n=max_sample, random_state=42),
    df[df["toxic"] == 1].sample(n=max_sample, random_state=42),
], ignore_index=True).sample(frac=1, random_state=42)

print(f"  Balanced dataset: {len(df_balanced)} samples ({max_sample} per class)")

# ─────────────────────────────────────────
# Step 4: Split
# ─────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    df_balanced["cleaned"],
    df_balanced["toxic"],
    test_size=0.2,
    random_state=42,
    stratify=df_balanced["toxic"]
)

# ─────────────────────────────────────────
# Step 5: Vectorize
# ─────────────────────────────────────────
print("Vectorizing (TF-IDF) ...")
vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 2),
    sublinear_tf=True,
    min_df=2
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec  = vectorizer.transform(X_test)

# ─────────────────────────────────────────
# Step 6: Train Ensemble
# ─────────────────────────────────────────
print("Training Ensemble (LR + SVM + RF) ...")

lr  = LogisticRegression(max_iter=2000, C=1.0)
svm = CalibratedClassifierCV(LinearSVC(max_iter=2000), cv=3)
rf  = RandomForestClassifier(n_estimators=150, max_depth=20, random_state=42)

model = VotingClassifier(
    estimators=[("lr", lr), ("svm", svm), ("rf", rf)],
    voting="soft"
)
model.fit(X_train_vec, y_train)

# ─────────────────────────────────────────
# Step 7: Evaluate
# ─────────────────────────────────────────
y_pred   = model.predict(X_test_vec)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n{'=' * 40}")
print(f"  ACCURACY: {accuracy * 100:.2f}%")
print(f"{'=' * 40}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["SAFE", "TOXIC"]))

# ─────────────────────────────────────────
# Step 8: Save Models
# ─────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)

model_path = os.path.join(MODEL_DIR, "toxicity_model.pkl")
vec_path   = os.path.join(MODEL_DIR, "toxicity_vectorizer.pkl")

joblib.dump(model,      model_path)
joblib.dump(vectorizer, vec_path)

print(f"\n✓ toxicity_model.pkl      saved → {model_path}")
print(f"✓ toxicity_vectorizer.pkl saved → {vec_path}")
print("\n🛡️  Toxicity Shield training complete!")
