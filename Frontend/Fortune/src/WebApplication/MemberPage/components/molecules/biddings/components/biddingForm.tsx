import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';
import * as signalR from '@microsoft/signalr';
import '../Styles/bidding.scss';
import api from '../../../../../../config/axios';
import { message } from 'antd';

function BiddingForm() {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [bidRecords, setBidRecords] = useState([]); // Initialize as an array
    const [lastBidderId, setLastBidderId] = useState(null);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accountId = user ? user.accountId : null;
    const [accountWallet, setAccountWallet] = useState(null);
    const [budget, setBudget] = useState(null);

    const fetchAccountWallet = async () => {
        try {
            const response = await api.get(`/AccountWallet/GetAccountWalletByAccountId/${accountId}`);
            const walletData = response.data;
            setAccountWallet(walletData);
            setBudget(walletData.budget);
        } catch (error) {
            console.error('Error fetching account wallet:', error);
            message.error('Error fetching account wallet. Please try again.');
        }
    };

    const fetchAuctionDetails = async () => {
        try {
            const response = await api.get(`api/Auctions/GetById/${id}`);
            const auctionData = response.data;
            setAuction(auctionData);

            const startDate = new Date(auctionData.starttime);
            const endDate = new Date(auctionData.endtime);

            const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            setDate(startDate.toLocaleDateString());
            setStartTime(formattedStartTime);
            setEndTime(formattedEndTime);

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
            const auctionBids = bidsResponse.data.$values || [];

            const bidsRecordsResponse = await api.get(`/api/BidRecord/GetBidRecordByBidId?BidId=${auctionData.auctionId}`);
            const allBidRecords = bidsRecordsResponse.data.$values || [];

            // Ensure bidRecords is set to an array and get the top 5 records
            const topBidRecords = allBidRecords.slice(0, 5);
            setBidRecords(Array.isArray(topBidRecords) ? topBidRecords : []);


            const highPrice = auctionBids.length > 0 ? Math.max(...auctionBids.map(bid => bid.maxprice)) : fetchedStartingPrice;
            setHighestPrice(highPrice);
            setCurrentHightPrice(highPrice);

            // Calculate remaining time
            const totalTime = endDate.getTime() - Date.now(); // Calculate remaining time from current time
            setRemainingTime(totalTime);

        } catch (err) {
            console.error('Error fetching auction details:', err);
            message.error('Error fetching auction details. Please try again.');

            // Set bidRecords to an empty array on error to avoid map error
            setBidRecords([]);
        }
    };


    // SIGNALR
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
        });

        connection.on("BidStep", (bids) => {
            const newBidInstance = bids.$values[0];

            // Use functional state update to get the latest state
            setBidRecords(prevBidRecords => {
                const temp = prevBidRecords.slice(0, prevBidRecords.length - 1);
                console.log(prevBidRecords);
                console.log(temp);
                console.log(newBidInstance, ...temp);
                return [newBidInstance, ...temp];
            });
            setLastBidderId(newBidInstance.accountId);

            message.info(`New bidstep records: ${JSON.stringify(newBidInstance.bidStep)}`);
        });

        connection.on("ReceiveNotification", (title, content) => {
            message.info(content, title);
        });

        connection.start()
            .then(() => {
                connection.invoke("JoinRoom", id)
                    .then(() => {
                        message.info("Connected to auction room: " + id);
                    });
            })
            .catch((err) => document.write(err));
    }, [id, accountId]);

    useEffect(() => {
        // Countdown timer
        const intervalId = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1000) {
                    clearInterval(intervalId);
                    setIsAuctionActive(false);
                    announceWinnerAndSubmitResult();
                    setTimeout(() => {
                        navigate(`/auction/${id}`);
                    }, 5000);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [bidRecords])

    const formatRemainingTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const announceWinnerAndSubmitResult = async () => {
        if (bidRecords.length > 0) {
            // Find the highest bid amount and determine the winner
            let highestBidAmount = 0;
            let winnerAccountId = null;
    
            // Identify the highest bid
            bidRecords.forEach(record => {
                if (record.bidAmount > highestBidAmount) {
                    highestBidAmount = record.bidAmount;
                    winnerAccountId = record.accountId;
                }
            });
    
            if (winnerAccountId) {
                // Fetch the join auction records
                const joinAuctionResponse = await api.get('/api/JoinAuction');
                const joinAuctionRecords = joinAuctionResponse.data.$values;
    
                // Find the latest join record for the winner
                const latestJoinRecord = joinAuctionRecords
                    .filter(record => record.accountId === winnerAccountId)
                    .reduce((latest, current) => {
                        return new Date(current.joindate) > new Date(latest.joindate) ? current : latest;
                    });
    
                const auctionResultData = {
                    joinauctionId: latestJoinRecord ? latestJoinRecord.id : null,
                    date: new Date().toISOString(),
                    status: 'Win',
                    price: highestBidAmount,
                    accountId: winnerAccountId,
                };
    
                console.log(auctionResultData);
    
                try {
                    await api.post('/api/AuctionResults/CreateAuctionResult', auctionResultData);
                    message.success(`User ${winnerAccountId} with a bid of $${highestBidAmount} is the winner.`);
                    message.success('Auction results submitted successfully.');
                } catch (error) {
                    console.error(`Error submitting auction result for account ${winnerAccountId}:`, error);
                    message.error('Error submitting auction result. Please try again.');
                }
            } else {
                message.info('Bid records failed');
            }
        } else {
            message.info('No bids were placed in this auction.');
        }
    };
    
    

    const handleBidSubmit = async () => {
        if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
            message.error('Please enter a valid bid amount.');
            return;
        }
        if (budget <= highestPrice) {
            message.error('Your budget is insufficient to place a bid.');
            return;
        }

        if (lastBidderId === accountId) {
            message.error('Please wait for another user to place a bid.');
            return;
        }

        try {
            const bidData = {
                bidId: parseInt(id),
                auctionId: auction.auctionId,
                bidStep: bidAmount,
                accountId: accountId, // Include accountId in the bidData object
            };

            const response = await api.post('/api/Bid/Bidding', bidData);

            if (response.status === 200) {
                setBidAmount(0);

                // Get new bid amount list based on auctionId
                const newBidData = await api.get(`/api/BidRecord/GetBidRecordByBidId?BidId=${auction.auctionId}`);

                // Get top 5 value from newBidData
                const topBidRecords = newBidData.data.$values.slice(0, 5);

                setBidRecords(Array.isArray(topBidRecords) ? topBidRecords : []);
            } else {
                message.error('Error submitting bid. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting bid:', err);
            message.error('Error submitting bid. Please try again.');
        }
    };



    const handleDisabledClick = () => {
        message.error('Your budget is insufficient to place a bid.');
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
            <div className="bid-records">
                <h2>Bid Records</h2>
                <span>
                    {bidRecords.length > 0 ? (
                        bidRecords.map((record, index) => (
                            <li key={index}>
                                <span>
                                    <strong>User</strong> {record.accountId} <strong>has bid</strong> {record.bidStep}$
                                </span>
                            </li>
                        ))
                    ) : (
                        <li>No bids placed yet.</li>
                    )}
                </span>
            </div>
            <div className="infor-bidding">
                <ul>
                    <li>
                        <input
                            type="number"
                            placeholder="Enter your bid"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                        />
                        {/* <button
                            onClick={budget > highestPrice ? handleBidSubmit : handleDisabledClick}
                            disabled={budget <= highestPrice}
                        >
                            Place Bid
                        </button> */}
                        <button
                            onClick={handleBidSubmit}
                        >
                            Place Bid
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default BiddingForm;
