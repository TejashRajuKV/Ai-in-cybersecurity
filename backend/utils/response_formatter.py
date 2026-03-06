from flask import jsonify

def format_response(data, status=200):
    return jsonify(data), status
