from flask import Blueprint, request, jsonify

scam_bp = Blueprint('scam', __name__)

@scam_bp.route('/detect', methods=['POST'])
def detect_scam():
    data = request.json
    text = data.get('text', '')
    
    # Placeholder for actual detection logic
    risk_score = 15.5 # dummy
    is_scam = False
    
    return jsonify({
        "input": text,
        "is_scam": is_scam,
        "risk_score": risk_score,
        "confidence": 0.92,
        "findings": ["No malicious patterns detected"]
    })
