import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../config/axios';
import '../../styles/guest-auction-details.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GuestAuctionDetails() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [jewelry, setJewelry] = useState(null);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const response = await api.get(`api/Auctions/GetById/${id}`);
                const auctionData = response.data;
                console.log('Auction Details:', auctionData);
                setAuction(auctionData);

                // Fetch the jewelry details based on the type
                const jewelryResponse = await api.get(
                    auctionData.jewelryGoldId
                        ? `api/JewelryGold/GetById/${auctionData.jewelryGoldId}`
                        : `api/JewelrySilver/GetById/${auctionData.jewelrySilverId}`
                );
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

    const handleJoinAuction = () => {
        navigate('/login');
    };

    if (!auction || !jewelry) {
        return <div>Loading...</div>;
    }

    return (
        <div className="guest-auctions-details">
            <h1>Auction Details</h1>
            <div className="guest-auction-details-content">
                <div className="guest-jewelry-details">
                    <img
                        className='guest-item-img'
                        src={`https://localhost:44361/${jewelry.jewelryImg}`}
                        alt={jewelry.name}
                        onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
                    />
                    <p><strong>Name:</strong> {jewelry.name}</p>
                    <p><strong>Materials:</strong> {jewelry.materials}</p>
                    <p><strong>Description:</strong> {jewelry.description}</p>
                    <p><strong>Price:</strong> ${jewelry.price}</p>
                    <p><strong>Weight:</strong> {jewelry.weight}</p>
                    <p><strong>Gold Age:</strong> {jewelry.goldAge}</p>
                    <p><strong>Category:</strong> {jewelry.category}</p>
                    <p><strong>Start Time:</strong> {auction.starttime}</p>
                    <p><strong>End Time:</strong> {auction.endtime}</p>
                    <p><strong>Auction Description:</strong> {auction.description}</p>
                    <p><strong>Number of Attendees:</strong> {attendeeCount}</p>
                    <button className="guest-join-auction-button" onClick={handleJoinAuction}>Join Auction</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default GuestAuctionDetails;
