import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './auctions-details.scss';
import api from '../../../../../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuctionDetails() {
    const { id } = useParams();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [auction, setAuction] = useState(null);
    const [jewelryDetails, setJewelryDetails] = useState(null);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const response = await api.get(`api/Auctions/GetById/${id}`);
                const auctionData = response.data;
                console.log('Auction Details:', auctionData);
                setAuction(auctionData);

                const jewelryDetails = await fetchJewelryDetails(auctionData);
                console.log('Jewelry Details:', jewelryDetails);
                setJewelryDetails(jewelryDetails);

            } catch (err) {
                console.error('Error fetching auction details:', err);
            }
        };

        const fetchAttendeeCount = async () => {
            try {
                const response = await api.get(`api/Auctions/${id}/account-count`);
                console.log('Attendee Count:', response.data);
                setAttendeeCount(response.data.accountCount);
            } catch (err) {
                console.error('Error fetching attendee count:', err);
            }
        };

        fetchAuctionDetails();
        fetchAttendeeCount();
    }, [id]);

    const handleJoinAuction = async () => {
        if (!user) {
            console.error('User not logged in');
            toast.error('You need to log in to join the auction', { position: "top-right" });
            return;
        }

        try {
            const bidResponse = await api.get(`api/Bid/GetBidByAccountId/${user.accountId}`);
            console.log('Bid Response:', bidResponse.data);
            const bidId = bidResponse.data.bid_id;

            const joinAuctionData = {
                accountId: user.accountId,
                auctionId: id,
                bidId: bidId,
            };

            const response = await api.post('api/JoinAuction/CreateJoinAuction', joinAuctionData);
            console.log('Join Auction Response:', response.data);
            toast.success('Successfully joined the auction', { position: "top-right" });

            // Delayed navigation after joining auction
            setTimeout(() => {
                navigate(`/mybidding/${id}`); // Navigate to home or any desired route
            }, 1000); // 1 second delay

        } catch (err) {
            console.error('Error joining auction:', err);
            toast.error('Failed to join the auction', { position: "top-right" });
        }
    };

    if (!auction || !jewelryDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auctions-details">
            <h1>Auction Details</h1>
            <div className="auction-details-content">
                <div className="jewelry-details">
                    {jewelryDetails.map((jewelry, index) => (
                        <div key={index}>
                            <img className='item-img'
                                src={`https://localhost:44361/assets/${jewelry.jewelryImg}`} 
                                alt={jewelry.name} 
                            />
                            <p><strong>Name:</strong> {jewelry.name}</p>
                            <p><strong>Materials:</strong> {jewelry.materials}</p>
                            <p><strong>Description:</strong> {jewelry.description}</p>
                            <p><strong>Price:</strong> ${jewelry.price}</p>
                            <p><strong>Weight:</strong> {jewelry.weight}</p>
                            <p><strong>Gold Age:</strong> {jewelry.goldAge}</p>
                            <p><strong>Category:</strong> {jewelry.category}</p>
                        </div>
                    ))}
                    
                    <p><strong>Start Time:</strong> {auction.starttime}</p>
                    <p><strong>End Time:</strong> {auction.endtime}</p>
                    <p><strong>Auction Description:</strong> {auction.description}</p>
                    <p><strong>Number of Attendees:</strong> {attendeeCount}</p>
                    <button className="join-auction-button" onClick={handleJoinAuction}>Join Auction</button>
                </div>
            </div>
            <ToastContainer />
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
        const jewelryDetails = response.data;
        return [jewelryDetails];
    } catch (err) {
        console.error('Error fetching jewelry details:', err);
        return [];
    }
}

export default AuctionDetails;
