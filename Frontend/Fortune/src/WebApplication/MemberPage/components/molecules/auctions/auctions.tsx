import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './auctions.scss';

function MemberAuctions() {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('api/Auctions/GetAllActiveAuctions');
                const auctionsData = response.data.$values;

                // Fetch images for each auction
                const auctionsWithImages = await Promise.all(
                    auctionsData.map(async (auction) => {
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
    }, []);

    const fetchJewelryImage = async (jewelryId) => {
        try {
            const response = await api.get(`api/Jewelries/GetById/${jewelryId}`);
            return response.data.jewelryImg; // Assuming imageUrl is the property containing the image URL
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
                        <img src={auction.imageUrl || "../../../../../../src/assets/img/jewelry_introduction.jpg"} alt={auction.imageUrl } />
                        <p>Start Time: {auction.starttime}</p>
                        <p>End Time: {auction.endtime}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default MemberAuctions;
