from flask import Blueprint, request, jsonify
from flask_mysqldb import MySQL
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

# Create Blueprint
auth = Blueprint('auth', __name__)
mysql = MySQL()

# JWT Configuration
JWT_SECRET_KEY = 'your_jwt_secret_key'
JWT_EXPIRATION_HOURS = 24

def init_auth(app):
    mysql.init_app(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token.split()[1], JWT_SECRET_KEY, algorithms=["HS256"])
            current_user = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

class AuthManager:
    @staticmethod
    def register_user(data):
        try:
            # Extract user data
            full_name = data.get('fullName')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')

            # Validate required fields
            if not all([full_name, email, password, role]):
                return {'message': 'Missing required fields'}, 400

            # Hash password
            hashed_password = generate_password_hash(password)

            cur = mysql.connection.cursor()
            
            # Check if email exists
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                cur.close()
                return {'message': 'Email already registered'}, 400

            # Insert new user
            cur.execute(
                """INSERT INTO users (full_name, email, password_hash, role) 
                VALUES (%s, %s, %s, %s)""",
                (full_name, email, hashed_password, role)
            )
            mysql.connection.commit()
            user_id = cur.lastrowid

            # Create role-specific details
            if role == 'doctor':
                cur.execute(
                    "INSERT INTO doctor_details (user_id) VALUES (%s)",
                    (user_id,)
                )
            else:
                cur.execute(
                    "INSERT INTO patient_details (user_id) VALUES (%s)",
                    (user_id,)
                )
            
            mysql.connection.commit()

            # Generate JWT token
            token = jwt.encode({
                'user_id': user_id,
                'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
            }, JWT_SECRET_KEY)

            response_data = {
                'message': 'Registration successful',
                'token': token,
                'user': {
                    'id': user_id,
                    'fullName': full_name,
                    'email': email,
                    'role': role
                }
            }
            
            cur.close()
            return response_data, 201

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return {'message': f'Registration failed: {str(e)}'}, 500

    @staticmethod
    def login_user(data):
        try:
            # Extract login data
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')

            if not all([email, password, role]):
                return {'message': 'Missing required fields'}, 400

            cur = mysql.connection.cursor()
            
            # Get user details
            cur.execute(
                """SELECT id, full_name, password_hash, role 
                FROM users WHERE email = %s""",
                (email,)
            )
            user = cur.fetchone()
            cur.close()

            # Verify credentials
            if user and check_password_hash(user[2], password):
                # Verify role
                if user[3] != role:
                    return {'message': 'Invalid role for this account'}, 401

                # Generate token
                token = jwt.encode({
                    'user_id': user[0],
                    'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
                }, JWT_SECRET_KEY)

                return {
                    'token': token,
                    'user': {
                        'id': user[0],
                        'fullName': user[1],
                        'email': email,
                        'role': role
                    }
                }, 200

            return {'message': 'Invalid credentials'}, 401

        except Exception as e:
            print(f"Login error: {str(e)}")
            return {'message': f'Login failed: {str(e)}'}, 500

    @staticmethod
    def verify_token(current_user):
        try:
            cur = mysql.connection.cursor()
            cur.execute(
                """SELECT full_name, email, role 
                FROM users WHERE id = %s""",
                (current_user,)
            )
            user = cur.fetchone()
            cur.close()

            if user:
                return {
                    'valid': True,
                    'user': {
                        'id': current_user,
                        'fullName': user[0],
                        'email': user[1],
                        'role': user[2]
                    }
                }, 200
            return {'valid': False}, 401

        except Exception as e:
            return {'message': f'Token verification failed: {str(e)}'}, 500

# Blueprint routes
@auth.route('/api/register', methods=['POST'])
def register():
    response, status_code = AuthManager.register_user(request.get_json())
    return jsonify(response), status_code

@auth.route('/api/login', methods=['POST'])
def login():
    response, status_code = AuthManager.login_user(request.get_json())
    return jsonify(response), status_code

@auth.route('/api/verify-token', methods=['GET'])
@token_required
def verify_token(current_user):
    response, status_code = AuthManager.verify_token(current_user)
    return jsonify(response), status_code
