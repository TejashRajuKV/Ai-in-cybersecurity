from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# ─────────────────────────────────────────
# Load environment variables FIRST
# ─────────────────────────────────────────
load_dotenv()

from config import PORT, DEBUG

# ─────────────────────────────────────────
# Create Flask app
# ─────────────────────────────────────────
app = Flask(__name__)

# ─────────────────────────────────────────
# Enable CORS
# ─────────────────────────────────────────
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ─────────────────────────────────────────
# Register Blueprints
# ─────────────────────────────────────────
from routes.health_routes    import health_bp
from routes.scam_routes      import scam_bp
from routes.behavior_routes  import behavior_bp
from routes.news_routes      import news_bp
from routes.loan_routes      import loan_bp
from routes.phishing_routes  import phishing_bp

app.register_blueprint(health_bp)
app.register_blueprint(scam_bp)
app.register_blueprint(behavior_bp)
app.register_blueprint(news_bp)
app.register_blueprint(loan_bp)
app.register_blueprint(phishing_bp)


# ─────────────────────────────────────────
# Root endpoint — confirms server is alive
# ─────────────────────────────────────────
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "project":  "CyberRakshak",
        "status":   "running",
        "version":  "1.0.0",
        "endpoints": [
            "GET  /api/health",
            "GET  /api/version",
            "POST /api/scam",
            "POST /api/fakenews",
            "POST /api/behavior",
            "POST /api/phishing",
            "POST /api/loan",
            "GET  /api/loan/rules"
        ]
    }), 200


# ─────────────────────────────────────────
# 404 Handler
# ─────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "error":     "Endpoint not found",
        "status":    404,
        "hint":      "Visit GET / to see all available endpoints"
    }), 404


# ─────────────────────────────────────────
# 500 Handler
# ─────────────────────────────────────────
@app.errorhandler(500)
def server_error(e):
    return jsonify({
        "error":   "Internal server error",
        "status":  500,
        "message": str(e)
    }), 500


# ─────────────────────────────────────────
# Load Models + Start Server
# ─────────────────────────────────────────
if __name__ == "__main__":
    from utils.model_loader import load_models

    print("\n" + "=" * 45)
    print("   CYBERRAKSHAK — BACKEND STARTING")
    print("=" * 45)

    load_models()

    print("=" * 45)
    print(f"   Running on  http://localhost:{PORT}")
    print(f"   Health:     http://localhost:{PORT}/api/health")
    print("=" * 45 + "\n")

    app.run(
        host="0.0.0.0",
        port=PORT,
        debug=DEBUG
    )
