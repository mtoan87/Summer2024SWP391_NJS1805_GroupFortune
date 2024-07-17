import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './auctions-details.scss';
import api from '../../../../../config/axios';
import { message, Modal } from 'antd';

function AuctionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [auction, setAuction] = useState(null);
    const [jewelryDetails, setJewelryDetails] = useState(null);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [accountWallet, setAccountWallet] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAuctionOpen, setIsAuctionOpen] = useState(false); // State to track if auction is open for joining
    const [isAuctionEnded, setIsAuctionEnded] = useState(false); // State to track if auction has ended

    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accountId = user ? user.accountId : null;

    // Fetch auction details
    const fetchAuctionDetails = useCallback(async () => {
        try {
            const response = await api.get(`api/Auctions/GetById/${id}`);
            const auctionData = response.data;
            console.log('Auction Details:', auctionData);
            setAuction(auctionData);

            const jewelryDetails = await fetchJewelryDetails(auctionData);
            console.log('Jewelry Details:', jewelryDetails);
            setJewelryDetails(jewelryDetails);

            // Check if auction is open for joining
            const currentTime = new Date();
            const auctionStartTime = new Date(auctionData.starttime);
            const auctionEndTime = new Date(auctionData.endtime);
            setIsAuctionOpen(currentTime >= auctionStartTime && currentTime <= auctionEndTime);
            setIsAuctionEnded(currentTime > auctionEndTime); // Check if auction has ended
        } catch (err) {
            console.error('Error fetching auction details:', err);
        }
    }, [id]);

    // Fetch attendee count
    const fetchAttendeeCount = useCallback(async () => {
        try {
            const response = await api.get(`api/Auctions/${id}/account-count`);
            console.log('Attendee Count:', response.data);
            setAttendeeCount(response.data.accountCount);
        } catch (err) {
            console.error('Error fetching attendee count:', err);
        }
    }, [id]);

    // Fetch account wallet
    const fetchAccountWallet = useCallback(async () => {
        if (!user) return;
        try {
            const response = await api.get('AccountWallet/GetAccountWallet');
            console.log('Account Wallet:', response.data);
            const wallets = response.data.$values;
            const userWallet = wallets.find(wallet => wallet.accountId === accountId);
            if (!userWallet) {
                setIsModalVisible(true);
            } else {
                setAccountWallet(userWallet);
            }
        } catch (err) {
            console.error('Error fetching account wallet:', err);
        }
    }, [accountId, user]);

    // Fetch auction details and attendee count on component mount
    useEffect(() => {
        fetchAuctionDetails();
        fetchAttendeeCount();
    }, [fetchAuctionDetails, fetchAttendeeCount]);

    // Display success message if any
    useEffect(() => {
        if (location.state && location.state.message) {
            message.success(location.state.message);
        }
    }, [location.state]);

    // Fetch bid by auction ID
    useEffect(() => {
        if (auction && auction.auctionId) {
            const fetchBidByAuction = async () => {
                try {
                    const bidResponse = await api.get(`api/Bid/GetBidByAuctionId/${auction.auctionId}`);
                    console.log('Bid Response:', bidResponse.data);
                    const bidValues = bidResponse.data.$values;
                    if (bidValues && bidValues.length > 0) {
                        const bidId = bidValues[0].bidId;
                        console.log('Bid ID:', bidId);
                    } else {
                        console.log('No bid data found');
                    }
                } catch (error) {
                    console.error('Error fetching bid by auction:', error);
                }
            };

            fetchBidByAuction();
        }
    }, [auction]);

    // Handle join auction
    const handleJoinAuction = async () => {
        if (!accountWallet) {
            await fetchAccountWallet();
        }
        if (!isAuctionOpen) {
            message.error('Auction has not started yet. You cannot join.');
            return;
        }
        if (auction && auction.accountId === accountId) {
            message.error('You cannot join your own auction.');
            return;
        }
        if (auction && auction.auctionId) {
            try {
                const bidResponse = await api.get(`api/Bid/GetBidByAuctionId/${auction.auctionId}`);
                console.log('Bid Response:', bidResponse.data);
                const bidValues = bidResponse.data.$values;
                if (bidValues && bidValues.length > 0) {
                    const bidId = bidValues[0].bidId;

                    const joinAuctionData = {
                        accountId: accountId,
                        auctionId: auction.auctionId,
                        bidId: bidId,
                    };

                    const response = await api.post('api/JoinAuction/CreateJoinAuction', joinAuctionData);
                    console.log('Join Auction Response:', response.data);
                    message.success('Successfully joined the auction');

                    setTimeout(() => {
                        navigate(`/mybidding/${id}`);
                    }, 1000);
                } else {
                    message.error('No bid data found for this auction');
                }
            } catch (err) {
                console.error('Error joining auction:', err);
                message.error('Failed to join the auction');
            }
        }
    };

    // Handle modal actions
    const handleModalOk = () => {
        setIsModalVisible(false);
        navigate(`/register-wallet/${endpoint}/${UrlID}`);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    if (!auction || !jewelryDetails) {
        return <div>Loading...</div>;
    }

    const purity = {
        'PureSilver925': '92.5%',
        'PureSilver999': '99.9%',
        'PureSilver900': '90.0%',
        'PureSilver958': '95.8%'
    };

    const goldAge = {
        Gold24: '24K',
        Gold22: '22K',
        Gold20: '20K',
        Gold18: '18K',
        Gold14: '14K'
    };

    return (
        <div className="auctions-details">
            <h1>Auction Details</h1>
            <div className="auction-details-content">
                <div className="jewelry-details">
                    {jewelryDetails.map((jewelry, index) => (
                        <div key={index}>
                            <img
                                className='item-img'
                                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                                alt={jewelry.name}
                                onError={(e) => { e.target.src = "../../../../../../src/assets/img/"; }}
                            />
                            <p><strong>Name:</strong> {jewelry.name}</p>
                            <p><strong>Materials:</strong> {jewelry.materials}</p>
                            <p><strong>Description:</strong> {jewelry.description}</p>
                            <p><strong>Price:</strong> ${jewelry.price}</p>
                            <p><strong>Weight:</strong> {jewelry.weight}</p>
                            {jewelry.materials.toLowerCase().includes('gold') && (
                                <p><strong>Gold Age:</strong> {goldAge[jewelry.goldAge]}</p>
                            )}
                            {jewelry.materials.toLowerCase().includes('silver') && (
                                <p><strong>Purity:</strong> {purity[jewelry.purity]}</p>
                            )}
                        </div>
                    ))}

                    <p><strong>Start Time:</strong> {new Date(auction.starttime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(auction.endtime).toLocaleString()}</p>
                    <p><strong>Number of Attendees:</strong> {attendeeCount}</p>

                    {accountWallet && (
                        <div className="account-wallet">
                            <h2>Account Wallet</h2>
                            <p><strong>Bank Name:</strong> {accountWallet.bankName}</p>
                            <p><strong>Bank No:</strong> {accountWallet.bankNo}</p>
                            <p><strong>Budget:</strong> ${accountWallet.budget}</p>
                        </div>
                    )}

                    <button className="join-auction-button" onClick={handleJoinAuction} disabled={!isAuctionOpen || isAuctionEnded}>
                        {isAuctionEnded ? 'Auction Ended' : (isAuctionOpen ? 'Join Auction' : 'Auction Not Open')}
                    </button>
                </div>
            </div>

            <Modal
                title="No Wallet Found"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                cancelText="No"
                okText="Yes"
            >
                <p>No wallet found for your account. Would you like to create one?</p>
            </Modal>
        </div>
    );
}

async function fetchJewelryDetails(item) {
    try {
        let jewelryDetails = [];

        const promises = [];

        if (item.jewelryGoldId) {
            const goldPromise = api.get(`/api/JewelryGold/GetById/${item.jewelryGoldId}`);
            promises.push(goldPromise);
        }

        if (item.jewelrySilverId) {
            const silverPromise = api.get(`/api/JewelrySilver/GetById/${item.jewelrySilverId}`);
            promises.push(silverPromise);
        }

        if (item.jewelryGolddiaId) {
            const golddiaPromise = api.get(`/api/JewelryGoldDia/GetById/${item.jewelryGolddiaId}`);
            promises.push(golddiaPromise);
        }

        const responses = await Promise.all(promises);

        responses.forEach(response => {
            jewelryDetails.push(response.data);
        });

        return jewelryDetails;
    } catch (err) {
        console.error('Error fetching jewelry details:', err);
        return [];
    }
}

export default AuctionDetails;
