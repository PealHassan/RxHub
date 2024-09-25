import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/PatientListPage.css';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icons for navigation
import GenPresPage from "./GenPresPage";


function PatientListPage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [patientData, setPatientData] = useState({});
    const [chamberList, setChamberList] = useState([]);
    const [selectedChamber, setSelectedChamber] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [rx, setRx] = useState(false);
    const [pat, setPat] = useState({});
    var [pindex, setPindex] = useState();
    var [pday, setPday] = useState();
    var [pslotIndex, setPslotIndex] = useState();
    const [oldPres, setOldPres] = useState([]);
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [validPres, setValidPres] = useState(true);


    const filteredPrescriptions = filter === 'yours'
        ? oldPres.filter(prescription => prescription.doctorUserId === user.userid)
        : oldPres;
    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index); // Toggle between expanding and collapsing
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const responsePat = await axios.get(`http://localhost:5000/appointments/getPatientListByDay`);
                const responseCham = await axios.get(`http://localhost:5000/chambers/findChamberByUserid/${user.userid}`);

                setPatientData(responsePat.data);
                console.log(responsePat.data);
                setChamberList(responseCham.data);
                // validPrescribe(selectedDate);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const toggleChamberDropdown = (chamber) => {
        setSelectedChamber(selectedChamber === chamber.id ? null : chamber.id); // Toggle chamber dropdown
    };

    const toggleDayDropdown = (day) => {
        setSelectedDay(selectedDay === day ? null : day); // Toggle day dropdown
    };

    const handleSlotClick = (index, day, slotIndex) => {
        setPindex(index);
        setPday(day);
        setPslotIndex(slotIndex);
        let start = chamberList[index].times[day][slotIndex].startTime;
        let end = chamberList[index].times[day][slotIndex].endTime;
        let time = `${start} - ${end}`;
        let chamid = chamberList[index].id;

        let dateObj = new Date(selectedDate);
        let options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
        let formattedDate = dateObj.toLocaleDateString('en-US', options).replace(/,/g, '');

        if (patientData[formattedDate] && patientData[formattedDate][chamid] && patientData[formattedDate][chamid][time]) {
            setFilteredPatients(patientData[formattedDate][chamid][time]);
        } else {
            setFilteredPatients([]);
        }
    };

    async function validPrescribe(date) {
        let dateObj = new Date(date);
        let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        let formattedDate = dateObj.toLocaleDateString('en-US', options).replace(/,/g, '');
        let today = new Date();
        let formattedToday = today.toLocaleDateString('en-US', options).replace(/,/g, '');
        if (formattedDate === formattedToday) setValidPres(true);
        else setValidPres(false);
    }
    useEffect(() => {
        if (chamberList.length > 0) {
            setSelectedChamber(chamberList[0].id); // Set the first chamber as selected initially
        }
    }, [chamberList]);

    useEffect(() => {
        console.log(filteredPatients);
    }, [filteredPatients]);
    async function refresh() {
        const responsePat = await axios.get(`http://localhost:5000/appointments/getPatientListByDay`);
        setPatientData(responsePat.data);
    }
    useEffect(() => {
        if (rx && patientData) {
            handleSlotClick(pindex, pday, pslotIndex);
            setRx(false);
        }
    }, [patientData]);


    return (
        <div className="patientList-container">
            <div className="sidebar">
                <h2><b>Chambers</b></h2>
                <ul className="chamber-list">
                    {chamberList.map((chamber, index) => (
                        <li key={index} className="chamber-item">
                            <button className="chamber-btn" onClick={() => toggleChamberDropdown(chamber)}>
                                <p><b>Chamber-{index + 1}</b> ({chamber.address}) </p>
                                {selectedChamber === chamber.id ?
                                    <FaChevronDown className="chamberIcon"></FaChevronDown> :
                                    <FaChevronRight className="chamberIcon"></FaChevronRight>
                                }
                            </button>
                            {selectedChamber === chamber.id && (
                                <div className="chamber-dropdown">

                                    <ul className="day-list">
                                        {chamber.days.map((day, dayIndex) => (
                                            <li key={dayIndex} className="day-item">
                                                <button className="day-btn" onClick={() => toggleDayDropdown(day)}>
                                                    {day}
                                                    {selectedDay === day ?
                                                        <FaChevronDown className="chamberIconDay"></FaChevronDown> :
                                                        <FaChevronRight className="chamberIconDay"></FaChevronRight>
                                                    }
                                                </button>
                                                {/* Show slots for the selected day */}
                                                {selectedDay === day && (
                                                    <ul className="slot-list">
                                                        {chamber.times[day].map((slot, slotIndex) => (
                                                            <li key={slotIndex} className="slot-item">
                                                                <button className="slot-btn" onClick={() => handleSlotClick(index, day, slotIndex)}>
                                                                    {slot.startTime} - {slot.endTime} (Max Patients: {slot.maxPatients})
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            {rx ?
                <div className="main-content">
                    <div className="top-bar">

                        <h2>
                            <FaChevronLeft style={{ "marginRight": "20px" }} onClick={() => refresh()}></FaChevronLeft>
                            <b>Prescription</b>
                        </h2>

                        <h2><b>Old Prescriptions</b></h2>
                    </div>

                    <div className="presContent">
                        <div><GenPresPage
                            appoint={pat}
                            appointmentId={pat.id}
                            doctorName={pat.doctorName}
                            doctorId={pat.doctorid}
                            doctorDegrees={pat.degrees}
                            doctorCategories={pat.categories}
                            chamberId={pat.chamberid}
                            chamberAddress={pat.chamberAddress}
                            serialNo={pat.sl_no}
                            patientName={pat.patientName}
                            patientId={pat.patientid}
                            address={pat.patientAddress}
                            age={pat.patientAge}
                            sex={pat.patientGender}
                            date={selectedDate}
                        />
                        </div>
                        <div className="oldPrescriptionContent">
                            {/* Filter buttons */}
                            <div className="oldPrescriptionTopButton">
                                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn btn-success' : 'btn btn-secondary'}>All</button>
                                <button onClick={() => setFilter('yours')} className={filter === 'yours' ? 'btn btn-success' : 'btn btn-secondary'}>Yours Only</button>
                            </div>

                            {/* Prescription cards */}
                            <div className="oldPrescriptionCard">
                                {filteredPrescriptions.map((prescription, index) => (
                                    <div key={prescription._id} className="oldPresCard">
                                        <div className="oldPresCardHeader" onClick={() => toggleExpand(index)}>
                                            <span><b>Prescription {index + 1}</b></span>
                                            <span>{expanded === index ? <FaChevronDown style={{ "color": "black" }}></FaChevronDown> : <FaChevronRight style={{ "color": "black" }}></FaChevronRight>}</span>
                                        </div>

                                        {/* Expand card content */}
                                        {expanded === index && (
                                            <div className="card-content">
                                                <p>
                                                    <strong>Doctor:</strong> {prescription.doctorName}
                                                    {prescription.doctorCategories.length > 0 && (
                                                        <span> ({prescription.doctorCategories.join(', ')})</span>
                                                    )}
                                                </p>
                                                <p><strong>Chamber Address:</strong> {prescription.chamberAddress}</p>
                                                <p><strong>Date:</strong> {prescription.date}</p>
                                                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                                <p><strong>Medicines:</strong></p>
                                                <ol>
                                                    {prescription.medicines.map((medicine, i) => (
                                                        <li key={i}>
                                                            {medicine.name} - {medicine.timing} - {medicine.frequency}
                                                        </li>
                                                    ))}
                                                </ol>
                                                <p><strong>Advice:</strong> {prescription.advice}</p>
                                            </div>

                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>


                </div> :

                <div className="main-content">
                    {/* Top bar with Date input */}
                    <div className="top-bar">
                        <h2><b>Patient's List</b></h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={async (e) => {
                                setSelectedDate(e.target.value);
                                await validPrescribe(e.target.value);
                                setSelectedChamber(null);
                                setFilteredPatients([]);
                            }}
                            className="date-input"
                        />
                    </div>

                    {/* Patient List */}
                    <div className="patient-list-container">
                        {filteredPatients.length === 0 ? (
                            <p>No patients found for the selected date, chamber, and slot.</p>
                        ) : (
                            <table className="patient-table">
                                <thead>
                                    <tr>
                                        <th>Serial No.</th>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Age</th>
                                        <th>Phone Number</th>
                                        <th>Address</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map((patient, index) => (
                                        <tr key={index}>
                                            <td>{patient.sl_no}</td>
                                            <td>{patient.patientName}</td>
                                            <td>{patient.patientGender}</td>
                                            <td>{patient.patientAge}</td>
                                            <td>{patient.contactNo}</td>
                                            <td>{patient.patientAddress}</td>
                                            <td>{validPres ? <button type="button" className="btn btn-info" onClick={async () => {
                                                try {
                                                    const response = (await axios.get(`http://localhost:5000/prescriptions/getPrescriptions/${patient.patientid}`)).data;
                                                    setRx(true);
                                                    setOldPres(response);
                                                    console.log(oldPres);
                                                    setPat(patient);
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}>
                                                Prescribe Medication
                                            </button> : <button type="button" className="btn btn-info" onClick={async () => {
                                                try {
                                                    const response = (await axios.get(`http://localhost:5000/prescriptions/getPrescriptions/${patient.patientid}`)).data;
                                                    setRx(true);
                                                    setOldPres(response);
                                                    console.log(oldPres);
                                                    setPat(patient);
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }} disabled>
                                                Prescribe Medication
                                            </button>}


                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            }

        </div>
    );
}

export default PatientListPage;
