import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/ActiveUsersPage.css'; 
import Swal from "sweetalert2";

function BlockedUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [role, setRole] = useState("patient"); // Default to 'patient'
  const [id, setId] = useState(""); // Field for searching by ID

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5000/users/getUsers`);
      const activeUsers = response.data.filter(user => user.status === 'blocked');
      console.log(activeUsers);
      setUsers(activeUsers);
      setFilteredUsers(activeUsers.filter(user => user.role === role));
    };
    fetchData();
  }, [role, id]);

  useEffect(() => {
    let filtered = users.filter(user => user.role === role);

    if (id) {
      filtered = filtered.filter(user => user.userid === id);
    }

    setFilteredUsers(filtered);
  }, [id, role, users]);
  async function unblockUser(User) {
    User['status'] = "active";
    try {
        await axios.post(`http://localhost:5000/users/registerUser`,User);
        Swal.fire({
            title: "Success",
            text: "Unblocked Successfully",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/blockedUsers";
            }
          });
    } catch (error) {
        console.log(error);  
    }
  }

  return (
    <div className="active-users-container">
      <h1><b>Blocked Users</b></h1>

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Role: </label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

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
            <th>Role</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Contact No</th>
            <th>Address</th>
            {role === "doctor" && <th>Specialization</th>}
            {role === "doctor" && <th>Degrees</th>}
            <th>Block</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user,index) => (
            <tr>
              <td>{index+1}</td>
              <td>{user.userid}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.gender}</td>
              <td>{user.dob}</td>
              <td>{user.contactNo}</td>
              <td>{user.address}</td>
              {user.role === "doctor" && (
                <td>{user.categories && user.categories.length > 0 ? user.categories.join(", ") : "N/A"}</td>
              )}
              {user.role === "doctor" && (
                <td>{user.degrees && user.degrees.length > 0 ? user.degrees.join(", ") : "N/A"}</td>
              )}
              <td>
                <button className="btn btn-warning" onClick={()=>{unblockUser(user)}}>Unblock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlockedUsersPage;
