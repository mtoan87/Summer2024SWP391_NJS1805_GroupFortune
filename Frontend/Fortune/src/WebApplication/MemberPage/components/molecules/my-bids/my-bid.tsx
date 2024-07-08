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
        const joinAuctions = joinAuctionsResponse.data;

        // Filter join auctions by accountId
        const userJoinAuctions = joinAuctions.filter(auction => auction.accountId === accountId);

        // Fetch auction details for each joined auction
        const auctionDetailsPromises = userJoinAuctions.map(async (auction) => {
          const auctionDetailsResponse = await api.get(`/api/Auctions/GetById/${auction.auctionId}`);
          return { ...auction, details: auctionDetailsResponse.data };
        });

        // Resolve all promises
        const auctionsData = await Promise.all(auctionDetailsPromises);
        console.log(auctionsData);
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
            <div key={auction.$id} className="auction-item">
              <p>Auction ID: {auction.auctionId}</p>
              <p>Join Date: {new Date(auction.joindate).toLocaleString()}</p>
              <div className="auction-details">
                <h3>Auction Details</h3>
                <p>Name: {auction.details.name}</p>
                <p>Description: {auction.details.description}</p>
                <p>Category: {auction.details.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBids;
