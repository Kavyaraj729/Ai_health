from flask import Flask
from flask_cors import CORS
from login import auth, init_auth

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# MySQL Configuration
app.config.update(
    MYSQL_HOST='localhost',
    MYSQL_USER='root',
    MYSQL_PASSWORD='',
    MYSQL_DB='healthcare_ai_db'
)

# Initialize authentication
init_auth(app)

# Register the auth blueprint
app.register_blueprint(auth)

if __name__ == '__main__':
    app.run(debug=True, port=5000)