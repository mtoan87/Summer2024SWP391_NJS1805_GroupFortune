import React, { useEffect, useState } from 'react';
import './jewelry.scss';
import api from '../../../../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MemberViewJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const successMessage = state && state.successMessage;

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get(`api/Jewelries/GetAuctionAndJewelryByAccountId/${accountId}`);
        setJewelry(response.data?.$values || []);
      } catch (err) {
        console.error('Error fetching jewelry', err);
        setJewelry([]);
      }
    };

    if (accountId) {
      fetchJewelry();
    } else {
      console.error('No accountId found in loginedUser');
    }
  }, [accountId]);

  useEffect(() => {
    if (successMessage) {
      toast.success("Success Notification !", {
        position: "top-right"
      });
    }
  }, [successMessage]);

  const handleViewDetails = (jewelryId) => {
    // Navigate to the view jewelry details page
    navigate(`/view-jewelry/${jewelryId}`);
  };

  return (
    <>
      <div className="jewel-content">
        <h1>My Jewelry</h1>
      </div>

      <div className="jewelry-container">
        <div className="auction-item create-auction">
          <img src='../../../../../../src/assets/img/Jewelry.png' alt="Create Jewelry" />
          <button onClick={() => navigate('/userJewel/upload')}>Create Jewelry</button>
        </div>
        {jewelry.length > 0 ? (
          jewelry.map((item, index) => (
            <div key={index} className="jewelry-item" onClick={() => handleViewDetails(item.jewelryId)}>
              <img src="../../../../../../src/assets/img/jewelry_introduction.jpg" alt={item.name} />
              <h3>{item.name}</h3>
              <p>Description: {item.description}</p>
              <p>Collection: {item.collection}</p>
              <p>Gold Age: {item.goldage}</p>
              <p>Materials: {item.materials}</p>
              <p>Weight: {item.weight}</p>
            </div>
          ))
        ) : (
          <p>No jewelry items found.</p>
        )}
      </div>
      <ToastContainer  className="toast-position"/>
    </>
  );
}

export default MemberViewJewelry;
