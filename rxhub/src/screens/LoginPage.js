import React, { useState } from "react";
import axios from "axios";
import '../styles/LoginPage.css';
import Loader from "../components/Loader";
import Swal from 'sweetalert2';
import logo from '../assets/signinBack.png';

function LoginPage() {
  const [userid, setUserId] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  async function login() {
    const user = { userid, password };

    if (!userid || !password) {
      Swal.fire({
        title: "Empty Records",
        text: "Fill out required Fields",
        icon: "warning",
      });
      return;
    }

    if (!(await axios.post(`http://localhost:5000/users/isExist`, user)).data) {
      Swal.fire({
        title: "Error",
        text: "User Doesn't Exist",
        icon: "error",
      });
      return;
    }

    const foundUser = (await axios.post(`http://localhost:5000/users/findUserById`, user)).data;
    if (foundUser['password'] !== password) {
      Swal.fire({
        title: "Error",
        text: "Wrong Password",
        icon: "error",
      });
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    const User = JSON.parse(localStorage.getItem('currentUser'));
    if (User.role === 'patient') {
      if (User.status === 'blocked') {
        Swal.fire({
          title: "Sorry",
          text: "Admin Blocked You",
          icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            window.location.href = "/signin";
          }
        });
      } else {
        window.location.href = "/AppointmentSchedule";
      }
    } else if (User.role === 'doctor') {
      if (User.status === 'pending') {
        Swal.fire({
          title: "Keep Patience",
          text: "Admin didn't confirm your registration yet.",
          icon: "info",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            window.location.href = "/signin";
          }
        });
      } else if (User.status === 'blocked') {
        Swal.fire({
          title: "Sorry",
          text: "Admin Blocked You",
          icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            window.location.href = "/signin";
          }
        });
      } else {
        window.location.href = "/PatientList";
      }
    } else {
      window.location.href = "/pendingRequestPage";
    }
  }

  return (
    <div className="outsidelogin">
      <div className="tips-container">
        <h1>Welcome to RxHub!</h1>
        <p>We're here to assist you with managing your <b style={{fontSize:"20px"}}>prescriptions</b> and <b style={{fontSize:"20px"}}>appointments</b> efficiently.</p>
        <img src={logo} alt="RxHub Logo" className="login-logo" /> 
      </div>

      <div className="login-container">
        
        <div id="loginForm">
          <input
            type="text"
            id="userid"
            placeholder="NID or COB"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {loading ? <Loader /> : <button type="submit" onClick={login}>Sign In</button>}
      </div>
    </div>
  );
}

export default LoginPage;
