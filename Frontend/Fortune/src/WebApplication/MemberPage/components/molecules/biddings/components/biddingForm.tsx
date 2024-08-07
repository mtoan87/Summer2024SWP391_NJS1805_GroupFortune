import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';
import * as signalR from '@microsoft/signalr';
import '../Styles/bidding.scss';
import api from '../../../../../../config/axios';
import { Button, message } from 'antd';

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
            console.log(auctionData);

            setAuction(auctionData);

            const responseTime = await api.get('/api/Auctions/remaining-time');
            const timeData = responseTime.data?.$values || [];
            const filterTimeData = timeData.find(record => record.auctionId === auctionData.auctionId);
            if (filterTimeData) {
                const remainingTimeMilliseconds = convertTimeStringToMilliseconds(filterTimeData.remainingTime);
                setRemainingTime(remainingTimeMilliseconds);
                console.log(remainingTimeMilliseconds);
            }

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
        } catch (err) {
            console.error('Error fetching auction details:', err);
            message.error('Error fetching auction details. Please try again.');

            // Set bidRecords to an empty array on error to avoid map error
            setBidRecords([]);
        }
    };

    const convertTimeStringToMilliseconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':');
        const [sec, ms] = seconds.split('.');
        return (
            parseInt(hours, 10) * 60 * 60 * 1000 +
            parseInt(minutes, 10) * 60 * 1000 +
            parseInt(sec, 10) * 1000 +
            parseInt(ms, 10)
        );
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
        const intervalId = setInterval(async () => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1000) {
                    clearInterval(intervalId);
                    announceWinnerAndSubmitResult();
                    updateAuctionStatus();
                    setTimeout(() => {
                        navigate('/');
                    }, 5000);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [bidRecords]);

    const updateAuctionStatus = async () => {
        try {
            let updateUrl = '';
            let auctionData = {};

            if (auction?.jewelryGoldId) {
                updateUrl = `/api/Auctions/UpdateGoldAuction?id=${auction.auctionId}`;
                auctionData = {
                    accountId: auction.accountId,
                    jewelryGoldId: auction.jewelryGoldId,
                    starttime: auction.starttime,
                    endtime: auction.endtime,
                    status: 'UnActive'
                };
            } else if (auction?.jewelrySilverId) {
                updateUrl = `/api/Auctions/UpdateSilverAuction?id=${auction.auctionId}`;
                auctionData = {
                    accountId: auction.accountId,
                    jewelrySilverId: auction.jewelrySilverId,
                    starttime: auction.starttime,
                    endtime: auction.endtime,
                    status: 'UnActive'
                };
            } else if (auction?.jewelryGolddiaId) {
                updateUrl = `/api/Auctions/UpdateGoldDiamondAuction?id=${auction.auctionId}`;
                auctionData = {
                    accountId: auction.accountId,
                    jewelryGolddiaId: auction.jewelryGolddiaId,
                    starttime: auction.starttime,
                    endtime: auction.endtime,
                    status: 'UnActive'
                };
            } else {
                console.error('Unknown jewelry type');
                return;
            }

            await api.put(updateUrl, auctionData);
            message.success('Auction has ended');
        } catch (error) {
            console.error('Error updating auction status:', error);
            message.error('Error updating auction status. Please try again.');
        }
    };

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
                try {
                    // Fetch the join auction records
                    const joinAuctionResponse = await api.get('/api/JoinAuction');
                    console.log('Join auction response:', joinAuctionResponse);

                    const joinAuctionRecords = joinAuctionResponse.data.$values;
                    console.log('Join auction records:', joinAuctionRecords);

                    // Find the latest join record for the winner
                    const filteredRecords = joinAuctionRecords.filter(record => record.accountId === winnerAccountId);
                    const latestJoinRecord = filteredRecords.length > 0 ? filteredRecords.reduce((latest, current) => {
                        return new Date(current.joindate) > new Date(latest.joindate) ? current : latest;
                    }) : null;

                    const auctionResultData = {
                        joinauctionId: latestJoinRecord ? latestJoinRecord.id : 0,
                        status: 'Win',
                        price: highestBidAmount,
                        accountId: winnerAccountId,
                    };

                    console.log('Auction result data:', auctionResultData);

                    // Submit auction result
                    await api.post('/api/AuctionResults/CreateAuctionResult', auctionResultData);
                    message.success(`User ${winnerAccountId} with a bid of $${highestBidAmount} is the winner.`);
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

    const handleBidAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        if (value >= 0 && value <= 50000) {
            setBidAmount(value);
        } else {
            if (value < 0) {
                message.error('Bid amount cannot be negative.');
            } else if (value > 50000) {
                message.error('Bid amount cannot exceed 50,000.');
            }
        }
    };

    const handleEndAuction = () => {
        updateAuctionStatus();
        announceWinnerAndSubmitResult();
        setTimeout(() => {
            navigate('/staff-auctions');
        }, 1000);
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
                    {user && user.role === 3 ? (
                        <li>
                            <Button type="primary" onClick={handleEndAuction}>
                                End Auction
                            </Button>
                        </li>
                    ) : (
                        <li>
                            <input
                                type="number"
                                placeholder="Enter your bid"
                                value={bidAmount}
                                onChange={handleBidAmountChange}
                            />
                            <Button type="primary" onClick={handleBidSubmit}>
                                Place Bid
                            </Button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default BiddingForm;
