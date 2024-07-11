import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as signalR from '@microsoft/signalr';
import '../Styles/bidding.scss';
import api from '../../../../../../config/axios';
import { message } from 'antd';

function BiddingForm() {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [auction, setAuction] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [date, setDate] = useState(null);
    const [startingPrice, setStartingPrice] = useState(null);
    const [bidAmount, setBidAmount] = useState(0);
    const [currentHightPrice, setCurrentHightPrice] = useState(0);
    const [highestPrice, setHighestPrice] = useState(null);
    const [isAuctionActive, setIsAuctionActive] = useState(true);
    const [remainingTime, setRemainingTime] = useState(null);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accountId = user ? user.accountId : null;
    const [accountWallet, setAccountWallet] = useState(null);
    const [budget, setBudget] = useState(null);

    const fetchAccountWallet = async () => {
        try {
            const response = await api.get(`/AccountWallet/GetAccountWalletByAccountId/${accountId}`);
            const walletData = response.data;
            console.log('Account Wallet:', walletData);
            setAccountWallet(walletData);
            setBudget(walletData.budget);
        } catch (error) {
            console.error('Error fetching account wallet:', error);
            message.error('Error fetching account wallet. Please try again.');
        }
    }

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

            // Calculate remaining time
            const totalTime = endDate.getTime() - startDate.getTime();
            setRemainingTime(totalTime);

            // SET STARTING PRICE
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
            const auctionBids = bidsResponse.data.$values;

            const highPrice = auctionBids.length > 0 ? Math.max(...auctionBids.map(bid => bid.maxprice)) : fetchedStartingPrice;
            setHighestPrice(highPrice);
            setCurrentHightPrice(highPrice);
        } catch (err) {
            console.error('Error fetching auction details:', err);
            toast.error('Error fetching auction details. Please try again.');
        }
    };

    useEffect(() => {
        if (accountId) {
            fetchAccountWallet();
        } else {
            console.error('No accountId found');
        }

        fetchAuctionDetails();

        const connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl("https://localhost:44361/bidding-hub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        connection.on("HighestPrice", (price) => {
            message.info(`Highest Price: ${price}`);
            setHighestPrice(price);
        })

        connection.on("ReceiveNotification", (title, content) => {
            toast.info(content, title)
        })

        connection.start()
            .then(() => {
                connection.invoke("JoinRoom", id)
                    .then(() => {
                        console.log("Connected to auction room: " + id)
                        message.info("Connected to auction room: " + id)
                    })
            })
            .catch((err) => document.write(err));

        // Countdown timer
        const intervalId = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1000) {
                    clearInterval(intervalId);
                    setIsAuctionActive(false);
                    toast.info("Auction has ended!");
                    navigate(`/auction/${id}`); // Navigate to auction-details page
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [id, accountId]);

    const formatRemainingTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleBidSubmit = async () => {
        if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
            message.error('Please enter a valid bid amount.');
            return;
        }
        if (budget <= highestPrice) {
            toast.error('Your budget is insufficient to place a bid.');
            return;
        }

        try {
            const bidData = {
                bidId: id,
                auctionId: auction.auctionId,
                bidStep: bidAmount,
            };

            const response = await api.post('/api/Bid/Bidding', bidData);

            if (response.status === 200) {
                setBidAmount(0);
            } else {
                message.error('Error submitting bid. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting bid:', err);
            toast.error('Error submitting bid. Please try again.');
        }
    };

    const handleDisabledClick = () => {
        toast.error('Your budget is insufficient to place a bid.');
    };

    return (
        <div className="bidding-form">
            <h2>Auction</h2>
            <div className="infor-auction">
                <ul>
                    <li><ClockCircleOutlined /> <strong>Date:</strong> {date}</li>
                    <li><ClockCircleOutlined /> <strong>Start-Time:</strong> {startTime}</li>
                    <li><ClockCircleOutlined /> <strong>End-Time:</strong> {endTime}</li>
                    <li><ClockCircleOutlined /> <strong>Time remaining:</strong> {formatRemainingTime(remainingTime)}</li>
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
                            disabled={!isAuctionActive || budget <= highestPrice}
                        />
                    </li>
                    <li>
                        <button 
                            onClick={isAuctionActive && budget > highestPrice ? handleBidSubmit : handleDisabledClick} 
                            disabled={!isAuctionActive || budget <= highestPrice}
                        >
                            Send
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default BiddingForm;
