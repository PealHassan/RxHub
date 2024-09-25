import { useState } from 'react';
import '../styles/GenPresPage.css'; // Assuming you will create a CSS file for styling
import axios from 'axios';
import Swal from 'sweetalert2';
import Prescription from '../components/Prescription';



function GenPresPage({ appoint, appointmentId, doctorName, doctorId, doctorDegrees, doctorCategories, chamberId, chamberAddress, serialNo, patientName, patientId, address, age, sex, date }) {
    const [test, setTest] = useState(0);
    const [showPres, setShowPres] = useState(false);
    const [formData, setFormData] = useState({
        appointmentId: appointmentId,
        doctorName: doctorName,
        doctorUserId: doctorId,
        doctorDegrees: doctorDegrees ? doctorDegrees : [],
        doctorCategories: doctorCategories ? doctorCategories : [],
        chamberId: chamberId,
        chamberAddress: chamberAddress,
        time: '',
        serialNo: serialNo,
        patientName: patientName,
        patientUserId: patientId,
        address: address,
        age: age,
        sex: sex,
        diagnosis: '',
        advice: '',
        medicines: [],
        date: date,
    });

    async function createPrescription() {
        setTest(1);
        try {
            Swal.fire({
                title: "Are You Sure?",
                text: "Submitting this prescription will permanently create a new, unchangeable record. Please ensure all details are correct before proceeding.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, go ahead",
                cancelButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const currentDate = new Date();
                        const hours = currentDate.getHours();
                        const minutes = currentDate.getMinutes();
                        const seconds = currentDate.getSeconds();
                        const currentTime = `${hours}:${minutes}:${seconds}`;
                        const updatedFormData = { ...formData, 'time': currentTime };
                        const updatedAppoint = { ...appoint, 'status': "Attended" };
                        setFormData(updatedFormData);
                        await axios.post(`http://localhost:5000/prescriptions/addPrescription`, updatedFormData);
                        await axios.post(`http://localhost:5000/appointments/createAppointment`, updatedAppoint);
                        Swal.fire({
                            title: "Generated",
                            text: "Prescription Created Successfully.",
                            icon: "success",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setShowPres(true);
                                // window.location.href = "/patientList";
                                return;
                            }
                        });
                    } catch (error) {
                        console.log(error);
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    return; // Action if 'No' is clicked
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = formData.medicines.map((medicine, i) =>
            i === index ? { ...medicine, [field]: value } : medicine
        );
        setFormData({ ...formData, medicines: updatedMedicines });
    };

    const addMedicine = () => {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { name: '', timing: '', frequency: '' }],
        });
    };

    const removeMedicine = (index) => {
        const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
        setFormData({ ...formData, medicines: updatedMedicines });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('Prescription Data:', formData);
    };

    return (
        <div >
            {showPres ?
                <div className="prescription-page">
                    <Prescription  
                        prescription={formData}
                    />
                </div> :
                <div className="prescription-page">
                    <h1 className="page-title">Prescription Page</h1>
                    <form onSubmit={handleSubmit} className="prescription-form">
                        <div className="form-group">
                            <label htmlFor="patientName">Patient Name:</label>
                            <input
                                type="text"
                                id="patientName"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="patientUserId">Patient User ID:</label>
                            <input
                                type="text"
                                id="patientUserId"
                                name="patientUserId"
                                value={formData.patientUserId}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sex">Sex:</label>
                            <input
                                type="text"
                                id="sex"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date:</label>
                            <input type="text" id="date" name="date" value={formData.date} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="diagnosis">Diagnosis:</label>
                            <textarea
                                id="diagnosis"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <h3>Medicines:</h3>
                            {formData.medicines.map((medicine, index) => (
                                <div key={index} className="medicine-row">
                                    <input
                                        type="text"
                                        placeholder="Medicine Name"
                                        value={medicine.name}
                                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                        required
                                    />
                                    <select
                                        value={medicine.timing}
                                        onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                                        required
                                    >
                                        <option value="">Before/After</option>
                                        <option value="before">Before Meal</option>
                                        <option value="after">After Meal</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Frequency"
                                        value={medicine.frequency}
                                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeMedicine(index)}
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="add-medicine-btn" onClick={addMedicine}>
                                ➕ Add Medicine
                            </button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="advice">Advice:</label>
                            <textarea
                                id="advice"
                                name="advice"
                                value={formData.advice}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="submit-btn" onClick={createPrescription}>Submit Prescription</button>
                    </form>

                </div>

            }

        </div>
    );
}

export default GenPresPage;
