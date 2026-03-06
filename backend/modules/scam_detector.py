import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.text_preprocessing import clean_text, extract_flagged_words
from utils.feature_engineering import extract_features, build_reason
from utils.response_formatter import format_response, format_error

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
        Standard JSON response dict
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
        prediction   = model.predict(X)[0]          # 0 = ham, 1 = spam
        probability  = model.predict_proba(X)[0]    # [ham_prob, spam_prob]
        confidence   = int(probability[1] * 100)    # spam probability as %

        # ── If ham (safe), use ham probability ──
        if prediction == 0:
            confidence = int(probability[0] * 100)

        # ── Extract explanation ──
        flagged_words = extract_flagged_words(text)
        features      = extract_features(text)
        reason        = build_reason(features)

        # ── If model says safe but keywords found → bump to medium ──
        if prediction == 0 and len(flagged_words) > 2:
            confidence = max(confidence, 45)

        return format_response(
            module        = "scam_radar",
            confidence    = confidence,
            reason        = reason,
            flagged_words = flagged_words
        )

    except Exception as e:
        return format_error("scam_radar", str(e))
