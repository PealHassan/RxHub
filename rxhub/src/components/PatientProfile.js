import React from 'react';
import '../styles/PatientProfile.css';
import gmail from '../assets/gmail.png';
import mobile from '../assets/mobile.png';
function PatientProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return (
        <div className="profile-section">
            <div className="profile-card">
                <div style={{
                    textAlign: "left",
                }}>
                    <p style={{
                        fontWeight: "bold",
                        fontSize: "35px",
                    }}>{user.username}</p>
                    <p style={{
                        fontSize: "20px",
                    }}>{user.role}</p>
                </div>
                <hr style={{
                    height: "5px",
                    backgroundColor: "#8EC8DB",
                    border: "none",
                    borderRadius: "5px",
                    margin: "20px 0"
                }} />
                <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>ID:</strong>
                        <span>{user.userid}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Gender:</strong>
                        <span>{user.gender}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Date of Birth:</strong>
                        <span>{user.dob}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Address:</strong>
                        <span>{user.address}</span>
                    </div>
                </div>
                <hr style={{
                    height: "1px",
                    backgroundColor: "#8EC8DB",
                    border: "none",
                    borderRadius: "5px",
                    margin: "20px 0"
                }} />
                <div style={{
                    textAlign: "left",
                }}>
                    <p>
                        <strong>
                            <img
                                src={gmail}
                                alt="Email Icon"
                                style={{ width: '30px', height: '30px', marginRight: '5px' }}
                            />
                        </strong> {user.email}
                    </p>
                    <p>
                        <strong>
                            <img
                                src={mobile}
                                alt="Phone Icon"
                                style={{ width: '30px', height: '30px', marginRight: '5px' }}
                            />
                        </strong> {user.contactNo}
                    </p>
                </div>




            </div>
        </div>
    );
}

export default PatientProfile;
