CREATE DATABASE IF NOT EXISTS healthcare_ai_db;
USE healthcare_ai_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctor_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE patient_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date_of_birth DATE,
    gender VARCHAR(20),
    medical_history TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE medical_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_path VARCHAR(255) NOT NULL,
    scan_type VARCHAR(50) NOT NULL,
    prediction_result TEXT,
    confidence_score FLOAT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    patient_id INT,
    diagnosis TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (patient_id) REFERENCES patient_details(id)
);

CREATE TABLE scan_annotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT,
    annotation_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES medical_scans(id)
);
CREATE TABLE prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    patient_name VARCHAR(255) NOT NULL, -- Changed to store full names
    prescription_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE medical_scans 
ADD COLUMN patient_id INT,
ADD COLUMN diagnosis TEXT,
ADD FOREIGN KEY (patient_id) REFERENCES patient_details(id); 