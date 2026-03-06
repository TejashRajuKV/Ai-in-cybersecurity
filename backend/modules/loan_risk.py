import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.response_formatter import format_response, format_error

# ─────────────────────────────────────────
# Scoring Rules
# ─────────────────────────────────────────
SCORING_RULES = {
    "too_many_permissions": {
        "score": 30,
        "reason": "App requests excessive permissions (contacts, SMS, camera)"
    },
    "no_rbi_registration": {
        "score": 40,
        "reason": "No RBI registration found for this lender"
    },
    "instant_approval": {
        "score": 20,
        "reason": "Claims instant approval with no documents"
    },
    "high_interest_rate": {
        "score": 25,
        "reason": "Interest rate exceeds 36% APR"
    },
    "not_on_playstore": {
        "score": 15,
        "reason": "App not found on official Google Play Store"
    },
    "requests_contacts": {
        "score": 20,
        "reason": "App requests access to your contacts list"
    },
    "requests_sms": {
        "score": 20,
        "reason": "App requests access to your SMS messages"
    },
    "requests_location": {
        "score": 10,
        "reason": "App requests continuous location access"
    },
    "no_physical_address": {
        "score": 15,
        "reason": "No physical office address provided"
    },
    "pressure_tactics": {
        "score": 25,
        "reason": "Uses pressure tactics like limited time offer"
    },
}

# Max possible score
MAX_SCORE = sum(rule["score"] for rule in SCORING_RULES.values())


# ─────────────────────────────────────────
# Score Loan App
# ─────────────────────────────────────────
def score_loan(app_data: dict, models: dict = None) -> dict:
    """
    Main loan app risk scoring function.
    Rule-based hybrid scoring — no ML model needed.
    Called by loan_routes.py

    Args:
        app_data : dict with boolean flags matching SCORING_RULES keys
                   Example:
                   {
                       "too_many_permissions": True,
                       "no_rbi_registration": True,
                       "instant_approval": False
                   }
        models   : not used, kept for consistency with other modules

    Returns:
        Standard JSON response dict
    """
    try:
        total_score   = 0
        reasons       = []
        flagged_rules = []

        # ── Apply each rule ──
        for rule_key, rule_info in SCORING_RULES.items():
            if app_data.get(rule_key, False):
                total_score += rule_info["score"]
                reasons.append(rule_info["reason"])
                flagged_rules.append(rule_key)

        # ── Normalize to 0-100 ──
        if MAX_SCORE > 0:
            confidence = int((total_score / MAX_SCORE) * 100)
        else:
            confidence = 0

        confidence = min(100, confidence)

        # ── Build reason string ──
        if reasons:
            reason = " • ".join(reasons)
        else:
            reason = "No risk factors detected — app appears legitimate"

        return format_response(
            module="loan_scorer",
            confidence=confidence,
            reason=reason,
            flagged_words=flagged_rules
        )

    except Exception as e:
        return format_error("loan_scorer", str(e))


# ─────────────────────────────────────────
# Get All Rules (for frontend checklist)
# ─────────────────────────────────────────
def get_rules() -> dict:
    """
    Returns all scoring rules.
    Called by loan_routes.py to send
    checklist to React frontend.
    """
    return {
        key: {
            "score": rule["score"],
            "reason": rule["reason"]
        }
        for key, rule in SCORING_RULES.items()
    }
