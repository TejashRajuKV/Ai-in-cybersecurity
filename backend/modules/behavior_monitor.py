import sys
import os
import numpy as np
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.response_formatter import format_response, format_error


# ─────────────────────────────────────────
# Risk Reasons based on behavior
# ─────────────────────────────────────────
def build_behavior_reason(data: dict) -> tuple:
    """
    Analyze transaction data and build reason string.
    Returns (reason, flagged_fields)
    """
    reasons = []
    flagged_fields = []

    hour = data.get("hour", 12)
    amount = data.get("amount", 0)
    transactions = data.get("transactions", 1)
    new_device = data.get("new_device", 0)
    failed_logins = data.get("failed_logins", 0)

    # Input safety
    if hour < 0 or hour > 23:
        hour = 12

    if amount < 0:
        amount = 0

    if transactions < 0:
        transactions = 0

    if failed_logins < 0:
        failed_logins = 0

    if hour >= 0 and hour <= 5:
        reasons.append("Unusual midnight activity detected")
        flagged_fields.append("hour")

    if amount >= 50000:
        reasons.append(f"Very high transaction amount Rs {amount:,.0f}")
        flagged_fields.append("amount")
    elif amount >= 20000:
        reasons.append(f"High transaction amount Rs {amount:,.0f}")
        flagged_fields.append("amount")

    if transactions >= 20:
        reasons.append(f"Too many transactions in one day ({transactions})")
        flagged_fields.append("transactions")
    elif transactions >= 10:
        reasons.append(f"High number of transactions ({transactions})")
        flagged_fields.append("transactions")

    if new_device == 1:
        reasons.append("Login from new/unknown device")
        flagged_fields.append("new_device")

    if failed_logins >= 3:
        reasons.append(f"Multiple failed login attempts ({failed_logins})")
        flagged_fields.append("failed_logins")

    if not reasons:
        return "Normal behavior detected", []

    return " + ".join(reasons), flagged_fields


# ─────────────────────────────────────────
# Check Behavior
# ─────────────────────────────────────────
def check_behavior(data: dict, models: dict) -> dict:
    """
    Main behavior anomaly detection function.
    Called by behavior_routes.py
    """

    try:

        # ── Get model ──
        behavior_bundle = models.get("behavior_model")

        if behavior_bundle is None:
            return format_error("behavior_monitor", "Behavior model not loaded")

        model = behavior_bundle["model"]
        scaler = behavior_bundle["scaler"]
        features = behavior_bundle["features"]

        # ── Build feature array ──
        hour = data.get("hour", 12)
        amount = data.get("amount", 0)
        transactions = data.get("transactions", 1)
        new_device = data.get("new_device", 0)
        failed_logins = data.get("failed_logins", 0)

        # Safety checks
        if hour < 0 or hour > 23:
            hour = 12

        if amount < 0:
            amount = 0

        if transactions < 0:
            transactions = 0

        if failed_logins < 0:
            failed_logins = 0

        # Clamp extreme values
        amount = min(amount, 10000000)

        X = np.array([[hour, amount, transactions, new_device, failed_logins]])

        # ── Scale ──
        X_scaled = scaler.transform(X)

        # ── Predict ──
        prediction = model.predict(X_scaled)[0]   # -1 = anomaly, 1 = normal
        score = model.decision_function(X_scaled)[0]

        # ── Convert score to confidence ──
        confidence = int(min(100, max(0, (abs(score) * 50))))

        if prediction == 1:
            confidence = int(min(100, max(0, (score * 30) + 30)))
            confidence = max(10, 100 - confidence)

        # ── Build reason ──
        reason, flagged_fields = build_behavior_reason(data)

        # ── Override confidence based on rules ──
        risk_factors = sum([
            hour <= 5,
            amount >= 50000,
            transactions >= 20,
            new_device == 1,
            failed_logins >= 3
        ])

        if risk_factors >= 3:
            confidence = max(confidence, 80)
        elif risk_factors == 2:
            confidence = max(confidence, 55)
        elif risk_factors == 1:
            confidence = max(confidence, 35)
        else:
            confidence = min(confidence, 25)

        return format_response(
            module="behavior_monitor",
            confidence=confidence,
            reason=reason,
            flagged_words=flagged_fields
        )

    except Exception as e:
        return format_error("behavior_monitor", str(e))
