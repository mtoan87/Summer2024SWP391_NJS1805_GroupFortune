import React, { useState, useEffect } from 'react';
import api from '../../../../../config/axios'; // Adjust the path based on your file structure
import './my-bids.scss';

function MyBids() {
  const [joinAuctions, setJoinAuctions] = useState([]);
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
  const accountId = loginedUser?.accountId;
  console.log(accountId);

  useEffect(() => {
    const fetchJoinAuctions = async () => {
      try {
        const response = await api.get('/api/JoinAuction');
        setJoinAuctions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching join auctions:', error);
      }
    };

    fetchJoinAuctions();
  }, []);

  // Ensure joinAuctions is an array before filtering and mapping
  if (!Array.isArray(joinAuctions)) {
    return <p>Loading join auctions...</p>;
  }

  // Filter the joinAuctions based on the logged-in user's accountId
  const userJoinAuctions = joinAuctions.filter(auction => auction.accountId === accountId);

  return (
    <div className="my-bids-container">
      <h2>My Bids</h2>
      <div className="join-auctions-list">
        {userJoinAuctions.length === 0 ? (
          <p>No auctions found for this account.</p>
        ) : (
          userJoinAuctions.map(auction => (
            <div key={auction.$id} className="auction-item">
              <p>Auction ID: {auction.auctionId}</p>
              <p>Join Date: {new Date(auction.joindate).toLocaleString()}</p>
              <AuctionDetails auctionId={auction.auctionId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AuctionDetails({ auctionId }) {
  const [auctionDetails, setAuctionDetails] = useState(null);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await api.get(`/api/Auctions/GetById/${auctionId}`);
        setAuctionDetails(response.data);
      } catch (error) {
        console.error(`Error fetching auction details for ID ${auctionId}:`, error);
        // Handle error (e.g., show error message)
      }
    };

    fetchAuctionDetails();
  }, [auctionId]);

  if (!auctionDetails) {
    return <p>Loading auction details...</p>;
  }

  return (
    <>
    <div className="auction-details">
      <h3>Auction Details</h3>
      <p>Name: {auctionDetails.name}</p>
      <p>Description: {auctionDetails.description}</p>
      <p>Category: {auctionDetails.category}</p>
      {/* Add more auction details as needed */}
    </div>
    <h1>HElolo</h1>
    <h1>heelo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    <h1>eijosidfo</h1>
    </>
    
  );
}

export default MyBids;
