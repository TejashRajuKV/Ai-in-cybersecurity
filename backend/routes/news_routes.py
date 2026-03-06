from flask import Blueprint, request, jsonify

news_bp = Blueprint('news', __name__)

@news_bp.route('/check', methods=['POST'])
def check_news():
    data = request.json
    url = data.get('url', '')
    # Placeholder for fake news detection logic
    return jsonify({
        "url": url,
        "is_fake": False,
        "reliability_score": 0.85
    })
