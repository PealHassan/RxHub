import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ViewChamberPage.css';
import Swal from 'sweetalert2';

function ChamberDetails({ chamber }) {
    console.log(chamber);
    function update() {
        window.location.href = `/updateChamber/${chamber.id}`;
    }
    function remove() {
        Swal.fire({
            title: "Are You Sure?",
            text: "You can't go back after this. All the data of this chamber will be permanently deleted.",
            icon: "warning",
            showCancelButton: true, // Show the Cancel button
            confirmButtonText: "Yes, delete it!", // Text for the confirm button
            cancelButtonText: "Cancel", // Text for the cancel button
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(`http://localhost:5000/chambers/remove`, chamber);
                    Swal.fire({
                        title: "Success",
                        text: "Chamber Deleted Successfully",
                        icon: "success",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/viewChamber';
                        }
                    });
                } catch (error) {
                    console.log(error)
                }
            }
        });
    }

    return (
        <div className="chamber-details border p-3 rounded mb-4">
            <div className="header-row">
                <h3 className="address">{chamber.address || 'No address provided'}</h3>
                <div className="header-col">
                    <h3 className="id">Chamber Id : <b>{chamber.id}</b></h3>
                    <div>
                        <button
                            type="button"
                            className="btn btn-success btn-items"
                          onClick={() => update()}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-items"
                            onClick={() => remove()}
                        >
                            Delete
                        </button>
                    </div>

                </div>
            </div>
            <br />
            {chamber.mapLink ? (
                <a href={chamber.mapLink} target="_blank" rel="noopener noreferrer">
                    View on Google Maps
                </a>
            ) : (
                <p>No map link provided</p>
            )}

            {chamber.days.length > 0 ? (
                <div className="days-container">
                    {chamber.days.map((day) => (
                        <div key={day} className="day-item">
                            <h4>{day}</h4>
                            {Array.isArray(chamber.times[day]) ? (
                                chamber.times[day].map((slot, index) => (
                                    <div key={index} className="time-slot mb-2">
                                        <p>
                                            {slot.startTime} - {slot.endTime} ({slot.maxPatients} patients max)
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No time slots available for this day</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No available days specified</p>
            )}
        </div>
    );
}

function ViewChamberPage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [chambers, setChambers] = useState([]); // Initialize as empty array

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/chambers/findChamberByUserid/${user.userid}`);
                setChambers(response.data); // Use response.data
                // console.log(response.data); // Log response data for debugging

            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [user.userid]); // Add user.userid as dependency

    return (
        <div className="container mt-4 p-3">
            <h1 className="mb-4">Chambers</h1>
            {chambers.length > 0 ? (
                chambers.map((chamber) => (
                    <ChamberDetails key={chamber._id} chamber={chamber} /> // Use _id as key
                ))
            ) : (
                <p>No chambers available</p>
            )}
        </div>
    );
}

export default ViewChamberPage;
