import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/ActiveUsersPage.css';
import Swal from "sweetalert2";

function PendingRequestPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [id, setId] = useState(""); // Field for searching by ID

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5000/users/getUsers`);
      const activeDoctors = response.data.filter(user => user.status === 'pending' && user.role === 'doctor');
      console.log(activeDoctors);
      setUsers(activeDoctors);
      setFilteredUsers(activeDoctors);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let filtered = users;

    if (id) {
      filtered = filtered.filter(user => user.userid === id);
    }

    setFilteredUsers(filtered);
  }, [id, users]);

  async function acceptUser(User) {
    User['status'] = "active";
    try {
      await axios.post(`http://localhost:5000/users/registerUser`, User);
      Swal.fire({
        title: "Success",
        text: "Status Updated Successfully",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/pendingRequestPage";
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function declineUser(User) {
    try {
      await axios.post(`http://localhost:5000/users/deleteUser`, User);
      Swal.fire({
        title: "Success",
        text: "Decline Successfully",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/pendingRequestPage";
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="active-users-container">
      <h1><b>Pending Doctors</b></h1>

      <div className="filters">
        <div className="filter-group">
          <label>Search by ID: </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter User ID"
          />
        </div>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Contact No</th>
            <th>Address</th>
            <th>Specialization</th>
            <th>Degrees</th>
            <th>License Document</th>
            <th>Block</th>
            <th>Decline</th>

          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userid}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.dob}</td>
              <td>{user.contactNo}</td>
              <td>{user.address}</td>
              <td>{user.categories && user.categories.length > 0 ? user.categories.join(", ") : "N/A"}</td>
              <td>{user.degrees && user.degrees.length > 0 ? user.degrees.join(", ") : "N/A"}</td>
              <td>
                {user.fileUrl ? (
                  <a href={user.fileUrl} target="_blank" rel="noopener noreferrer">
                    View File {/* Replace this with any text or icon */}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              <td>
                <button className="btn btn-success" onClick={() => acceptUser(user)}>Accept</button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => declineUser(user)}>Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingRequestPage;
