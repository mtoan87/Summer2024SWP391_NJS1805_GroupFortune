import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/maincontent.scss';
import api from '../../../../../../config/axios';

function MainContent() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [jewelryDetails, setJewelryDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await api.get(`api/Auctions/GetById/${id}`);
        const auctionData = response.data;
        setAuction(auctionData);

        const jewelryDetails = await fetchJewelryDetails(auctionData);
        setJewelryDetails(jewelryDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching auction details:', err);
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  async function fetchJewelryDetails(auction) {
    try {
      var jewelryId;
      var apiUrl;
      // Check for Jewelry Gold
      if (auction.jewelryGoldId) {
        jewelryId = auction.jewelryGoldId;
        apiUrl = `/api/JewelryGold/GetById/${jewelryId}`;
      }
      // Check for Jewelry Gold Diamond
      else if (auction.jewelryGolddiaId) {
        jewelryId = auction.jewelryGolddiaId;
        apiUrl = `/api/JewelryGoldDia/GetById/${jewelryId}`;
      }
      // Check for Jewelry Silver
      else if (auction.jewelrySilverId) {
        jewelryId = auction.jewelrySilverId;
        apiUrl = `/api/JewelrySilver/GetById/${jewelryId}`;
      } else {
        throw new Error('No valid jewelryId found');
      }

      const response = await api.get(apiUrl);
      return [response.data];
    } catch (err) {
      console.error('Error fetching jewelry details:', err);
      return [];
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auction || !jewelryDetails) {
    return <div>No auction or jewelry details found.</div>;
  }

  const purity = {
    PureSilver925: '92.5%',
    PureSilver999: '99.9%',
    PureSilver900: '90.0%',
    PureSilver958: '95.8%',
  };

  const goldAge = {
    Gold24: '24K',
    Gold22: '22K',
    Gold20: '20K',
    Gold18: '18K',
    Gold14: '14K',
  };

  return (
    <div className="contents-details">
      <h1>Jewelry</h1>
      <div className="contents-details-content">
        <div className="jewelry-details">
          {jewelryDetails.map((jewelry, index) => (
            <div key={index} className="jewelry-item">
              <img
                className="item-img"
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => {
                  e.target.src =
                    '../../../../../../../src/assets/img/jewelry_introduction.jpg';
                }} // Handle image loading error
              />
              <div className="jewelry-info">
                <p>
                  <strong>Name:</strong> {jewelry.name}
                </p>
                <p>
                  <strong>Materials:</strong> {jewelry.materials}
                </p>
                <p>
                  <strong>Description:</strong> {jewelry.description}
                </p>
                <p>
                  <strong>Price:</strong> ${jewelry.price}
                </p>
                <p>
                  <strong>Weight:</strong> {jewelry.weight}
                </p>
                {jewelry.materials.toLowerCase().includes('gold') && (
                  <p>
                    <strong>Gold Age:</strong> {goldAge[jewelry.goldAge]}
                  </p>
                )}
                {jewelry.materials.toLowerCase().includes('silver') && (
                  <p>
                    <strong>Purity:</strong> {purity[jewelry.purity]}
                  </p>
                )}
                <p>
                  <strong>Category:</strong> {jewelry.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
