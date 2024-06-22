import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/maincontent.scss';
import api from '../../../../../../config/axios';
import Comment from './comment'; // Import Comment component

function MainContent() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [jewelryDetails, setJewelryDetails] = useState(null);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const response = await api.get(`api/Auctions/GetById/${id}`);
                const auctionData = response.data;
                setAuction(auctionData);

                const jewelryDetails = await fetchJewelryDetails(auctionData);
                setJewelryDetails(jewelryDetails);
            } catch (err) {
                console.error('Error fetching auction details:', err);
            }
        };

        fetchAuctionDetails();
    }, [id]);
    console.log(auction)
    console.log(jewelryDetails)
    if (!auction || !jewelryDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auctions-details">
            <h1>Auction Details</h1>
            <div className="auction-details-content">
                <div className="jewelry-details">
                    {jewelryDetails.map((jewelry, index) => (
                        <div key={index} className="jewelry-item">
                            <img
                                className='item-img'
                                src={`https://localhost:44361/${jewelry.jewelryImg}`} 
                                alt={jewelry.name} 
                            />
                            <div className="jewelry-info">
                                <p><strong>Name:</strong> {jewelry.name}</p>
                                <p><strong>Materials:</strong> {jewelry.materials}</p>
                                <p><strong>Description:</strong> {jewelry.description}</p>
                                <p><strong>Price:</strong> ${jewelry.price}</p>
                                <p><strong>Weight:</strong> {jewelry.weight}</p>
                                <p><strong>Gold Age:</strong> {jewelry.goldAge}</p>
                                <p><strong>Category:</strong> {jewelry.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="auction-info">
                    <p><strong>Start Time:</strong> {auction.starttime}</p>
                    <p><strong>End Time:</strong> {auction.endtime}</p>
                    <p><strong>Description:</strong> {auction.description}</p>
                </div>
            </div>
            <Comment auctionId={id} /> {/* Add the Comment component */}
        </div>
    );
}

async function fetchJewelryDetails(item) {
    try {
        let jewelryId;
        let apiUrl;

        if (item.jewelryGoldId) {
            jewelryId = item.jewelryGoldId;
            apiUrl = `/api/JewelryGold/GetById/${jewelryId}`;
        } else if (item.jewelrySilverId) {
            jewelryId = item.jewelrySilverId;
            apiUrl = `/api/JewelrySilver/GetById/${jewelryId}`;
        } else {
            throw new Error("No valid jewelryId found");
        }

        const response = await api.get(apiUrl);
        return [response.data];
    } catch (err) {
        console.error('Error fetching jewelry details:', err);
        return [];
    }
}

export default MainContent;
