import React, { useEffect, useState } from "react";
import "../styles/AppointmentSchedulerPage.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icons for navigation

function AppointmentSchedulerPage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [category, setCategory] = useState("All");
    const [chamberAddress, setChamberAddress] = useState("");
    const [chamberId, setChamberId] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [filterRes, setFilterRes] = useState([]);
    const [expandedRows, setExpandedRows] = useState(-1); // Track expanded rows
    const [currentDates, setCurrentDates] = useState({}); // Track current date for each expanded row
    const [availabilityCounter, setAvailabilityCounter] = useState({});
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
        let age = calculateAge(user.dob);

        let appoint = {
            "patientid": user.userid,
            "contactNo": user.contactNo,
            "degrees": filterRes[index].degrees,
            "categories": filterRes[index].categories,
            "patientAddress": user.address,
            "patientName": user.username,
            "patientAge": age,
            "patientGender": user.gender,
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
                text: "Have a great medication.",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/AppointmentSchedule";
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
                // console.log(response2.data);
                // console.log(response.data);
                setFiltered(response.data);
                setFilterRes(response.data);
                setAvailabilityCounter(response2.data);
                // availabilityCounter = response2.data;  
                // console.log(availabilityCounter);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleDateChange = (day, increment) => {
        setCurrentDates((prevDates) => {
            const updatedDate = new Date(prevDates[day]);
            updatedDate.setDate(updatedDate.getDate() + increment); // Shift by 7 days
            const today = new Date();
            if (updatedDate.toDateString() == today.toDateString()) {
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
        if (category !== "All") {
            filterRes = filterRes.filter((e) => e.categories.includes(category));
        }
        if (chamberAddress !== "") {
            filterRes = filterRes.filter((e) =>
                e.address.toLowerCase().includes(chamberAddress.toLowerCase())
            );
        }
        if (chamberId !== "") {
            filterRes = filterRes.filter((e) => e.id.includes(chamberId));
        }
        if (doctorName !== "") {
            filterRes = filterRes.filter((e) => e.name.toLowerCase().includes(doctorName.toLowerCase()));
        }

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

            <div className="filter-form">
                <div className="filter-fields">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">All</option>
                        {categoryOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Chamber Address"
                        value={chamberAddress}
                        onChange={(e) => setChamberAddress(e.target.value)}
                        className="filter-input"
                    />

                    <input
                        type="text"
                        placeholder="Chamber ID"
                        value={chamberId}
                        onChange={(e) => setChamberId(e.target.value)}
                        className="filter-input"
                    />

                    <input
                        type="text"
                        placeholder="Doctor Name"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <button className="filter-btn" onClick={handleFilter}>
                    Filter
                </button>
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
                                                                            isCurrentTimeBefore(day, timeSlot.endTime) ?
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

export default AppointmentSchedulerPage;
