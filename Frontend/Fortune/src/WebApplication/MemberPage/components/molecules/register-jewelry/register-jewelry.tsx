import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './register-jewelry.scss';
import api from '../../../../../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterJewelryForAuction() {
  const location = useLocation();
  const { jewelryId } = location.state || {};
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
  const [formData, setFormData] = useState({
    accountId: accountId,
    jewelryId: jewelryId || '',
    starttime: '',
    endtime: '',
    jewelryDetails: {} // Object to store jewelry details
  });

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const response = await api.get(`/api/Jewelries/GetById/${jewelryId}`);
        console.log(response.data);
        setFormData(prevState => {
          const updatedFormData = {
            ...prevState,
            jewelryDetails: response.data
          };
          console.log(updatedFormData); // Log formData after updating the state
          return updatedFormData;
        });
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    if (jewelryId) {
      fetchJewelryDetails();
    }
  }, [jewelryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        accountId: formData.accountId,
        jewelryId: formData.jewelryId,
        starttime: formData.starttime,
        endtime: formData.endtime
      };

      const response = await api.post('/api/Auctions/CreateAuction', requestData);
      console.log('Auction created successfully:', response.data);
      toast.success('Auction registered successfully!', { position: "top-right" });
    } catch (error) {
      console.error('Error creating auction:', error);
      toast.error('Error creating auction. Please try again!', { position: "top-right" });
    }
  };

  return (
    <div className="register-jewelry-form">
      <h2>Auction Register</h2>
      {jewelryId ? (
        <>
          <div className="jewelry-details">
            <h3>Jewelry Details:</h3>
            <p>Image: <img src={`https://localhost:44361/${formData.jewelryDetails.jewelryImg}`} alt={formData.jewelryDetails.name} 
            onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}/></p>
            <p>Name: {formData.jewelryDetails.name}</p>
            <p>Description: {formData.jewelryDetails.description}</p>
            <p>Collection: {formData.jewelryDetails.collection}</p>
            <p>Gold Age: {formData.jewelryDetails.goldage}</p>
            <p>Materials: {formData.jewelryDetails.materials}</p>
            <p>Weight: {formData.jewelryDetails.weight}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="starttime">Start Time</label>
              <input 
                type="datetime-local" 
                id="starttime" 
                name="starttime" 
                value={formData.starttime} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="endtime">End Time</label>
              <input 
                type="datetime-local" 
                id="endtime" 
                name="endtime" 
                value={formData.endtime} 
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
