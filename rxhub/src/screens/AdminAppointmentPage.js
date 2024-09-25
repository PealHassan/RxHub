import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminAppointmentPage.css"; // Assuming you have a separate CSS file

function AdminAppointmentPage() {
  const [appoints, setAppoints] = useState([]);
  const [filteredAppoints, setFilteredAppoints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5000/appointments/getAppointments`);
      setAppoints(response.data);
      setFilteredAppoints(response.data); // Initially show all
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = appoints;

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((appoint) => appoint.status === statusFilter);
    }

    // Apply appointment ID filter
    if (appointmentId) {
      filtered = filtered.filter((appoint) => appoint.id === appointmentId);
    }

    // Apply patient ID filter
    if (patientId) {
      filtered = filtered.filter((appoint) => appoint.patientid === patientId);
    }

    // Apply doctor ID filter
    if (doctorId) {
      filtered = filtered.filter((appoint) => appoint.doctorid === doctorId);
    }

    setFilteredAppoints(filtered);
  }, [statusFilter, appointmentId, patientId, doctorId, appoints]);

  return (
    <div className="admin-appointment-container">
      
      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Failed to Attend">Failed to Attend</option>
            <option value="Attended">Attended</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Appointment ID:</label>
          <input
            type="text"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            placeholder="Enter Appointment ID"
          />
        </div>

        <div className="filter-group">
          <label>Patient ID:</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter Patient ID"
          />
        </div>

        <div className="filter-group">
          <label>Doctor ID:</label>
          <input
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            placeholder="Enter Doctor ID"
          />
        </div>
      </div>

      <table className="appointment-table">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Appointment ID</th>
            <th>Patient Name</th>
            <th>Patient ID</th>
            <th>Doctor Name</th>
            <th>Doctor ID</th>
            <th>Chamber Address</th>
            <th>Time</th>
            <th>Date</th>
            <th>Status</th>
            <th>Degrees</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppoints.map((appoint, index) => (
            <tr key={appoint._id}>
              <td>{index + 1}</td>
              <td>{appoint.id}</td>
              <td>{appoint.patientName}</td>
              <td>{appoint.patientid}</td>
              <td>{appoint.doctorName}</td>
              <td>{appoint.doctorid}</td>
              <td>{appoint.chamberAddress}</td>
              <td>{appoint.time}</td>
              <td>{appoint.date}</td>
              <td>{appoint.status}</td>
              <td>{appoint.degrees && appoint.degrees.length > 0 ? appoint.degrees.join(", ") : "N/A"}</td>
              <td>{appoint.categories && appoint.categories.length > 0 ? appoint.categories.join(", ") : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAppointmentPage;
