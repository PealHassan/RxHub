import React, { useState } from 'react';
import '../styles/AddChamberPage.css';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddChamberPage() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [categories, setCategories] = useState([""]);
  const [chamber, setChamber] = useState({
    userid: user.userid,
    name: user.username,
    degrees : user.degrees,
    contactNo : '',
    categories: categories,
    address: '',
    days: [],
    times: {}, // Object with days as keys and arrays of time slots
    mapLink: '',
  });
  const categoryOptions = [
    "Dermatologist",
    "Endocrinologist",
    "Cardiologist",
    "Neurologist",
    "Obstetrics and gynaecology",
    "Oncologist",
    "Gastroenterologist",
    "Pediatrics",
    "Family medicine",
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


  // Handle general input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChamber((prevChamber) => ({
      ...prevChamber,
      [name]: value,
    }));
  };

  // Handle day selection changes
  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    setChamber((prevChamber) => {
      const updatedDays = checked
        ? [...prevChamber.days, value]
        : prevChamber.days.filter((day) => day !== value);

      const updatedTimes = { ...prevChamber.times };

      // Add a default time slot if the day is checked
      if (checked && !updatedTimes[value]) {
        updatedTimes[value] = [{ startTime: '', endTime: '', maxPatients: 0 }];
      } else if (!checked) {
        // Remove all time slots for the day if unchecked
        delete updatedTimes[value];
      }

      return {
        ...prevChamber,
        days: updatedDays,
        times: updatedTimes,
      };
    });
  };

  // Add a new time slot for a specific day
  const addTimeSlot = (day) => {
    setChamber((prevChamber) => ({
      ...prevChamber,
      times: {
        ...prevChamber.times,
        [day]: [
          ...prevChamber.times[day],
          { startTime: '', endTime: '', maxPatients: 0 }, // Add new time slot with initial values
        ],
      },
    }));
  };

  // Remove a specific time slot
  const removeTimeSlot = (day, index) => {
    setChamber((prevChamber) => {
      const updatedSlots = prevChamber.times[day].filter((_, i) => i !== index);
      // Ensure at least one time slot remains for each selected day
      return {
        ...prevChamber,
        times: {
          ...prevChamber.times,
          [day]: updatedSlots.length === 0 ? [{ startTime: '', endTime: '', maxPatients: 0 }] : updatedSlots,
        },
      };
    });
  };

  // Handle changes for each time slot
  const handleTimeSlotChange = (day, index, field, value) => {
    setChamber((prevChamber) => ({
      ...prevChamber,
      times: {
        ...prevChamber.times,
        [day]: prevChamber.times[day].map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(categories);
    chamber['categories'] = categories;
    // console.log('Chamber Details:', chamber);
    try {
      await axios.post(`http://localhost:5000/chambers/add`, chamber);
      Swal.fire({
        title: 'Success',
        text: 'Chamber Added Successfully',
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/addChamber';
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddCategory = () => {
    setCategories([...categories, ""]);
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleRemoveCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  return (
    <div className="container mt-5">
      <h2>Add Chamber Details</h2>
      <div className="form-container p-4 mt-3 border">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chamber Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={chamber.address}
              onChange={handleChange}
              placeholder="Enter chamber address"
              required
            />
          </div>
          <div className="form-group">
            <label>Google Maps Link</label>
            <input
              type="url"
              className="form-control"
              name="mapLink"
              value={chamber.mapLink}
              onChange={handleChange}
              placeholder="Enter Google Maps link"
              required
            />
          </div>
          <div className="form-group">
            <label>Contact No.</label>
            <input
              type="text"
              className="form-control"
              name="contactNo"
              value={chamber.contactNo}
              onChange={handleChange}
              placeholder="+88"
              required
            />
            
          </div>

          <div className="form-group">
            <label>Available Days</label>
            <div className="d-flex flex-wrap">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div className="form-check mr-3" key={day}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={day}
                    id={day}
                    onChange={handleDaysChange}
                    checked={chamber.days.includes(day)}
                  />
                  <label className="form-check-label" htmlFor={day}>
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {chamber.days.map((day) => (
            <div key={day} className="form-group">
              <label>{day} Time Slots</label>
              {chamber.times[day]?.map((slot, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <input
                    type="time"
                    className="form-control time-input mr-2"
                    value={slot.startTime}
                    onChange={(e) => handleTimeSlotChange(day, index, 'startTime', e.target.value)}
                    required
                  />
                  <span className="mx-2">to</span>
                  <input
                    type="time"
                    className="form-control time-input mr-2"
                    value={slot.endTime}
                    onChange={(e) => handleTimeSlotChange(day, index, 'endTime', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-control mr-2"
                    placeholder="Max Patients"
                    value={slot.maxPatients}
                    onChange={(e) => handleTimeSlotChange(day, index, 'maxPatients', e.target.value)}
                    required
                    min="1"
                  />
                  {chamber.times[day].length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeTimeSlot(day, index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-info"
                onClick={() => addTimeSlot(day)}
              >
                Add Time Slot
              </button>
            </div>
          ))}
          <div className="category-container">
            {categories.map((category, index) => (
              <div key={index} className="category-input-row">
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="category-select"
                >
                  <option value = "">Select Category</option>
                  {categoryOptions.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {categories.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveCategory(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-info"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>

          <button type="submit" className="btn btn-dark mt-3">
            Add Chamber
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddChamberPage;
