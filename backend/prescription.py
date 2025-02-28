from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="your_username",
    password="your_password",
    database="your_database"
)

cursor = db.cursor()

# API to fetch prescriptions for a patient using their full name
@app.route("/prescriptions", methods=["GET"])
def get_prescriptions():
    try:
        patient_name = request.args.get("patient_name")
        
        if not patient_name:
            return jsonify({"error": "Patient name is required"}), 400
        
        query = "SELECT prescription_text FROM prescriptions WHERE patient_name = %s"
        cursor.execute(query, (patient_name,))
        prescriptions = cursor.fetchall()
        
        return jsonify([p[0] for p in prescriptions]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to add a prescription (Doctor only)
@app.route("/prescriptions", methods=["POST"])
def add_prescription():
    try:
        data = request.json
        doctor_id = data.get("doctor_id")
        patient_name = data.get("patient_name")  # Use patient name instead of ID
        prescription_text = data.get("prescription_text")

        if not doctor_id or not patient_name or not prescription_text:
            return jsonify({"error": "All fields are required"}), 400

        query = "INSERT INTO prescriptions (doctor_id, patient_name, prescription_text) VALUES (%s, %s, %s)"
        cursor.execute(query, (doctor_id, patient_name, prescription_text))
        db.commit()

        return jsonify({"message": "Prescription added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
