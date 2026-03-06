from flask import Blueprint, request, jsonify
from utils.response_formatter import format_error
from modules.loan_risk import score_loan, get_rules
from risk_engine.explainer import explain_loan

loan_bp = Blueprint("loan", __name__)


# ─────────────────────────────────────────
# GET /api/loan/rules
# ─────────────────────────────────────────
@loan_bp.route("/api/loan/rules", methods=["GET"])
def loan_rules():
    """
    Returns all scoring rules for React checklist.
    Frontend calls this to build the checklist UI.

    Response:
    {
        "too_many_permissions": {"score": 30, "reason": "..."},
        "no_rbi_registration":  {"score": 40, "reason": "..."},
        ...
    }
    """
    try:
        rules = get_rules()
        return jsonify(rules), 200

    except Exception as e:
        return jsonify(
            format_error("loan_scorer", str(e))
        ), 500


# ─────────────────────────────────────────
# POST /api/loan
# ─────────────────────────────────────────
@loan_bp.route("/api/loan", methods=["POST"])
def loan_score():
    """
    Loan app risk scoring endpoint.

    Request body:
    {
        "too_many_permissions": true,
        "no_rbi_registration":  true,
        "instant_approval":     true,
        "high_interest_rate":   false,
        "not_on_playstore":     true,
        "requests_contacts":    true,
        "requests_sms":         true,
        "requests_location":    false,
        "no_physical_address":  true,
        "pressure_tactics":     false
    }

    Response:
    {
        "module":        "loan_scorer",
        "label":         "HIGH RISK",
        "confidence":    85,
        "risk_color":    "red",
        "reason":        "No RBI registration + Excessive permissions...",
        "flagged_words": ["no_rbi_registration", ...],
        "explanation":   {...}
    }
    """
    try:
        # ── Get request data ──
        data = request.get_json()

        if not data:
            return jsonify(
                format_error("loan_scorer", "No data provided")
            ), 400

        # ── Validate — at least one field required ──
        valid_keys = [
            "too_many_permissions",
            "no_rbi_registration",
            "instant_approval",
            "high_interest_rate",
            "not_on_playstore",
            "requests_contacts",
            "requests_sms",
            "requests_location",
            "no_physical_address",
            "pressure_tactics"
        ]

        has_valid = any(k in data for k in valid_keys)

        if not has_valid:
            return jsonify(
                format_error(
                    "loan_scorer",
                    "No valid fields provided"
                )
            ), 400

        # ── Normalize — convert all values to bool ──
        app_data = {
            key: bool(data.get(key, False))
            for key in valid_keys
        }

        # ── Run scoring ──
        result = score_loan(app_data)

        # ── Add explanation ──
        result["explanation"] = explain_loan(
            app_data,
            result["confidence"]
        )

        return jsonify(result), 200

    except Exception as e:
        return jsonify(
            format_error("loan_scorer", str(e))
        ), 500
