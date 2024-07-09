import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//
import '../Styles/bidding.scss';
import api from '../../../../../../config/axios';

function BiddingForm() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [date, setDate] = useState(null);
    const [startingPrice, setStartingPrice] = useState(null);
    const [bidAmount, setBidAmount] = useState(0);
    const [currentHightPrice, setCurrentHightPrice] = useState(0);
    const [highestPrice, setHighestPrice] = useState(null);
    const [isAuctionActive, setIsAuctionActive] = useState(true);
    const [bidResponse, setBidResponse] = useState(null);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accountId = user ? user.accountId : null;

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
            } else if (auctionData.jewelryGolddiaId) {
                const jewelryResponse = await api.get(`/api/JewelryGoldDia/GetById/${auctionData.jewelryGolddiaId}`);
                fetchedStartingPrice = jewelryResponse.data.price;
            }

            setStartingPrice(fetchedStartingPrice);

            const bidsResponse = await api.get(`/api/Bid/GetBidByAuctionId/${auctionData.auctionId}`);
            const auctionBids = bidsResponse.data;
            console.log(auctionBids);
            const highPrice = auctionBids.length > 0 ? Math.max(...auctionBids.map(bid => bid.maxprice)) : fetchedStartingPrice;
            setHighestPrice(highPrice);
            setCurrentHightPrice(highPrice);
        } catch (err) {
            console.error('Error fetching auction details:', err);
            toast.error('Error fetching auction details. Please try again.');
        }
    };

    useEffect(() => {
        fetchAuctionDetails();
    }, [id]);

    useEffect(() => {
        if (bidResponse) {
            if (bidResponse.status === 200) {
                setHighestPrice(currentHightPrice + bidAmount);
                setBidAmount(0);
                toast.success('Bid submitted successfully!');
            } else {
                toast.error('Error submitting bid. Please try again.');
            }
        }
    }, [bidResponse]);

    const handleBidSubmit = async () => {
        if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
            toast.error('Please enter a valid bid amount.');
            return;
        }

        try {
            const bidData = {
                bidId: auction.bidId,
                auctionId: auction.auctionId,
                bidStep: bidAmount,
            };

            const response = await api.post('/api/Bid/Bidding', bidData);
            setBidResponse(response);
        } catch (err) {
            console.error('Error submitting bid:', err);
            toast.error('Error submitting bid. Please try again.');
        }
    };

    return (
        <div className="bidding-form">
            <h2>Auction</h2>
            <div className="infor-auction">
                <ul>
                    <li><ClockCircleOutlined /> <strong>Date:</strong> {date}</li>
                    <li><ClockCircleOutlined /> <strong>Start-Time:</strong> {startTime}</li>
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
                            min={0}
                            max={99999}
                            step={1}
                            value={bidAmount === 0 ? "" : bidAmount}
                            onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                            disabled={!isAuctionActive}
                        />
                    </li>
                    <li>
                        <button onClick={handleBidSubmit} disabled={!isAuctionActive}>Send</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default BiddingForm;
