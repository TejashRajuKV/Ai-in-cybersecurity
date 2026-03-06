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
    """

    try:
        # ── Load models ──
        model      = models.get("scam_model")
        vectorizer = models.get("scam_vec")

        if model is None or vectorizer is None:
            return format_error("scam_radar", "Scam model not loaded")

        # ── Preprocess text ──
        cleaned = clean_text(text)

        # ── Vectorize ──
        X = vectorizer.transform([cleaned])

        # ── Model prediction ──
        prediction  = model.predict(X)[0]           # 0 = safe, 1 = scam
        probability = model.predict_proba(X)[0]     # [safe_prob, scam_prob]

        model_score = probability[1] * 100

        # ── Extract signals ──
        flagged_words = extract_flagged_words(cleaned)
        features      = extract_features(cleaned)

        # ── Keyword detection ──
        text_lower = cleaned.lower()

        lottery_keywords = ["lottery", "won", "prize", "reward", "jackpot"]
        otp_keywords     = ["otp", "kyc", "verify", "account blocked"]

        keyword_score = len(flagged_words) * 8
        extra_reasons = []

        if any(k in text_lower for k in lottery_keywords):
            keyword_score += 40
            extra_reasons.append("Lottery / reward scam pattern detected")
            flagged_words.extend(["lottery", "prize"])

        if any(k in text_lower for k in otp_keywords):
            keyword_score += 30
            extra_reasons.append("OTP or account verification scam pattern detected")

        if "urgent" in text_lower or "immediately" in text_lower:
            keyword_score += 15
            extra_reasons.append("Urgency language detected")

        # ── Combine ML + rules ──
        confidence = int(model_score + keyword_score * 0.7)

        # Clamp range
        confidence = max(5, min(confidence, 95))

        # ── Strong rule override for clear scams ──
        if any(k in text_lower for k in lottery_keywords):
            confidence = max(confidence, 75)

        if any(k in text_lower for k in otp_keywords):
            confidence = max(confidence, 80)

        # ── Build reason text ──
        base_reason = build_reason(features)

        if extra_reasons:
            reason = base_reason + " + " + " + ".join(extra_reasons)
        else:
            reason = base_reason

        # ── Return formatted response ──
        return format_response(
            module        = "scam_radar",
            confidence    = confidence,
            reason        = reason,
            flagged_words = list(set(flagged_words))
        )

    except Exception as e:
        return format_error("scam_radar", str(e))
