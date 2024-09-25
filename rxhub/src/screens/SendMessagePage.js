import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../components/Loader.js';
import '../styles/SendMessagePage.css'; // Importing CSS file

function SendMessagePage() {
    const [toCategory, setToCategory] = useState(''); // Store the selected category
    const [toEmail, setToEmail] = useState(''); // Store the email for individual user
    const [subject, setSubject] = useState(''); // Store the subject
    const [body, setBody] = useState(''); // Store the message body
    const [users, setUsers] = useState([]); // Store fetched users
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users/getUsers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSend = async () => {
        let recipients = [];

        if (toCategory === 'All Users') {
            recipients = users.filter(user => user.email); // Get all users with non-empty email
        } else if (toCategory === 'Doctors') {
            recipients = users.filter(user => user.role === 'doctor' && user.email);
        } else if (toCategory === 'Patients') {
            recipients = users.filter(user => user.role === 'patient' && user.email);
        } else if (toCategory === 'Individual User') {
            if (toEmail) {
                recipients = [{ email: toEmail }];
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Please provide an email for individual user.",
                    icon: "error",
                });
                return;
            }
        }

        if (recipients.length === 0) {
            Swal.fire({
                title: "Error",
                text: "No valid recipients found.",
                icon: "error",
            });
            return;
        }
        setLoading(true);
        console.log(recipients);
        try {
            // Send emails to all recipients
            await Promise.all(
                recipients.map(async (user) => {
                    const mail = {
                        toEmail: user.email,
                        subject: subject,
                        body: body,
                    };
                    await axios.post('http://localhost:5000/mails/sendEmail', mail);
                })
            );
            setLoading(false);
            Swal.fire({
                title: "Success",
                text: "Emails sent successfully!",
                icon: "success",
            });
        } catch (error) {
            setLoading(false);
            console.error('Error sending emails:', error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while sending emails.",
                icon: "error",
            });
        }
    };

    return (
        <div className="send-message-page">
            {/* Left Pane for Category Options */}
            <div className="left-pane">
                <h3>Select Recipient</h3>
                <ul className="category-list">
                    <li
                        className={toCategory === 'All Users' ? 'active' : ''}
                        onClick={() => setToCategory('All Users')}
                    >
                        All Users
                    </li>
                    <li
                        className={toCategory === 'Doctors' ? 'active' : ''}
                        onClick={() => setToCategory('Doctors')}
                    >
                        Doctors
                    </li>
                    <li
                        className={toCategory === 'Patients' ? 'active' : ''}
                        onClick={() => setToCategory('Patients')}
                    >
                        Patients
                    </li>
                    <li
                        className={toCategory === 'Individual User' ? 'active' : ''}
                        onClick={() => setToCategory('Individual User')}
                    >
                        Individual User
                    </li>
                </ul>
            </div>

            {/* Main form for sending the message */}
            <div className="message-form-container">
                <h1>Send Message</h1>

                <form className="mail-form">
                   

                    {/* To Category */}
                    <div className="form-group">
                        <label>To:</label>
                        <input
                            type="text"
                            value={toCategory || 'Select a category from the left'}
                            readOnly
                        />
                    </div>

                    {/* Show email input only if 'Individual User' is selected */}
                    {toCategory === 'Individual User' && (
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={toEmail}
                                onChange={(e) => setToEmail(e.target.value)}
                                placeholder="Enter recipient's email"
                                required
                            />
                        </div>
                    )}

                    {/* Subject field */}
                    <div className="form-group">
                        <label>Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject"
                            required
                        />
                    </div>

                    {/* Body field */}
                    <div className="form-group">
                        <label>Body:</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your message"
                            required
                        ></textarea>
                    </div>

                    {/* Send button */}
                    {loading ? <Loader></Loader> :
                        <button type="button" className="btn btn-info" onClick={handleSend}>
                            Send
                        </button>
                    }

                </form>
            </div>
        </div>
    );
}

export default SendMessagePage;
