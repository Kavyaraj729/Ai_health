import os
from flask import Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
from login import auth, init_auth
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# ✅ **Secure MySQL Configuration**
app.config["MYSQL_HOST"] = os.getenv("MYSQL_HOST", "localhost")
app.config["MYSQL_USER"] = os.getenv("MYSQL_USER", "root")
app.config["MYSQL_PASSWORD"] = os.getenv("MYSQL_PASSWORD", "")
app.config["MYSQL_DB"] = os.getenv("MYSQL_DB", "healthcare_ai_db")
app.config["MYSQL_CURSORCLASS"] = "DictCursor"

# Initialize MySQL
mysql = MySQL(app)

# Initialize authentication
init_auth(app, mysql)

# Register the authentication blueprint
app.register_blueprint(auth)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
