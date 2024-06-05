import React, { useEffect, useState } from 'react';
import './jewelry.scss';
import api from '../../../../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MemberViewJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredJewelry = jewelry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.goldage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.weight.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="jewel-content">
        <h1>My Jewelry</h1>
      </div>
      <div className='searchBar'>
                <div className="fui-input-label-animation">
                    <input type="text" className="form-input" placeholder='' value={searchQuery}
                        onChange={handleSearchChange} />
                    <label htmlFor="name" className="form-label">Search for Auctions</label>
                </div>
            </div>
      <div className="jewelry-container">
        
        <div className="auction-item create-auction">
          <img src='../../../../../../src/assets/img/Jewelry.png' alt="Create Jewelry" />
          <button onClick={() => navigate('/userJewel/upload')}>Create Jewelry</button>
        </div>
        {filteredJewelry.length > 0 ? (
          filteredJewelry.map((item, index) => (
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
      <ToastContainer className="toast-position" />
    </>
  );
}

export default MemberViewJewelry;
