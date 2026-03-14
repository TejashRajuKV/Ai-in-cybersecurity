import pandas as pd
import numpy as np
import joblib
import os
import sys

# Add backend/ to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from config import DATA_DIR, MODEL_DIR

# ─────────────────────────────────────────
# Step 1: Load Existing + Generate Fresh Data
# ─────────────────────────────────────────
print("=" * 60)
print("  BEHAVIOR MONITOR — Enhanced Training Pipeline")
print("=" * 60)

# ── Load existing behavioral data ──
csv_path = os.path.join(DATA_DIR, "behavior_simulation.csv")
if os.path.exists(csv_path) and os.path.getsize(csv_path) > 100:
    print("\n[1/2] Loading existing behavior_simulation.csv ...")
    existing_df = pd.read_csv(csv_path)
    print(f"      → {len(existing_df)} existing records")
else:
    existing_df = pd.DataFrame()

# ── Generate MORE diverse training data ──
print("[2/2] Generating enhanced synthetic behavior data ...")
np.random.seed(42)

# Normal behavior — 2000 rows (more diverse)
normal_data = {
    "hour":           np.random.randint(6, 23, 2000),
    "amount":         np.random.uniform(10, 8000, 2000),
    "transactions":   np.random.randint(1, 12, 2000),
    "new_device":     np.random.choice([0, 1], 2000, p=[0.95, 0.05]),
    "failed_logins":  np.random.randint(0, 2, 2000),
    "label": "normal"
}

# Anomalous behavior — 400 rows (more variety)
anomaly_data_1 = {
    "hour":           np.random.randint(0, 5, 200),         # Midnight activity
    "amount":         np.random.uniform(50000, 300000, 200), # Very high amount
    "transactions":   np.random.randint(20, 60, 200),        # Way too many
    "new_device":     np.random.choice([0, 1], 200, p=[0.1, 0.9]),
    "failed_logins":  np.random.randint(3, 12, 200),
    "label": "anomaly"
}

# Subtle anomalies (harder to detect) — 200 rows
anomaly_data_2 = {
    "hour":           np.random.randint(10, 22, 200),        # Normal hours
    "amount":         np.random.uniform(25000, 80000, 200),  # Moderate-high amount
    "transactions":   np.random.randint(12, 25, 200),        # Slightly high
    "new_device":     np.random.choice([0, 1], 200, p=[0.3, 0.7]),
    "failed_logins":  np.random.randint(2, 6, 200),
    "label": "anomaly"
}

normal_df   = pd.DataFrame(normal_data)
anomaly_df1 = pd.DataFrame(anomaly_data_1)
anomaly_df2 = pd.DataFrame(anomaly_data_2)

# Merge all
df = pd.concat([existing_df, normal_df, anomaly_df1, anomaly_df2], ignore_index=True)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

normal_count  = (df['label'] == 'normal').sum()
anomaly_count = (df['label'] == 'anomaly').sum()
print(f"\n  TOTAL: {len(df)} samples ({normal_count} normal, {anomaly_count} anomaly)")

# ─────────────────────────────────────────
# Step 2: Save Updated Dataset
# ─────────────────────────────────────────
os.makedirs(DATA_DIR, exist_ok=True)
df.to_csv(csv_path, index=False)
print(f"\n✓ Updated behavior_simulation.csv → {csv_path}")

# ─────────────────────────────────────────
# Step 3: Prepare Features
# ─────────────────────────────────────────
print("\nPreparing features ...")
features = ["hour", "amount", "transactions", "new_device", "failed_logins"]
X = df[features].astype(float)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ─────────────────────────────────────────
# Step 4: Train Isolation Forest (Tuned)
# ─────────────────────────────────────────
print("Training Isolation Forest (tuned contamination) ...")

contamination = anomaly_count / len(df)
print(f"  Contamination ratio: {contamination:.3f}")

model = IsolationForest(
    n_estimators=200,
    contamination=contamination,
    max_samples="auto",
    max_features=1.0,
    random_state=42
)
model.fit(X_scaled)

# ─────────────────────────────────────────
# Step 5: Evaluate
# ─────────────────────────────────────────
predictions = model.predict(X_scaled)

# Evaluate against known labels
from sklearn.metrics import precision_score, recall_score, f1_score

true_labels = (df["label"] == "anomaly").astype(int).values
pred_labels = (predictions == -1).astype(int)

precision = precision_score(true_labels, pred_labels, zero_division=0)
recall    = recall_score(true_labels, pred_labels, zero_division=0)
f1        = f1_score(true_labels, pred_labels, zero_division=0)

anomalies_found = (predictions == -1).sum()
normal_found    = (predictions == 1).sum()

print(f"\n{'=' * 40}")
print(f"  Anomalies Detected: {anomalies_found}")
print(f"  Normal Detected:    {normal_found}")
print(f"  Precision:          {precision:.3f}")
print(f"  Recall:             {recall:.3f}")
print(f"  F1 Score:           {f1:.3f}")
print(f"{'=' * 40}")

# ─────────────────────────────────────────
# Step 6: Save Model + Scaler Together
# ─────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)
behavior_model_path = os.path.join(MODEL_DIR, "behavior_model.pkl")

joblib.dump(
    {"model": model, "scaler": scaler, "features": features},
    behavior_model_path
)

print(f"\n✓ behavior_model.pkl saved → {behavior_model_path}")
print("\n🛡️  Behavior Monitor training complete!")
