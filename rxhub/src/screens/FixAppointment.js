import React, { useEffect, useState } from "react";
import "../styles/AppointmentSchedulerPage.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icons for navigation

function FixAppointment() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
   
    const [doctorName, setDoctorName] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [filterRes, setFilterRes] = useState([]);
    const [expandedRows, setExpandedRows] = useState(-1); // Track expanded rows
    const [currentDates, setCurrentDates] = useState({}); // Track current date for each expanded row
    const [availabilityCounter, setAvailabilityCounter] = useState({});

    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientAddress, setPatientAddress] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientContactNo, setPatientContactNo] = useState("");

    
    function isCurrentTimeBefore(day, targetTime) {
        const dateStr = new Date(currentDates[day]).toDateString();
        if (!/^\d{2}:\d{2}$/.test(targetTime)) {
            throw new Error('Invalid time format. Use "hh:mm".');
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date string.');
        }
        const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
        const targetDateTime = new Date(date);
        targetDateTime.setHours(targetHours, targetMinutes, 0, 0);
        const now = new Date();
        return now < targetDateTime;
    }
    function calculateAge(birthDateString) {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return age;
    }
    async function createAppointment(index, day, slotIndex) {
        let time_val = `${filterRes[index].times[day][slotIndex].startTime} - ${filterRes[index].times[day][slotIndex].endTime}`;
        let date = new Date(currentDates[day]).toDateString();


        let appoint = {
            "patientid": patientId,
            "contactNo" : patientContactNo,
            "degrees" : filterRes[index].degrees,
            "categories" : filterRes[index].categories,
            "patientAddress": patientAddress,
            "patientName": patientName,
            "patientAge": patientAge,
            "patientGender": patientGender,
            "chamberid": filterRes[index].id,
            "chamberAddress": filterRes[index].address,
            "doctorid": filterRes[index].userid,
            "doctorName": filterRes[index].name,
            "time": time_val,
            "date": date,
            "sl_no": getSerial(filterRes[index].id, date, time_val) + 1
        };
        // console.log(appoint); 
        try {
            await axios.post("http://localhost:5000/appointments/createAppointment", appoint);
            Swal.fire({
                title: "Appointed",
                text: "Appointment Created Successfully",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/fixAppointment";
                }
            });
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/chambers/getChambers`);
                const response2 = await axios.get(`http://localhost:5000/appointments/getAvailibility`);
                setFiltered(response.data);
                setFilterRes(response.data);
                setAvailabilityCounter(response2.data);
                handleFilter();
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [filterRes,filtered]);

    const handleDateChange = (day, increment) => {
        setCurrentDates((prevDates) => {
            const updatedDate = new Date(prevDates[day]);
            updatedDate.setDate(updatedDate.getDate() + increment); // Shift by 7 days
            const today = new Date();
            if(updatedDate.toDateString() === today.toDateString()) {
                return { ...prevDates, [day]: updatedDate };
            }
            else if (updatedDate >= today || increment > 0) {
                return { ...prevDates, [day]: updatedDate };
            } else {
                return prevDates; // Do not update if it's in the past
            }
        });
    };

    const handleFilter = () => {
        let filterRes = filtered;
        console.log(user.userid);
        filterRes = filterRes.filter((e) => e.userid.includes(user.userid));
        console.log(filterRes);
        setFilterRes(filterRes);
    };

    const toggleRow = (index, days) => {
        if (expandedRows !== index) {
            setExpandedRows(index);
            if (!currentDates[days[0]]) {
                const initialDates = {};
                days.forEach((day) => {
                    initialDates[day] = getNextDayDate(new Date(), day);
                });
                setCurrentDates({ ...initialDates });
            }
            // setExpandedRows(expandedRows.filter((i) => i !== index));
        } else {
            setExpandedRows(-1);
        }
    };



    function getNextDayDate(currentDate, dayName) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const targetDayIndex = daysOfWeek.indexOf(dayName);
        const currentDayIndex = currentDate.getDay();
        let daysUntilNext = targetDayIndex - currentDayIndex;
        if (daysUntilNext < 0) {
            daysUntilNext += 7;
        }
        const nextDayDate = new Date(currentDate);
        nextDayDate.setDate(currentDate.getDate() + daysUntilNext);
        return nextDayDate;
    }
    const getCounter = (chamberId, date, time) => {
        if (availabilityCounter[chamberId] && availabilityCounter[chamberId][date] && availabilityCounter[chamberId][date][time]) {
            const timeSlot = availabilityCounter[chamberId][date][time];
            const count = Object.keys(timeSlot)[0];
            return parseInt(count, 10);
        } else {
            return 0;
        }
    };
    const getSerial = (chamberId, date, time) => {
        if (availabilityCounter[chamberId] && availabilityCounter[chamberId][date] && availabilityCounter[chamberId][date][time]) {
            const timeSlot = availabilityCounter[chamberId][date][time];
            const count = Object.keys(timeSlot)[0];
            return parseInt(timeSlot[count], 10);
        } else {
            return 0;
        }
    };

    return (
        <div className="scheduler-container">
            <div className="patient-info">
                <input
                    type="text"
                    placeholder="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="patient-input"
                />
                <input
                    type="text"
                    placeholder="Patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="patient-input"
                />
                <input
                    type="number"
                    placeholder="Patient Age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="patient-input"
                />
                <input
                    type="text"
                    placeholder="Patient Address"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    className="patient-input"
                />
                <input
                    type="text"
                    placeholder="Patient Gender"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="patient-input"
                />
                <input
                    type="text"
                    placeholder="Patient Contact No"
                    value={patientContactNo}
                    onChange={(e) => setPatientContactNo(e.target.value)}
                    className="patient-input"
                />
            </div>
            <div className="results-table">
                <div className="table-header">
                    <div className="table-cell">Name</div>
                    <div className="table-cell">Categories</div>
                    <div className="table-cell">Chamber Address</div>
                    <div className="table-cell">Chamber ID</div>
                    <div className="table-cell">Contact No.</div>
                    <div className="table-cell"></div>
                </div>
                <div className="table-body">
                    {filterRes.map((item, index) => (
                        <div key={item._id}>
                            <div className="table-row">
                                <div className="table-cell">{item.name}</div>
                                <div className="table-cell">{item.categories.join(", ")}</div>
                                <div className="table-cell">{item.address}</div>
                                <div className="table-cell">{item.id}</div>
                                <div className="table-cell">{item.contactNo}</div>


                                <div className="table-cell">
                                    <button className="btn btn-info" onClick={() => toggleRow(index, item.days)}>
                                        {expandedRows === index ? <FaChevronDown></FaChevronDown> : <FaChevronRight></FaChevronRight>}
                                    </button>
                                </div>
                            </div>

                            {expandedRows === index && (
                                <div className="table-row details-row">
                                    <div className="table-cell" colSpan="6">
                                        <h4>Available Appointments for {item.name}</h4>
                                        <table className="results-table">
                                            <thead>
                                                <tr className="table-row">
                                                    <th className="table-cell">Day</th>
                                                    <th className="table-cell">Date</th>
                                                    <th className="table-cell">Navigate</th>
                                                    <th className="table-cell">Time</th>
                                                    <th className="table-cell">Max Patients</th>
                                                    <th className="table-cell">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(item.times).map((day, dayIndex) => (
                                                    <div>
                                                        <tr key={dayIndex} className="table-row">
                                                            <td className="table-cell">{day}</td>
                                                            <td className="table-cell">
                                                                {currentDates[day] ? new Date(currentDates[day]).toDateString() : "N/A"}
                                                            </td>
                                                            <td className="table-cell">
                                                                <div>
                                                                    <div className="btn btn-info" style={{ marginRight: "2px" }}>
                                                                        <FaChevronLeft
                                                                            onClick={() => handleDateChange(day, -7)}
                                                                            style={{ cursor: "pointer", marginRight: "5px" }}
                                                                        />
                                                                    </div>
                                                                    <div className="btn btn-info" style={{ marginLeft: "2px" }}>
                                                                        <FaChevronRight
                                                                            onClick={() => handleDateChange(day, 7)}
                                                                            style={{ cursor: "pointer", marginLeft: "5px" }}
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </td>

                                                            <td className="table-cell" colSpan="4">
                                                                {item.times[day].map((timeSlot, slotIndex) => (
                                                                    <div key={`${day}-${slotIndex}`} className="table-cell">
                                                                        {timeSlot.startTime}-{timeSlot.endTime}
                                                                    </div>
                                                                ))}
                                                            </td>

                                                            <td className="table-cell" colSpan="4">
                                                                {item.times[day].map((timeSlot, slotIndex) => (
                                                                    <div key={`${day}-${slotIndex}`} className="table-cell">
                                                                        {getCounter(filterRes[index].id, new Date(currentDates[day]).toDateString(), `${timeSlot.startTime} - ${timeSlot.endTime}`)}/{timeSlot.maxPatients}
                                                                    </div>
                                                                ))}
                                                            </td>

                                                            <td className="table-cell" colSpan="4">
                                                                {item.times[day].map((timeSlot, slotIndex) => (
                                                                    <div key={`${day}-${slotIndex}`} className="table-cell">
                                                                        {getCounter(filterRes[index].id, new Date(currentDates[day]).toDateString(), `${timeSlot.startTime} - ${timeSlot.endTime}`) === Number(timeSlot.maxPatients) ?
                                                                            <button type="button" className="btn btn-success" disabled>Fix Appoint</button> :
                                                                            isCurrentTimeBefore(day,timeSlot.endTime) ?
                                                                                <button type="button" className="btn btn-success" onClick={() => createAppointment(index, day, slotIndex)}>Fix Appoint</button> :
                                                                                <button type="button" className="btn btn-success" disabled>Fix Appoint</button>
                                                                        }

                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                        <div style={{ backgroundColor: "#DDDDDD", height: "2px", width: "100%" }}></div>

                                                    </div>

                                                ))}
                                            </tbody>
                                        </table>
                                        <div style={{ backgroundColor: "#DDDDDD", height: "2px", width: "100%" }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FixAppointment;
