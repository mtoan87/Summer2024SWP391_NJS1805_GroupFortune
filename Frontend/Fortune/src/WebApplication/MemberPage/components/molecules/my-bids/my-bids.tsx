import React, { useState, useEffect } from 'react';
import api from '../../../../../config/axios'; // Adjust the path based on your file structure
import './my-bids.scss';

function MyBids() {
  const [joinAuctions, setJoinAuctions] = useState([]);

  useEffect(() => {
    const fetchJoinAuctions = async () => {
      try {
        const response = await api.get('/api/JoinAuction');
        setJoinAuctions(response.data);
      } catch (error) {
        console.error('Error fetching join auctions:', error);
      }
    };

    fetchJoinAuctions();
  }, []);

  // Ensure joinAuctions is an array before mapping
  if (!Array.isArray(joinAuctions)) {
    return <p>Loading join auctions...</p>;
  }

  return (
    <div className="my-bids-container">
      <h2>My Bids</h2>
      <div className="join-auctions-list">
        {joinAuctions.map(auction => (
          <div key={auction.$id} className="auction-item">
            <p>Auction ID: {auction.auctionId}</p>
            <p>Join Date: {new Date(auction.joindate).toLocaleString()}</p>
            <AuctionDetails auctionId={auction.auctionId} />
          </div>
        ))}
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
    <div className="auction-details">
      <h3>Auction Details</h3>
      <p>Name: {auctionDetails.name}</p>
      <p>Description: {auctionDetails.description}</p>
      <p>Category: {auctionDetails.category}</p>
      {/* Add more auction details as needed */}
    </div>
  );
}

export default MyBids;
