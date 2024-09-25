import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../styles/AppointmentCopyPage.css'; // External CSS file for styling

function AppointmentCopyPage() {
    const { appointId } = useParams();
    const [appointment, setAppointment] = useState({
        "id": appointId,
        "patientid": "",
        "patientAddress": '',
        "patientName": '',
        "patientAge": '',
        "patientGender": '',
        "chamberid": '',
        "chamberAddress": '',
        "doctorid": '',
        "doctorName": '',
        "time": '',
        "date": '',
        "status": '',
        "sl_no": 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/appointments/getAppointmentById/${appointId}`);
                setAppointment(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
   
    const handlePrint = () => {
        window.print();
    };

    // Handle downloading the appointment as a PDF
    const handleDownload = async () => {
        const content = document.getElementById('appointment-content');

        // Capture the content of the div as a canvas image
        const canvas = await html2canvas(content, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // Create a new jsPDF instance
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Define left margin
        const leftMargin = 10; // Set left margin to 10mm
        const topMargin = 10;  // Set top margin to 10mm

        // Add the captured image to the PDF with margins
        pdf.addImage(imgData, 'PNG', leftMargin, topMargin, pdfWidth - 2 * leftMargin, pdfHeight);

        // Save the PDF with an appropriate filename
        pdf.save(`appointment_${appointment.id}.pdf`);
    };


    return (
        <div className="appointment-container">
            <div id="appointment-content"> {/* This div will be captured as the content for the PDF */}
                <h2 className="invoice-title">Appointment Paper</h2>
                <div className="appointment-topSection">
                    <div>
                        <p>{appointment.doctorName}</p>
                        {appointment.degrees && appointment.degrees.length > 0 && appointment.degrees.map((degree, index) => (
                            <p key={index}>{degree}</p>
                        ))}

                        {appointment.categories && appointment.categories.length > 0 && appointment.categories.map((category, index) => (
                            <p key={index}>{category}</p>
                        ))}
                        <p>{appointment.chamberAddress}</p>
                    </div>
                    <div>
                        <p><strong>Date </strong>: {appointment.date}</p>
                        <p><strong>Time </strong>: {appointment.time}</p>
                        <p><strong>Serial No </strong>: {appointment.sl_no}</p>
                        <p><strong>Contact No</strong>: {appointment.contactNo}</p>
                    </div>

                </div>
                <hr />
                <div className="patient-Info">
                    <h3><b style={{color:"black",fontSize : "25px"}}>Patient Information</b></h3>
                    <p><strong>Name</strong>: {appointment.patientName}</p>
                    <p><strong>ID</strong>: {appointment.patientid}</p>
                    <p><strong>Address</strong>: {appointment.patientAddress}</p>
                    <p><strong>Age</strong>: {appointment.patientAge}</p>
                    <p><strong>Gender</strong>: {appointment.patientGender}</p>
                    <p><strong>Contact No</strong>: {appointment.contactNo}</p>
                    <p><strong>Appointment ID</strong>: {appointment.id}</p>
                    <p><strong>Appointment Status</strong>: {appointment.status === "Scheduled"? <b style={{color:"green"}}>Valid</b>:<b style={{color:"red"}}>Not Valid</b>}</p>
                </div>
            </div>
            <hr />
            <div className="button-container">
                <button className="print-button" onClick={handlePrint}>Print Appointment</button>
                <button className="download-button" onClick={handleDownload}>Download Appointment</button>
            </div>
        </div>
    );
}

export default AppointmentCopyPage;
