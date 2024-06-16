import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './auctions.scss';

function MemberAuctions() {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();
    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
    const accountId = loginedUser?.accountId;

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('api/Auctions/GetAllActiveAuctions');
                const auctionsData = response.data.$values;

                // Filter out auctions that have the same accountId as the logged-in user
                const filteredAuctions = auctionsData.filter(auction => auction.accountId !== accountId);

                // Fetch images for each auction
                const auctionsWithImages = await Promise.all(
                    filteredAuctions.map(async (auction) => {
                        const imageUrl = await fetchJewelryImage(auction.jewelryId);
                        return { ...auction, imageUrl };
                    })
                );

                setAuctions(auctionsWithImages);
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, [accountId]);

    const fetchJewelryImage = async (jewelryId) => {
        try {
            const response = await api.get(`api/Jewelries/GetById/${jewelryId}`);
            return response.data.jewelryImg; // Assuming jewelryImg is the property containing the image URL
        } catch (err) {
            console.error('Error fetching jewelry image:', err);
            return null;
        }
    };

    const handleAuctionClick = (auctionId) => {
        navigate(`/auction/${auctionId}`);
    };

    return (
        <>
            <div className="auctions-content">
                <h1>Auctions</h1>
            </div>
            <div className="auctions-container">
                {auctions.map((auction) => (
                    <div key={auction.auctionId} className="auction-item" onClick={() => handleAuctionClick(auction.auctionId)}>
                        <img 
                            src={`https://localhost:44361/${auction.imageUrl}`} 
                            onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
                            alt="Jewelry"
                        />
                        <p>Start Time: {auction.starttime}</p>
                        <p>End Time: {auction.endtime}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default MemberAuctions;
