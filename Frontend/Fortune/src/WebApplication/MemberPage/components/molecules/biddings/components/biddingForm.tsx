import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Styles/bidding.scss';
import api from '../../../../../../config/axios';

function BiddingForm() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [date, setDate] = useState(null);
    const [startingPrice, setStartingPrice] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [highestPrice, setHighestPrice] = useState(null);
    const [isAuctionActive, setIsAuctionActive] = useState(true);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accountId = user ? user.accountId : null;

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                
                const response = await api.get(`api/Auctions/GetById/${id}`);
                const auctionData = response.data;
                setAuction(auctionData);

                const startDate = new Date(auctionData.starttime);
                const endDate = new Date(auctionData.endtime);
                setDate(startDate.toLocaleDateString());
                setStartTime(startDate.toLocaleTimeString());
                setEndTime(endDate.toLocaleTimeString());

                let fetchedStartingPrice = 0;
                if (auctionData.jewelryGoldId) {
                    const jewelryResponse = await api.get(`/api/JewelryGold/GetById/${auctionData.jewelryGoldId}`);
                    fetchedStartingPrice = jewelryResponse.data.price;
                } else if (auctionData.jewelrySilverId) {
                    const jewelryResponse = await api.get(`/api/JewelrySilver/GetById/${auctionData.jewelrySilverId}`);
                    fetchedStartingPrice = jewelryResponse.data.price;
                } else {
                    const jewelryResponse = await api.get(`/api/Auctions/GetById/${auctionData.jewelryGolddiaId}`);
                    fetchedStartingPrice = jewelryResponse.data.price;
                }

                setStartingPrice(fetchedStartingPrice);

                // Fetch bids and identify the highest maxprice
                const bidsResponse = await api.get('/api/Bid/GetAllBids');
                const allBids = bidsResponse.data.$values;
                const auctionBids = allBids.filter(bid => bid.auctionId === auctionData.auctionId);
                const highestMaxPrice = auctionBids.length ? Math.max(...auctionBids.map(bid => bid.maxprice)) : fetchedStartingPrice;
                setHighestPrice(highestMaxPrice);
            } catch (err) {
                console.error('Error fetching auction details:', err);
            }
        };

        fetchAuctionDetails();
    }, [id]);

    const closeAuction = async () => {
        if (!isAuctionActive || !auction) return;

        setIsAuctionActive(false);

        try {
            const bidsResponse = await api.get('/api/Bid/GetAllBids');
            const allBids = bidsResponse.data.$values;
            const auctionBids = allBids.filter(bid => bid.auctionId === auction.auctionId);
            const highestBid = auctionBids.reduce((max, bid) => (bid.maxprice > max.maxprice ? bid : max), auctionBids[0]);

            if (highestBid) {
                const auctionResultData = {
                    joinauctionId: highestBid.bidId,
                    date: new Date().toISOString(),
                    status: 'Won',
                    price: highestBid.maxprice,
                    accountId: highestBid.accountId,
                };

                await api.post('/api/AuctionResults/CreateAuctionResult', auctionResultData);
                toast.success(`Auction closed. User ${highestBid.accountId} won the jewelry!`);
            }
        } catch (err) {
            console.error('Error closing auction:', err);
            toast.error('Error closing auction. Please try again.');
        }
    };

    const handleBidSubmit = async () => {
        if (!bidAmount || isNaN(bidAmount)) {
            toast.error('Please enter a valid bid amount.');
            return;
        }

        try {
            const bidData = {
                accountId: accountId,
                auctionId: auction.auctionId,
                bidStep: parseFloat(bidAmount),
            };

            await api.post('/api/Bid/Bidding', bidData);
            setHighestPrice(prevHighestPrice => prevHighestPrice + parseFloat(bidAmount));
            toast.success('Bid submitted successfully!');
        } catch (err) {
            console.error('Error submitting bid:', err);
            toast.error('Error submitting bid. Please try again.');
        }
    };

    return (
        <>
        
        <div className="bidding-form">
            <h2>Auction</h2>
            <div className="infor-auction">
                <ul>
                    <li><ClockCircleOutlined /> <strong>Date:</strong> {date}</li>
                    <li><ClockCircleOutlined /> <strong>Start-Time:</strong> {startTime} </li>
                    <li><ClockCircleOutlined /> <strong>End-Time:</strong> {endTime}</li>
                </ul>
            </div>
            <div className="infor-price">
                <ul>
                    <li><DollarCircleOutlined /> <strong>Starting Price:</strong> ${startingPrice}</li>
                    <li><DollarCircleOutlined /> <strong>Highest Price:</strong> ${highestPrice}</li>
                </ul>
            </div>
            <div className="infor-bidding">
                <ul>
                    <li><strong>Fill Your Price to Bidding!</strong></li>
                    <li>
                        <input
                            type="number"
                            placeholder="Price"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            disabled={!isAuctionActive}
                        />
                    </li>
                    <li>
                        <button onClick={handleBidSubmit} disabled={!isAuctionActive}>Send</button>
                    </li>
                </ul>
            </div>
        </div></>
        
    );
}

export default BiddingForm;
