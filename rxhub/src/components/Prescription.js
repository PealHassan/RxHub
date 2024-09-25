import React from 'react';
import '../styles/Prescription.css'; // Import custom CSS for styling
import logo from '../assets/logot.png';
import rx from '../assets/rx.png';

function Prescription({ prescription }) {
    const {
        appointmentId,
        doctorName,
        doctorUserId,
        doctorDegrees,
        doctorCategories,
        chamberId,
        chamberAddress,
        time,
        serialNo,
        patientName,
        patientUserId,
        address,
        age,
        sex,
        diagnosis,
        advice,
        medicines,
        date,
    } = prescription;
    const handlePrint = () => {
        window.print(); // Triggers the print dialog
    };


    return (
        <>
            <div className="prescription-background">
                <header className="prescription-header">
                    <div className="logo-section">
                        <img src={logo} alt="Doctor's Logo" className="logo" />
                    </div>
                    <div className="doctor-info">
                        <h2>{doctorName}</h2>
                        <p>{doctorDegrees.join(', ')}</p>
                        <p>{doctorCategories.join(', ')}</p>
                        <p>{chamberAddress}</p>
                        <p></p>
                    </div>
                </header>

                <section className="patient-info">
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: "30px",
                        marginRight: "30px"
                    }}>
                        <p><strong>Serial No : </strong>{serialNo}</p>
                        <p><strong>Date : </strong>{date}</p>
                    </div>
                    <p style={{
                        fontSize: "1em",
                        marginLeft: "30px",
                        marginRight: "30px"
                    }}
                    >
                        <strong>Patient's Name : </strong>{patientName}
                    </p>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: "30px",
                        marginRight: "30px"
                    }}>
                        <p><strong>UserId : </strong>{patientUserId}</p>
                        <p><strong>Age : </strong>{age}</p>
                        <p><strong>Gender : </strong>{sex}</p>
                    </div>
                    <p style={{
                        marginLeft: "30px",
                        marginRight: "30px"
                    }}
                    >
                        <strong>Address : </strong>{address}
                    </p>
                    <p style={{
                        marginTop: "30px",
                        marginLeft: "30px",
                        marginRight: "30px",

                    }}
                    >
                        <sup style={{
                            fontWeight: "bold",
                            fontSize: "1.5em",
                        }}
                        > Diagnosis : </sup>{diagnosis ? diagnosis : 'Not provided'}
                    </p>
                </section>
                <section className="medication-section" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <img
                        src={rx}
                        alt="rx"
                        className="rx-icon"
                        style={{ marginRight: '10px', marginLeft: '10px' }} // Add some space between the image and the table
                    />
                    <div className="medication-content" style={{ flexGrow: 1 }}>
                        {medicines.length > 0 ? (
                            <table className="medication-table">
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Before/After Meals</th>
                                        <th>Frequency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.map((medicine, index) => (
                                        <tr key={index}>
                                            <td>{medicine.name}</td>
                                            <td>{medicine.beforeAfter ? 'Before' : 'After'} Meals</td>
                                            <td>{medicine.frequency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No medicines prescribed</p>
                        )}
                    </div>
                </section>
                <section className="patient-info">
                    <p style={{
                        fontSize: "1em",
                        marginLeft: "30px",
                        marginRight: "30px",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        borderRadius: "10px",
                        padding: "10px"
                    }}
                    >
                        <strong>Advice : </strong>{advice}</p>
                </section>

                <footer className="prescription-footer">
                    <div><p><strong>Prescription ID : </strong> {appointmentId}</p></div>
                    <div><p><strong>Created At : </strong> {time}</p></div>
                </footer>
            </div>
            <button className="print-button" onClick={handlePrint}>
                Print Prescription
            </button>
        </>

    );
}

export default Prescription;
