import React, { useState, useEffect } from 'react';
import api from '../../../../../config/axios';
import './my-bid.scss';

function MyBids() {
  const [auctionsData, setAuctionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
  const accountId = loginedUser?.accountId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch join auctions
        const joinAuctionsResponse = await api.get('/api/JoinAuction');
        console.log('Join Auctions Response:', joinAuctionsResponse.data);

        const joinAuctions = joinAuctionsResponse.data?.$values || [];
        
        const userJoinAuctions = joinAuctions.filter(auction => auction.accountId === accountId);
console.log(userJoinAuctions);
        // Fetch auction details for each joined auction
        const auctionDetailsPromises = userJoinAuctions.map(async (auction) => {
          const auctionDetailsResponse = await api.get(`/api/Auctions/GetById/${auction.auctionId}`);
          const auctionDetails = auctionDetailsResponse.data;

          // Determine which jewelry API to call
          let jewelryDetails = {};
          if (auctionDetails.jewelryGoldId) {
            const jewelryDetailsResponse = await api.get(`/api/JewelryGold/GetById/${auctionDetails.jewelryGoldId}`);
            jewelryDetails = jewelryDetailsResponse.data;
          } else if (auctionDetails.jewelryGoldDiaId) {
            const jewelryDetailsResponse = await api.get(`/api/JewelryGoldDia/GetById/${auctionDetails.jewelryGoldDiaId}`);
            jewelryDetails = jewelryDetailsResponse.data;
          } else if (auctionDetails.jewelrySilverId) {
            const jewelryDetailsResponse = await api.get(`/api/JewelrySilver/GetById/${auctionDetails.jewelrySilverId}`);
            jewelryDetails = jewelryDetailsResponse.data;
          }

          return { ...auction, details: auctionDetails, jewelryDetails };
        });

        // Resolve all promises
        const auctionsData = await Promise.all(auctionDetailsPromises);
        console.log('Auctions Data:', auctionsData);
        setAuctionsData(auctionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="my-bids-container">
      <h2>My Bids</h2>
      <div className="join-auctions-list">
        {auctionsData.length === 0 ? (
          <p>No auctions found for this account.</p>
        ) : (
          auctionsData.map(auction => (
            <div key={auction.id} className="auction-item">
              <p>Auction ID: {auction.auctionId}</p>
              <p>Join Date: {new Date(auction.joindate).toLocaleString()}</p>
              <div className="auction-details">
                <h3>Auction Details</h3>
                <p>Status: {auction.details.status}</p>
                <p>Start Time: {new Date(auction.details.starttime).toLocaleString()}</p>
                <p>End Time: {new Date(auction.details.endtime).toLocaleString()}</p>
              </div>
              <div className="jewelry-details">
                <h3>Jewelry Details</h3>
                <p>Name: {auction.jewelryDetails.name}</p>
                <p>Materials: {auction.jewelryDetails.materials}</p>
                <p>Description: {auction.jewelryDetails.description}</p>
                <p>Shipment: {auction.jewelryDetails.shipment}</p>
                <p>Status: {auction.jewelryDetails.status}</p>
                <p>Price: {auction.jewelryDetails.price}</p>
                {auction.jewelryDetails.goldAge && <p>Gold Age: {auction.jewelryDetails.goldAge}</p>}
                {auction.jewelryDetails.purity && <p>Purity: {auction.jewelryDetails.purity}</p>}
                {auction.jewelryDetails.carat && <p>Carat: {auction.jewelryDetails.carat}</p>}
                {auction.jewelryDetails.clarity && <p>Clarity: {auction.jewelryDetails.clarity}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBids;
