import React, { useState } from "react";
import axios from "axios";
import "../styles/RegisterPage.css";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { storage } from "../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

function RegisterPage() {
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [userid, setUserId] = useState("");
  const [role, setRole] = useState("patient");
  const [degrees, setDegrees] = useState([]);
  const [categories, setCategories] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState();
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState();
  const [User, setUser] = useState();
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [dob, setDob] = useState(getTodayDate);

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
  ];

  const uploadFile = async () => {
    if (!file) return;
    const fileRef = ref(storage, `files/${v4()}`);
    const snapshot = await uploadBytes(fileRef, file);
    return getDownloadURL(snapshot.ref);
  };
  async function valid(user) {
    if (!username || !password || !userid || !email || !address || !contactNo) {
      Swal.fire({
        title: "Error",
        text: "Empty Records",
        icon: "error",
      });
      return false;
    }
    if (role === 'doctor') {

      if (categories.length === 0 || degrees.length === 0 || file === null) {

        Swal.fire({
          title: "Error",
          text: "Please fill out all required doctor information (categories, degrees, and medical license).",
          icon: "error",
        });
        return false;
      }
    }
    if ((await axios.post(`http://localhost:5000/users/isExist`, user)).data) {
      Swal.fire({
        title: "Error",
        text: "User with NID or COB already exists",
        icon: "error",
      });
      return false;
    }
    if (password !== confirmpassword) {
      Swal.fire({
        title: "Error",
        text: "Password and Confirm Password Doesn't Match",
        icon: "error",
      });
      return false;
    }
    return true;
  }


  const register = async () => {
    const user = {
      userid,
      password,
      contactNo,
      gender,
      address,
      dob,
      username,
      email,
      role,
      status: role === "patient" ? "active" : "pending",
      categories: role === "doctor" ? categories : [],
      degrees: role === "doctor" ? degrees : [],
      fileUrl: role === "doctor" ? fileUrl : null,
    };
    setUser(user);
    if (await valid(user)) {
      sendCode();
    }
  };
  function sendCode() {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(randomCode);
    const mail = {
      toEmail: email,
      subject: "Verification Code for Authentication",
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
      Swal.fire({
        title: "Error",
        text: "Mail Not Sent",
        icon: "error",
      });
    }
  }
  async function verify() {
    const user = User;
    if (code === verificationCode) {

      try {
        setLoading(true);
        if (file && role === "doctor") {
          const url = await uploadFile();
          setFileUrl(url);
          user.fileUrl = url;
        }
        await axios.post(`http://localhost:5000/users/registerUser`, user);
        setLoading(false);
        Swal.fire({
          title: "Success",
          text: "Registered Successfully",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/signin";
          }
        });
      } catch (error) {
        setLoading(false);
      }
    }
    else {
      Swal.fire({
        title: "Error",
        text: "Verification Code doesn't match",
        icon: "error",
      })
    }
  }

  return (
    <div className="register-Container">
      <h2>Register</h2>
      {/* Personal Information Section */}
      <div className="topSection">
        <div className="section">
          <h3 className="section-header">Personal Information</h3>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="text"
            id="nidOrCob"
            placeholder="NID or COB"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>



        {/* Contact Information */}
        <div className="form-Container">

          {/* Contact Information Section */}
          <div className="contact-info">
            <h3 className="section-header">Contact Information</h3>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              id="contactNo"
              placeholder="Contact No"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              required
            />
          </div>

          {/* Password Section */}
          <div className="password-info">
            <h3 className="section-header">Password Section</h3>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

          </div>
          {/* Address Information */}
          <div className="address-info">
            <h3 className="section-header">Address Information</h3>
            <input
              type="text"
              id="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
      </div>




      {/* Role Selection */}
      <div className="radio-group" onChange={(e) => setRole(e.target.value)}>
        <input type="radio" id="patient" name="role" value="patient" defaultChecked />
        <label htmlFor="patient">I am a Patient</label>
        <input type="radio" id="doctor" name="role" value="doctor" />
        <label htmlFor="doctor">I am a Doctor</label>
      </div>

      {/* Additional Information for Doctors */}
      {role === "doctor" && (
        <div>

          <div className="doctor-form-Container">
            {/* Category Section */}
            <div className="category-info">
              <h3 className="section-header">Category</h3>
              {categories.map((category, index) => (
                <div className="category-input-row" key={index}>
                  <select
                    className="category-select"
                    value={category}
                    onChange={(e) =>
                      setCategories(
                        categories.map((c, i) => (i === index ? e.target.value : c))
                      )
                    }
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    className="remove-category-btn"
                    onClick={() =>
                      setCategories(categories.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-category-btn"
                onClick={() => setCategories([...categories, ""])}
              >
                Add Category
              </button>
            </div>
            {/* Degrees Section */}
            <div className="degree-info">
              <h3 className="section-header">Degrees</h3>
              {degrees.map((degree, index) => (
                <div className="degree-input-row" key={index}>
                  <input
                    className="degree-input"
                    value={degree}
                    onChange={(e) =>
                      setDegrees(
                        degrees.map((d, i) => (i === index ? e.target.value : d))
                      )
                    }
                    placeholder="Degree"
                  />
                  <button
                    className="remove-degree-btn"
                    onClick={() =>
                      setDegrees(degrees.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-degree-btn"
                onClick={() => setDegrees([...degrees, ""])}
              >
                Add Degree
              </button>
            </div>
            <div className="file-info">
              <h3 className="section-header">Upload Medical License</h3>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
          </div>



          {/* Medical License */}

        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        codeSent ? <div>
          <input
            type="text"
            id="code"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <div>
            
          </div>
          <div style={{marginTop:"20px"}}>
          <button className="btn btn-info" onClick={verify}>
            Verify
          </button>
          <button className="btn btn-info" onClick={sendCode} style={{marginLeft:"20px"}}>
            Send Verification Code Again
          </button>
          </div>
        </div> :

          <button className="btn btn-info" onClick={register}>
            Register
          </button>
      )}
    </div>
  );
}

export default RegisterPage;
