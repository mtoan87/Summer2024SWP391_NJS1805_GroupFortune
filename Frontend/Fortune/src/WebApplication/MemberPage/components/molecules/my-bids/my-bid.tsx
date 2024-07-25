import { useState, useEffect } from 'react';
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
        const joinAuctionsResponse = await api.get('/api/AuctionResults/GetAllAuctionResults');
        console.log('Auctions Response:', joinAuctionsResponse.data);

        const joinAuctions = joinAuctionsResponse.data?.$values || [];

        const userJoinAuctions = joinAuctions.filter(
          auction => auction.accountId === accountId && auction.bidId
        );

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
      <h1>My Bids</h1>
      <div className="join-auctions-list">
        {auctionsData.length === 0 ? (
          <p>No auction results found for this account.</p>
        ) : (
          auctionsData.map(auction => (
            <div key={auction.id} className="auction-item-bids">
              <p>Join Date: {new Date(auction.joindate).toLocaleString()}</p>
              <div className="auction-details">
                <p>Status: {auction.details.status}</p>
                <p>Start Time: {new Date(auction.details.starttime).toLocaleString()}</p>
                <p>End Time: {new Date(auction.details.endtime).toLocaleString()}</p>
                <p>Price: {auction.jewelryDetails.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBids;
