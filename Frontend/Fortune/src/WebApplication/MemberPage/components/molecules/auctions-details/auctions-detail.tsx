import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../../../config/axios';
import './auctions-details.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuctionDetails() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [jewelry, setJewelry] = useState(null);
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

                // Fetch the jewelry details
                const jewelryResponse = await api.get(`api/Jewelries/GetById/${auctionData.jewelryId}`);
                console.log('Jewelry Details:', jewelryResponse.data);
                setJewelry(jewelryResponse.data);
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
        } catch (err) {
            console.error('Error joining auction:', err);
            toast.error('Failed to join the auction', { position: "top-right" });
        }
    };

    if (!auction || !jewelry) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auctions-details">
            <h1>Auction Details</h1>
            <div className="auction-details-content">
                <div className="jewelry-details">
                    <img src={jewelry.jewelryImg} alt="Auction Item" />
                    <p><strong>Name:</strong> {jewelry.name}</p>
                    <p><strong>Materials:</strong> {jewelry.materials}</p>
                    <p><strong>Description:</strong> {jewelry.description}</p>
                    <p><strong>Price:</strong> ${jewelry.price}</p>
                    <p><strong>Weight:</strong> {jewelry.weight}</p>
                    <p><strong>Gold Age:</strong> {jewelry.goldage}</p>
                    <p><strong>Collection:</strong> {jewelry.collection}</p>
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

export default AuctionDetails;
