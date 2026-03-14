from flask import Blueprint, request, jsonify
from utils.model_loader import get_models
from utils.text_preprocessing import is_empty
from utils.response_formatter import format_error
from modules.toxicity_detector import check_toxicity

toxicity_bp = Blueprint("toxicity", __name__)


# ─────────────────────────────────────────
# POST /api/toxicity
# ─────────────────────────────────────────
@toxicity_bp.route("/api/toxicity", methods=["POST"])
def toxicity_detect():
    """
    Toxicity / cyberbullying detection endpoint.

    Request body:
    {
        "message": "You're a worthless loser..."
    }

    Response:
    {
        "module":             "toxicity_shield",
        "label":              "HIGH RISK",
        "confidence":         85,
        "risk_color":         "red",
        "reason":             "Cyberbullying patterns detected",
        "flagged_words":      ["worthless", "loser"],
        "toxicity_category":  "Cyberbullying",
        "severity":           "HIGH"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify(
                format_error("toxicity_shield", "No data provided")
            ), 400

        message = data.get("message", "")

        if is_empty(message):
            return jsonify(
                format_error("toxicity_shield", "Message cannot be empty")
            ), 400

        models = get_models()
        result = check_toxicity(message, models)

        return jsonify(result), 200

    except Exception as e:
        return jsonify(
            format_error("toxicity_shield", str(e))
        ), 500
