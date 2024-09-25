import React, { useState } from "react";
import axios from "axios";
import '../styles/LoginPage.css';
import Loader from "../components/Loader";
import Swal from 'sweetalert2';
function LandingPage() {
    const [userid,setUserId] = useState();  
    const [password,setPassword] = useState();   
    const [message,setMessage] = useState();
    const [loading,setLoading] = useState(false);  
    async function login() {
        // setLoading(true);
        const user = {
            "userid" : userid,  
            "password" : password
        }
        if(userid == null || password == null) {
            Swal.fire({
                title: "Empty Records",
                text: "Fill out required Fields",
                icon: "warning",
              }) 
            setLoading(false);  
            return;  
        }
        
        if(!(await axios.post(`http://localhost:5000/users/isExist`,user)).data) {
            Swal.fire({
                title: "Error",
                text: "User Doesn't Exist",
                icon: "error",
              });
            setLoading(false);  
            return;
        }
        const foundUser = (await axios.post(`http://localhost:5000/users/findUserById`,user)).data;
        if(foundUser['password'] !== password) {
            Swal.fire({
                title: "Error",
                text: "Wrong Password",
                icon: "error",
              });
            // setLoading(false);  
            return;  
        }
    
        // setLoading(false);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        const User = JSON.parse(localStorage.getItem('currentUser'));
        if(User.role === 'patient') {
            if(User.status === 'blocked') {
                Swal.fire({
                    title: "Sorry",
                    text: "Admin Blocked You",
                    icon: "error",
                  });
                localStorage.removeItem('currentUser');
                window.location.href = "/signin";
            }
            else window.location.href = "/AppointmentSchedule";
        }
        else if(User.role === 'doctor'){
            if(User.status === 'pending') {
                Swal.fire({
                    title: "Keep Patience",
                    text: "Admin didn't confirm your registration yet.",
                    icon: "info",
                });
                localStorage.removeItem('currentUser');
                window.location.href = "/signin";
            }
            else if(User.status === 'blocked') {
                Swal.fire({
                    title: "Sorry",
                    text: "Admin Blocked You",
                    icon: "error",
                  });
                localStorage.removeItem('currentUser');
                window.location.href = "/signin";
            }
            else window.location.href = "/PatientList";
        }
        else window.location.href = "/pendingRequestPage";
    }
    return (
        <div class="login-container">
            <h2>Sign In</h2>
            <div id="loginForm">
                <input type="text" id="userid" placeholder="NID or COB" value={userid} onChange={(e)=>setUserId(e.target.value)} required/>
                <input type="password" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            {loading ? <Loader/> : <button type="submit" onClick={login}>Sign In</button>}
        </div>
    )
}
export default LandingPage
