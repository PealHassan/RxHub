import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/AppointmentsPage.css'; // CSS for styling the page
import Swal from "sweetalert2";
function AppointmentsPage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('All'); // To store the current filter status

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/appointments/${user.userid}`);
                setAppointments(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [user.userid]);

    function cancelAppointment(appoint) {
        appoint.status = "Cancelled";
        try {
            Swal.fire({
                title: "Are You Sure ?",
                text: "Canceling this appointment means you'll lose your reserved time slot. Do you want to proceed?",
                icon: "warning",
                showCancelButton: true, // Show the 'No' button
                confirmButtonText: "Yes, go ahead", // Text for the 'Yes' button
                cancelButtonText: "No",   // Text for the 'No' button
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.post(`http://localhost:5000/appointments/createAppointment`, appoint);
                        Swal.fire({
                            title: "Cancelled",
                            text: "Your appointment has been successfully canceled.",
                            icon: "success",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "/Appointments";
                            }
                        });
                    } catch (error) {
                        console.log(error);
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Action if 'No' is clicked
                    return;
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    function viewAppointmentCopy(appointment) {
        window.location.href = `/AppointmentCopy/${appointment.id}`;
    }

    // Filter the appointments based on the selected filter
    const filteredAppointments = appointments.filter(appointment => {
        if (filter === 'All') return true;
        return appointment.status.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div className="appointments-container">
            {/* Header Section with Title and Dropdown */}
            <div className="appointments-header">
                <h1>Appointments</h1>
                <div className="filter-dropdown">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Failed to Attend">Failed to Attend</option>
                        <option value="Attended">Attended</option>
                    </select>
                </div>
            </div>

            {/* Appointment Cards */}
            <div className="grid-container">
                {filteredAppointments.map(appointment => (
                    <div className="appointment-card">
                        <div className="card-header">
                            <span className="patient-initial">
                                {appointment.patientName[0].toUpperCase()}
                            </span>
                            <div className="appointment-status">
                                <span className={`status-badge ${appointment.status.toLowerCase().replace(/\s/g, '-')}`}>
                                    {appointment.status}
                                </span>
                            </div>

                        </div>
                        <div className="card-body">
                            <h4>{appointment.patientName}</h4>
                            <p><b>Appointment Id : </b>{appointment.id}</p>
                            <p><b>Doctor : </b>{appointment.doctorName}</p>
                            <p><b>Date : </b>{appointment.date}</p>
                            <p><b>Time : </b>{appointment.time}</p>
                            <p><b>Chamber : </b>{appointment.chamberAddress}</p>
                            <p><b>Serial No : </b>{appointment.sl_no}</p>
                            {
                                appointment.status === "Scheduled" ?
                                    <div className="bothBtn"> 
                                        <button type="button" className="btn btn-info" onClick={()=>{viewAppointmentCopy(appointment)}}>View</button>
                                        <button type="button" className="btn btn-danger" onClick={() => cancelAppointment(appointment)}>Cancel</button>
                                    </div> :
                                    <div className="viewBtn">
                                        <button type="button" className="btn btn-info" onClick={()=>{viewAppointmentCopy(appointment)}}>View</button>
                                    </div>

                            }

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AppointmentsPage;
