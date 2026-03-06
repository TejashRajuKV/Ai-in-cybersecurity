import sys
import os
import numpy as np
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.url_features import extract_url_features, get_feature_values, build_phishing_reason
from utils.response_formatter import format_response, format_error


def check_phishing(url: str, models: dict) -> dict:
    """
    Main phishing URL detection function.
    Called by phishing_routes.py

    Args:
        url    : URL string to check
        models : loaded models dict from model_loader

    Returns:
        Standard JSON response dict
    """
    try:
        # ── Get model ──
        model = models.get("phishing_model")

        if model is None:
            # Fallback to rule-based only if model not loaded
            return _rule_based_check(url)

        # ── Extract features ──
        features     = extract_url_features(url)
        feature_vals = np.array([get_feature_values(features)])

        # ── Predict ──
        prediction   = model.predict(feature_vals)[0]         # 0 = legit, 1 = phishing
        probability  = model.predict_proba(feature_vals)[0]   # [legit_prob, phish_prob]
        confidence   = int(probability[1] * 100)              # phishing probability as %

        # ── Build reason ──
        reason        = build_phishing_reason(features)
        flagged_words = _get_flagged_parts(url, features)

        # ── Boost confidence with rules ──
        rule_flags = sum([
            features.get("has_ip", 0),
            features.get("has_suspicious_tld", 0),
            features.get("has_brand_in_domain", 0),
            features.get("is_shortened", 0),
            not features.get("is_https", 1),
        ])

        if rule_flags >= 3:
            confidence = max(confidence, 80)
        elif rule_flags == 2:
            confidence = max(confidence, 55)
        elif rule_flags == 1:
            confidence = max(confidence, 30)

        # If model says legit but URL looks very suspicious
        if prediction == 0 and rule_flags >= 2:
            confidence = max(confidence, 50)

        return format_response(
            module        = "phishing_detector",
            confidence    = confidence,
            reason        = reason,
            flagged_words = flagged_words
        )

    except Exception as e:
        return format_error("phishing_detector", str(e))


def _rule_based_check(url: str) -> dict:
    """
    Fallback: pure rule-based phishing detection
    when the model is not loaded.
    """
    try:
        features  = extract_url_features(url)
        reason    = build_phishing_reason(features)
        flagged   = _get_flagged_parts(url, features)

        rule_flags = sum([
            features.get("has_ip",               0),
            features.get("has_suspicious_tld",    0),
            features.get("has_brand_in_domain",   0),
            features.get("is_shortened",          0),
            features.get("has_suspicious_words",  0),
            int(not features.get("is_https", 1)),
        ])

        confidence = min(100, rule_flags * 20)

        return format_response(
            module        = "phishing_detector",
            confidence    = confidence,
            reason        = reason + " (rule-based fallback)",
            flagged_words = flagged
        )
    except Exception as e:
        return format_error("phishing_detector", str(e))


def _get_flagged_parts(url: str, features: dict) -> list:
    """Extract the suspicious parts from the URL."""
    flagged = []
    url_lower = url.lower()

    if features.get("has_ip"):
        flagged.append("IP in domain")
    if features.get("has_suspicious_tld"):
        flagged.append("Suspicious TLD")
    if features.get("has_brand_in_domain"):
        flagged.append("Brand impersonation")
    if features.get("is_shortened"):
        flagged.append("Shortened URL")
    if not features.get("is_https"):
        flagged.append("No HTTPS")
    if features.get("has_suspicious_words"):
        flagged.append("Suspicious keywords")

    return flagged
