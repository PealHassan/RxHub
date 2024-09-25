import React from 'react';
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

function NavBar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('currentUser'));

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/signin';
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="navbar-brand">
                    <img src={logo} alt="Logo" style={{ width: 'auto', height: '60px', marginLeft: "30px" }} />
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <ul className="navbar-nav mx-auto">

                                    <li className={`nav-item dropdown ${location.pathname === '/activeUsers' || location.pathname === '/blockedUsers' || location.pathname === '/pendingRequestPage' ? 'active' : ''}`}>
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            User Management
                                        </a>
                                        <ul className="dropdown-menu bg-light" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="/activeUsers">Active Users</a></li>
                                            <li><a className="dropdown-item" href="/blockedUsers">Blocked Users</a></li>
                                            <li><a className="dropdown-item" href="/pendingRequestPage">Pending User Requests</a></li>
                                        </ul>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/sendMessage' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/sendMessage">Send Message</Link>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/showAppointments' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/showAppointments">Appointments</Link>
                                    </li>
                                </ul>
                            ) : user.role === 'doctor' ? (
                                <ul className='navbar-nav mx-auto'>
                                    <li className={`nav-item ${location.pathname === '/PatientList' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/PatientList">Patient Management</Link>
                                    </li>
                                    <li className={`nav-item dropdown ${location.pathname === '/addChamber' || location.pathname === '/viewChamber' ? 'active' : ''}`}>
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Chamber Management
                                        </a>
                                        <ul className="dropdown-menu bg-light" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="/addChamber">Add Chamber</a></li>
                                            <li><a className="dropdown-item" href="/viewChamber">Chambers</a></li>
                                        </ul>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/fixAppointment' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/fixAppointment">Fix Appointment</Link>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="navbar-nav mx-auto">
                                    <li className={`nav-item ${location.pathname === '/AppointmentSchedule' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/AppointmentSchedule">Appointment Scheduler</Link>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/prescriptionHistory' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/prescriptionHistory">Prescription History</Link>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/Appointments' ? 'active' : ''}`}>
                                        <Link className="nav-link" to="/Appointments">Appointments</Link>
                                    </li>
                                </ul>
                            )}
                            <ul className='navbar-nav ml-auto'>
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {user.username}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-right bg-light" aria-labelledby="navbarDropdownUser">
                                    {user.role !== 'admin' && (
                                        <li><a className="dropdown-item" href="/settings">Settings</a></li>
                                    )}
                                    <li>
                                        <a className="dropdown-item" onClick={logout} href="/signin">Log Out</a>
                                    </li>
                                </ul>
                            </ul>
                        </>
                    ) : (
                        <ul className="navbar-nav ml-auto">
                            <li className={`nav-item ${location.pathname === '/signin' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/signin">Sign In</Link>
                            </li>
                            <li className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
