import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.text_preprocessing import clean_text, extract_flagged_words
from utils.feature_engineering import extract_features, build_reason
from utils.response_formatter import format_response, format_error

# ─────────────────────────────────────────
# Toxicity Categories
# ─────────────────────────────────────────
TOXICITY_CATEGORIES = {
    "Hate Speech": [
        "hate", "racist", "racism", "sexist", "sexism",
        "homophobic", "bigot", "nazi", "supremacy",
        "inferior race", "go back to your country"
    ],
    "Cyberbullying": [
        "kill yourself", "kys", "loser", "ugly",
        "nobody likes you", "worthless", "pathetic",
        "die", "jump off", "end your life"
    ],
    "Harassment": [
        "stalk", "harass", "threat", "rape",
        "assault", "attack", "doxx", "expose you",
        "find you", "coming for you"
    ],
    "Offensive Language": [
        "stupid", "idiot", "moron", "dumb",
        "shut up", "trash", "garbage", "disgusting"
    ],
}

SEVERITY_MAP = {
    "Hate Speech":        "HIGH",
    "Cyberbullying":      "HIGH",
    "Harassment":         "HIGH",
    "Offensive Language":  "MEDIUM",
    "General Toxicity":   "MEDIUM",
}


def classify_toxicity_type(text: str) -> str:
    """Classify what TYPE of toxicity the message has."""
    if not text:
        return "General Toxicity"
    text_lower = text.lower()
    scores = {}
    for category, keywords in TOXICITY_CATEGORIES.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[category] = score
    if not scores:
        return "General Toxicity"
    return max(scores, key=scores.get)


def get_toxicity_color(category: str) -> str:
    colors = {
        "Hate Speech":        "#FF2D55",
        "Cyberbullying":      "#BF5FFF",
        "Harassment":         "#FF3D00",
        "Offensive Language":  "#FF9D00",
        "General Toxicity":   "#FF7A00",
    }
    return colors.get(category, "#FF7A00")


# ─────────────────────────────────────────
# Main Detection Function
# ─────────────────────────────────────────
def check_toxicity(text: str, models: dict) -> dict:
    """
    Main toxicity detection function.
    Called by toxicity_routes.py
    """
    try:
        model      = models.get("toxicity_model")
        vectorizer = models.get("toxicity_vec")

        if model is None or vectorizer is None:
            return format_error("toxicity_shield", "Toxicity model not loaded")

        # ── Preprocess ──
        cleaned = clean_text(text)
        X = vectorizer.transform([cleaned])

        # ── Predict ──
        prediction = model.predict(X)[0]   # 0 = safe, 1 = toxic

        try:
            proba = model.predict_proba(X)[0]
            confidence = int(proba[1] * 100) if prediction == 1 else int(proba[0] * 100)
        except Exception:
            confidence = 75 if prediction == 1 else 20

        # ── Classify category ──
        category       = classify_toxicity_type(text)
        category_color = get_toxicity_color(category)
        severity       = SEVERITY_MAP.get(category, "MEDIUM")

        # ── Extract flagged words ──
        flagged_words = extract_flagged_words(text)

        # ── Build reason ──
        features = extract_features(text)
        reason   = build_reason(features)

        if prediction == 1 and not reason:
            reason = "ML model detected toxic linguistic patterns"
        elif prediction == 0 and not flagged_words:
            reason = "No toxic patterns detected — content appears safe"

        # ── Boost confidence for strong keyword matches ──
        if prediction == 1 and severity == "HIGH":
            confidence = max(confidence, 80)
        elif prediction == 0 and len(flagged_words) == 0:
            confidence = min(confidence, 30)

        # ── Build result ──
        result = format_response(
            module        = "toxicity_shield",
            confidence    = confidence,
            reason        = reason,
            flagged_words = flagged_words
        )

        result["toxicity_category"]       = category
        result["toxicity_category_color"] = category_color
        result["severity"]                = severity

        return result

    except Exception as e:
        return format_error("toxicity_shield", str(e))
