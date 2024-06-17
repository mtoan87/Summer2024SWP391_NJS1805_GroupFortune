import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './register-jewelry.scss';
import api from '../../../../../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterJewelryForAuction() {
  const location = useLocation();
  const { jewelryId } = location.state || {};
  const { material } = useParams();
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;

  const [formData, setFormData] = useState({
    accountId: accountId,
    jewelryGoldId: material === 'gold' ? jewelryId : null,
    jewelrySilverId: material === 'silver' ? jewelryId : null,
    date: '',
    startTime: '',
    endTime: '',
    jewelryDetails: {} // Object to store jewelry details
  });

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        let response;
        if (material === 'gold') {
          response = await api.get(`/api/JewelryGold/GetById/${jewelryId}`);
        } else if (material === 'silver') {
          response = await api.get(`/api/JewelrySilver/GetById/${jewelryId}`);
        } else {
          console.error('Unsupported jewelry material type');
          return;
        }

        console.log(response.data);
        setFormData(prevState => ({
          ...prevState,
          jewelryDetails: {
            ...response.data,
            materials: material // Update material type dynamically
          }
        }));
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    if (jewelryId) {
      fetchJewelryDetails();
    }
  }, [jewelryId, material]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate the date is at least 3 days from today
    const chosenDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    if (chosenDate < minDate) {
      toast.error('The auction date must be at least 3 days from today.', { position: 'top-right' });
      return;
    }

    // Validate end time is at least 30 minutes after start time
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    const startDateTime = new Date(chosenDate);
    const endDateTime = new Date(chosenDate);

    startDateTime.setHours(startHours, startMinutes, 0, 0);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    const timeDifference = (endDateTime - startDateTime) / (1000 * 60); // Difference in minutes

    if (timeDifference < 30) {
      toast.error('The acution must take part at least 30 minutes.', { position: 'top-right' });
      return;
    }

    // Combine date with start and end times
    const dateofAuction = chosenDate.toISOString();
    const starttime = {
      ticks: startDateTime.getTime() * 10000
    };
    const endtime = {
      ticks: endDateTime.getTime() * 10000
    };

    try {
      const requestData = {
        createAuction: {
          accountId: formData.accountId,
          dateofAuction: dateofAuction,
          starttime: starttime,
          endtime: endtime
        }
      };

      if (material === 'gold') {
        requestData.jewelryGoldId = formData.jewelryGoldId;
      } else if (material === 'silver') {
        requestData.jewelrySilverId = formData.jewelrySilverId;
      } else {
        console.error('Unsupported jewelry material type');
        return;
      }

      const apiUrl = material === 'gold' ? '/api/Auctions/CreateGoldJewelryAuction' : '/api/Auctions/CreateSilverJewelryAuction';

      const response = await api.post(apiUrl, requestData);
      console.log('Auction created successfully:', response.data);
      toast.success('Auction registered successfully!', { position: 'top-right' });
    } catch (error) {
      console.error('Error creating auction:', error);
      if (error.response && error.response.data) {
        console.error('Response Data:', error.response.data);
      }
      toast.error('Error creating auction. Please try again!', { position: 'top-right' });
    }
  };

  return (
    <div className="register-jewelry-form">
      <h2>Auction Register</h2>
      {jewelryId ? (
        <>
          <div className="jewelry-details">
            <h3>Jewelry Details:</h3>
            <p>
              Image:{' '}
              <img
                src={`https://localhost:44361/${formData.jewelryDetails.jewelryImg}`}
                alt={formData.jewelryDetails.name}
                onError={e => {
                  e.target.src = 'src/assets/img/jewelry_introduction.jpg';
                }}
              />
            </p>
            <p>Name: {formData.jewelryDetails.name}</p>
            <p>Description: {formData.jewelryDetails.description}</p>
            <p>Category: {formData.jewelryDetails.category}</p>
            {material === 'gold' && (
              <p>Gold Age: {formData.jewelryDetails.goldAge}</p>
            )}
            {material === 'silver' && (
              <p>Purity: {formData.jewelryDetails.purity}</p>
            )}
            <p>Materials: {formData.jewelryDetails.materials}</p>
            <p>Weight: {formData.jewelryDetails.weight}</p>
            <p>Price: {formData.jewelryDetails.price}$</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Register Auction</button>
          </form>
        </>
      ) : (
        <p>No jewelry selected for auction registration.</p>
      )}
      <ToastContainer className="toast-position" />
    </div>
  );
}

export default RegisterJewelryForAuction;
