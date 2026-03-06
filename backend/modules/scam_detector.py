import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.text_preprocessing import clean_text, extract_flagged_words
from utils.feature_engineering import extract_features, build_reason
from utils.response_formatter import format_response, format_error

# ─────────────────────────────────────────
# Scam Category Rules
# ─────────────────────────────────────────
SCAM_CATEGORIES = {
    "UPI Fraud": [
        "upi", "collect request", "payment pending",
        "gpay", "phonepe", "paytm", "bhim", "approve payment",
        "upi pin", "upi id", "scan qr"
    ],
    "KYC Scam": [
        "kyc", "know your customer", "kyc suspended",
        "kyc blocked", "kyc expired", "update kyc",
        "kyc verification", "aadhaar kyc", "pan kyc"
    ],
    "Digital Arrest": [
        "digital arrest", "cyber arrest", "police notice",
        "arrest warrant", "court order", "cybercrime department",
        "legal action", "fir registered", "cyber police",
        "enforcement directorate", "ed notice", "cbi notice"
    ],
    "Lottery Scam": [
        "you won", "winner", "prize", "lottery",
        "lucky draw", "congratulations you", "claim prize",
        "free gift", "reward", "selected winner",
        "prize money", "winning amount"
    ],
    "Loan Fraud": [
        "instant loan", "pre approved loan", "no documents",
        "guaranteed loan", "easy loan", "loan approved",
        "low interest loan", "instant approval",
        "loan offer", "personal loan approved"
    ],
    "Phishing": [
        "click here", "click link", "verify now",
        "update details", "login here", "confirm account",
        "bit.ly", "tinyurl", "verify your account",
        "account suspended", "reactivate account"
    ],
    "Investment Scam": [
        "guaranteed returns", "double money", "investment opportunity",
        "stock tip", "crypto", "bitcoin", "100% returns",
        "risk free investment", "fixed returns", "daily profit"
    ],
    "Bank Impersonation": [
        "sbi", "hdfc", "icici", "axis bank", "rbi",
        "reserve bank", "bank manager", "bank helpline",
        "customer care", "bank account blocked",
        "net banking", "debit card blocked"
    ]
}


# ─────────────────────────────────────────
# Classify Scam Category
# ─────────────────────────────────────────
def classify_scam_category(text: str) -> str:
    """
    Classify what TYPE of scam the message is.
    Returns category name or 'General Scam'
    """
    if not text:
        return "Unknown"

    text_lower = text.lower()
    scores     = {}

    for category, keywords in SCAM_CATEGORIES.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[category] = score

    if not scores:
        return "General Scam"

    return max(scores, key=scores.get)


# ─────────────────────────────────────────
# Get Category Color
# ─────────────────────────────────────────
def get_category_color(category: str) -> str:
    """Return color for each scam category."""
    colors = {
        "UPI Fraud":           "#FF7A00",
        "KYC Scam":            "#FF2D55",
        "Digital Arrest":      "#BF5FFF",
        "Lottery Scam":        "#FFD000",
        "Loan Fraud":          "#FF2D55",
        "Phishing":            "#00D2FF",
        "Investment Scam":     "#FF7A00",
        "Bank Impersonation":  "#FF2D55",
        "General Scam":        "#FF2D55",
        "Unknown":             "#4A7090",
    }
    return colors.get(category, "#FF2D55")


# ─────────────────────────────────────────
# Predict Scam
# ─────────────────────────────────────────
def predict_scam(text: str, models: dict) -> dict:
    """
    Main scam detection function.
    Called by scam_routes.py

    Args:
        text   : raw input message from user
        models : loaded models dict from model_loader

    Returns:
        Standard JSON response dict with scam_category
    """
    try:
        # ── Get models ──
        model      = models.get("scam_model")
        vectorizer = models.get("scam_vec")

        if model is None or vectorizer is None:
            return format_error("scam_radar", "Scam model not loaded")

        # ── Preprocess ──
        cleaned = clean_text(text)

        # ── Vectorize ──
        X = vectorizer.transform([cleaned])

        # ── Predict ──
        prediction  = model.predict(X)[0]
        probability = model.predict_proba(X)[0]
        confidence  = int(probability[1] * 100)

        # ── If ham (safe) use ham probability ──
        if prediction == 0:
            confidence = int(probability[0] * 100)
            confidence = min(confidence, 30)

        # ── Extract explanation ──
        flagged_words = extract_flagged_words(text)
        features      = extract_features(text)
        reason        = build_reason(features)

        # ── Smart confidence override ──
        if prediction == 0:
            confidence = min(confidence, 30)
            if len(flagged_words) >= 3:
                confidence = max(confidence, 70)
            elif len(flagged_words) >= 2:
                confidence = max(confidence, 50)
            elif len(flagged_words) >= 1:
                confidence = max(confidence, 35)
        else:
            confidence = max(confidence, 70)

        # ── Classify scam category ──
        category       = classify_scam_category(text)
        category_color = get_category_color(category)

        # ── Build result ──
        result = format_response(
            module        = "scam_radar",
            confidence    = confidence,
            reason        = reason,
            flagged_words = flagged_words
        )

        # ── Add category info ──
        result["scam_category"]       = category
        result["scam_category_color"] = category_color

        return result

    except Exception as e:
        return format_error("scam_radar", str(e))

        


