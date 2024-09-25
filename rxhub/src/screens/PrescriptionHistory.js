import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/PrescriptionHistory.css'; 
import Prescription from '../components/Prescription.js';

function PrescriptionHistory() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [prescriptions, setPrescriptions] = useState([]);
    const [showPrescription, setShowPrescription] = useState(false);
    const [prescription, setPrescription] = useState({});

    // Fetch prescriptions on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/prescriptions/getPrescriptions/${user.userid}`);
                setPrescriptions(response.data);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };
        fetchData();
    }, []);
    function handleView(prescription) {
        setShowPrescription(true);
        setPrescription(prescription);
    }


    return (
        <div className="container">
            {showPrescription ? <div>
                <button type = "button" className="btn btn-dark" style = {{
                    width : "100%",
                    marginBottom : "20px",
                }}onClick={() => {
                    setShowPrescription(false);
                }}>Back</button>
                <Prescription
                    prescription={prescription}
                ></Prescription>
            </div> :
                <div>
                    
                    {prescriptions.length > 0 ? (
                        <div className="grid">
                            {prescriptions.map((prescription) => (
                                <div key={prescription._id} className="card">
                                    <div className="header">
                                        <span><b>{prescription.date}</b></span>
                                        <span><b>{prescription.time}</b></span>
                                    </div>
                                    <div className="info">
                                        <h4><b>{prescription.doctorName}</b></h4>
                                        {prescription.doctorDegrees.length > 0 ? (
                                            <p>{prescription.doctorDegrees.join(', ')}</p>
                                        ) : (
                                            <p>
                                                Not available</p>
                                        )}
                                        {prescription.doctorCategories.length > 0 ? (
                                            <p>{prescription.doctorCategories.join(', ')}</p>
                                        ) : (
                                            <p> Not available</p>
                                        )}
                                        <p>{prescription.chamberAddress}</p>
                                    </div>

                                    <button className="btn btn-info" onClick={() => handleView(prescription)}>
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No prescriptions available.</p>
                    )}
                </div>
            }


        </div>
    );

    // "View" button click handler

}

export default PrescriptionHistory;
