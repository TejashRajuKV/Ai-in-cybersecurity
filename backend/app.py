from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Config
    app.config.from_pyfile('config.py')

    # Register Blueprints
    from routes.health_routes import health_bp
    from routes.scam_routes import scam_bp
    from routes.behavior_routes import behavior_bp
    from routes.news_routes import news_bp
    from routes.loan_routes import loan_bp

    app.register_blueprint(health_bp, url_prefix='/api/health')
    app.register_blueprint(scam_bp, url_prefix='/api/scam')
    app.register_blueprint(behavior_bp, url_prefix='/api/behavior')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(loan_bp, url_prefix='/api/loan')

    @app.route('/')
    def index():
        return {"message": "CyberRakshak AI Backend is Running", "status": "success"}

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
