import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    List, ListItem, ListItemText, TextField
} from "@mui/material";
import axios from "axios";

const Prescription = ({ open, handleClose, role }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescription, setPrescription] = useState("");
    const [prescriptions, setPrescriptions] = useState([]);

    // Fetch patients list when search query changes (for doctors)
    useEffect(() => {
        if (role === "doctor" && searchQuery.length > 1) {
            axios.get(`http://localhost:5000/patients?query=${searchQuery}`)
                .then(response => setPatients(response.data))
                .catch(error => console.error("Error fetching patients:", error));
        }
    }, [searchQuery, role]);

    // Fetch prescriptions for selected patient
    useEffect(() => {
        if (selectedPatient) {
            axios.get(`http://localhost:5000/prescriptions?patient_name=${selectedPatient}`)
                .then(response => setPrescriptions(response.data))
                .catch(error => console.error("Error fetching prescriptions:", error));
        }
    }, [selectedPatient]);

    // Handle adding a prescription (only for doctors)
    const handleAddPrescription = () => {
        if (!selectedPatient || !prescription) {
            alert("Please select a patient and enter a prescription.");
            return;
        }

        axios.post("http://localhost:5000/prescriptions", {
            doctor_id: 1, // Replace with the logged-in doctor's ID
            patient_name: selectedPatient,
            prescription_text: prescription
        }).then(() => {
            alert("Prescription added successfully!");
            setPrescription("");
            setPrescriptions([...prescriptions, prescription]); // Update UI
        }).catch(error => console.error("Error adding prescription:", error));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Prescriptions</DialogTitle>
            <DialogContent>
                {role === "doctor" && (
                    <>
                        <TextField
                            label="Search Patient"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <List>
                            {patients.map((patient, index) => (
                                <ListItem key={index} button onClick={() => setSelectedPatient(patient)}>
                                    <ListItemText primary={patient} />
                                </ListItem>
                            ))}
                        </List>

                        {selectedPatient && (
                            <>
                                <h3>Prescriptions for {selectedPatient}</h3>
                                <List>
                                    {prescriptions.length > 0 ? (
                                        prescriptions.map((p, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={p} />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <p>No prescriptions found</p>
                                    )}
                                </List>
                                <TextField
                                    label="New Prescription"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                />
                                <Button onClick={handleAddPrescription} color="primary" variant="contained">
                                    Add Prescription
                                </Button>
                            </>
                        )}
                    </>
                )}

                {role !== "doctor" && (
                    <List>
                        {prescriptions.length > 0 ? (
                            prescriptions.map((p, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={p} />
                                </ListItem>
                            ))
                        ) : (
                            <p>No prescriptions available</p>
                        )}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Prescription;
