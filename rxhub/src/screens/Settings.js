import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Settings.css';
import Swal from 'sweetalert2';

const categoryOptions = [
    "Dermatologist",
    "Endocrinologist",
    "Cardiologist",
    "Neurologist",
    "Obstetrics and gynaecology",
    "Oncologist",
    "Gastroenterologist",
    "Pediatrics",
    "Medicine",
    "Hematology",
    "Infectious Disease Specialist",
    "Nephrologist",
    "Otorhinolaryngology",
    "Psychiatry",
    "Allergist",
    "Emergency medicine",
    "Internal medicine",
    "Ophthalmology",
    "Anesthesiology",
    "Cardiogeriatrics",
    "Geriatrics",
    "Hepatologist",
    "Pain management",
    "Radiology",
]; // Array for specializations

function SettingsPage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [activeSection, setActiveSection] = useState('personalInfo');
    const [mailCode, setMailCode] = useState(null);
    const [personalInfo, setPersonalInfo] = useState({
        username: user?.username || '',
        password: user?.password || '',
        userid: user?.userid || '',
        status: user?.status || '',
        role: user?.role || '',
        email: user?.email || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        address: user?.address || '',
        contactNo: user?.contactNo || '',
        categories: user?.categories || [],
        degrees: user?.degrees || []
    });
    const [specializations, setSpecializations] = useState(user?.categories || []);
    const [newSpecialization, setNewSpecialization] = useState('');
    const [degrees, setDegrees] = useState(user?.degrees || []);
    const [newDegree, setNewDegree] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    async function savePersonalInfo(data) {
        try {
            await axios.post(`http://localhost:5000/users/registerUser`, data);
            Swal.fire({
                title: "Success",
                text: "Changed Successfully",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('currentUser');
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    window.location.href = '/settings';
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handlePasswordChange = () => {
        if (password === '' || password !== confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match or Empty Field",
                icon: "error",
            });
            return;
        }
        if (!codeSent) {
            const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
            setMailCode(randomCode);
            const mail = {
                toEmail: user.email,
                subject: "Verification Code for New Password",
                body: `Your Verification Code is ${randomCode}`
            };
            try {
                axios.post(`http://localhost:5000/mails/sendEmail`, mail);
                setCodeSent(true);
                Swal.fire({
                    title: "Verification",
                    text: "Verification code sent to your email",
                    icon: "info",
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            if (verificationCode === mailCode) {
                const updatedPersonalInfo = { ...personalInfo, password: password };
                setPersonalInfo(updatedPersonalInfo);
                savePersonalInfo(updatedPersonalInfo);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Verification code does not match",
                    icon: "error",
                });
            }
        }
    };

    // Handle specialization addition and removal
    const addSpecialization = () => {
        if (newSpecialization && !specializations.includes(newSpecialization)) {
            setSpecializations([...specializations, newSpecialization]);
            setNewSpecialization('');
        }
    };

    const removeSpecialization = (index) => {
        const updatedSpecializations = [...specializations];
        updatedSpecializations.splice(index, 1);
        setSpecializations(updatedSpecializations);
    };

    const updateSpecialization = () => {
        const updatedPersonalInfo = { ...personalInfo, categories: specializations };
        setPersonalInfo(updatedPersonalInfo);
        savePersonalInfo(updatedPersonalInfo);
    }

    const addDegree = () => {
        if (newDegree) {
            setDegrees([...degrees, newDegree]);
            setPersonalInfo({ ...personalInfo, degrees: degrees });
            setNewDegree('');
        }
    };

    const updateDegree = () => {
        const updatedPersonalInfo = { ...personalInfo, degrees: degrees };
        setPersonalInfo(updatedPersonalInfo);
        savePersonalInfo(updatedPersonalInfo);
    }

    const removeDegree = (index) => {
        const updatedDegrees = [...degrees];
        updatedDegrees.splice(index, 1);
        setDegrees(updatedDegrees);
    };

    return (
        <div className="page">
            {/* Left pane */}
            <div className="left-pane">
                <div className='left-paneTop'>
                    <h2>{user.username}</h2>
                    <p><strong>Account Type : </strong>{user.role}</p>
                    <p><strong>Id : </strong>{user.userid}</p>
                </div>
                <hr style={{ height: "2px", marginRight: "20px", backgroundColor: "#5aa4b2", border: "none" }} />
                <div
                    className={activeSection === 'personalInfo' ? 'active-option' : 'option'}
                    onClick={() => setActiveSection('personalInfo')}
                >
                    Edit Personal Information
                </div>
                <div
                    className={activeSection === 'changePassword' ? 'active-option' : 'option'}
                    onClick={() => setActiveSection('changePassword')}
                >
                    Change Password
                </div>
                {user.role === 'doctor' && (
                    <>
                        <div
                            className={activeSection === 'updateSpecialization' ? 'active-option' : 'option'}
                            onClick={() => setActiveSection('updateSpecialization')}
                        >
                            Update Specialization
                        </div>
                        <div
                            className={activeSection === 'updateDegrees' ? 'active-option' : 'option'}
                            onClick={() => setActiveSection('updateDegrees')}
                        >
                            Update Degrees
                        </div>
                    </>
                )}
            </div>

            {/* Right pane */}
            <div className="right-pane">
                {activeSection === 'personalInfo' && (
                    <div>
                        <h2 className="header"><b>Edit Personal Information</b></h2>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={personalInfo.username}
                                onChange={handlePersonalInfoChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={personalInfo.email}
                                onChange={handlePersonalInfoChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={personalInfo.dob}
                                onChange={handlePersonalInfoChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={personalInfo.gender}
                                onChange={handlePersonalInfoChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={personalInfo.address}
                                onChange={handlePersonalInfoChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact No</label>
                            <input
                                type="text"
                                name="contactNo"
                                value={personalInfo.contactNo}
                                onChange={handlePersonalInfoChange}
                            />
                        </div>
                        <button type="button" className='btn btn-info' onClick={() => {

                            savePersonalInfo(personalInfo);
                        }}>Save Changes</button>
                    </div>
                )}

                {activeSection === 'changePassword' && (
                    <div>
                        <h2 className="header"><b>Change Password</b></h2>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {codeSent && (
                            <div className="form-group">
                                <label>Verification Code</label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                            </div>
                        )}
                        <button type="button" className='btn btn-info' onClick={handlePasswordChange}>
                            {codeSent ? 'Verify and Change Password' : 'Send Verification Code'}
                        </button>
                    </div>
                )}

                {activeSection === 'updateSpecialization' && (
                    <div>
                        <h2 className="header"><b>Update Specialization</b></h2>
                        {specializations.map((specialization, index) => (
                            <div key={index} className='degree'>
                                <span>{specialization}</span>
                                <button type="button" className="btn btn-danger" onClick={() => removeSpecialization(index)}>Remove</button>
                            </div>
                        ))}
                        <div className="form-group">
                            <select
                                value={newSpecialization}
                                onChange={(e) => setNewSpecialization(e.target.value)}
                            >
                                <option value="">Select Specialization</option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <button type="button" onClick={addSpecialization} className='btn btn-info'
                                style={{
                                    marginTop: "20px",
                                }}>Add</button>
                            <button type="button" onClick={updateSpecialization} className='btn btn-info'
                                style={{
                                    marginTop: "20px",
                                }}>Save Changes</button>
                        </div>
                    </div>
                )}

                {activeSection === 'updateDegrees' && (
                    <div>
                        <h2 className="header"><b>Update Degrees</b></h2>
                        {degrees.map((degree, index) => (
                            <div key={index} className='degree'>
                                <span>{degree}</span>
                                <button type="button" className="btn btn-danger" onClick={() => removeDegree(index)}>remove</button>
                            </div>
                        ))}
                        <div className="form-group">
                            <input
                                type="text"
                                value={newDegree}
                                onChange={(e) => setNewDegree(e.target.value)}
                                placeholder="Add new degree"
                            />
                            <button type="button" onClick={addDegree} className='btn btn-info' style={{
                                marginTop: "20px",
                            }}>Add</button>

                            <button type="button" onClick={updateDegree} className='btn btn-info' style={{
                                marginTop: "20px",
                            }}>Save Changes</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SettingsPage;
