import { useState, useEffect } from 'react';
import api from '../../../../../config/axios';
import './staff-auction.scss';
import { useNavigate } from 'react-router-dom';

function StaffViewAuction() {
    const [auctions, setAuctions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('api/Auctions/GetAllActiveAuctions');
                const auctionsData = response.data.$values;
                const auctionsWithImagesAndNames = await Promise.all(
                    auctionsData.map(async (auction) => {
                        const { imageUrl, jewelryName } = await fetchAuctionImage(auction);
                        return { ...auction, imageUrl, jewelryName };
                    })
                );
                setAuctions(auctionsWithImagesAndNames);
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, []);

    const fetchAuctionImage = async (auction) => {
        try {
            const { jewelryGoldId, jewelrySilverId, jewelryGolddiaId } = auction;
            let apiUrl;

            if (jewelryGoldId) {
                apiUrl = `/api/JewelryGold/GetById/${jewelryGoldId}`;
            } else if (jewelrySilverId) {
                apiUrl = `/api/JewelrySilver/GetById/${jewelrySilverId}`;
            } else if (jewelryGolddiaId) {
                apiUrl = `/api/JewelryGoldDia/GetById/${jewelryGolddiaId}`;
            }

            if (apiUrl) {
                const response = await api.get(apiUrl);
                const imageUrl = response.data?.jewelryImg || 'src/assets/img/jewelry_introduction.jpg';
                const jewelryName = response.data?.name || 'Unknown Jewelry';
                return { imageUrl, jewelryName };
            }

            return { imageUrl: 'src/assets/img/jewelry_introduction.jpg', jewelryName: 'Unknown Jewelry' };
        } catch (err) {
            console.error('Error fetching auction image:', err);
            return { imageUrl: 'src/assets/img/jewelry_introduction.jpg', jewelryName: 'Unknown Jewelry' };
        }
    };

    const handleAuctionClick = (auctionId) => {
        navigate(`/staff-auction-details/${auctionId}`);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(auctions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedAuctions = auctions.slice(startIndex, startIndex + itemsPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="staff-auctions-content">
                <h1>AUCTIONS</h1>
            </div>
            <div className="staff-auctions-container">
                {auctions.length === 0 ? (
                    <p>There are no available auctions</p>
                ) : (
                    displayedAuctions.map((auction) => (
                        <div
                            key={auction.auctionId}
                            className="staff-auctions-item"
                            onClick={() => handleAuctionClick(auction.auctionId)}
                        >
                            <img
                                src={`https://localhost:44361/${auction.imageUrl}`}
                                alt="Jewelry"
                            />
                            <label>{auction.jewelryName}</label>
                            <p>Date: {formatDate(auction.starttime)}</p>
                            <p>Start Time: {formatTime(auction.starttime)}</p>
                            <p>End Time: {formatTime(auction.endtime)}</p>
                        </div>
                    ))
                )}
            </div>
            {auctions.length > 0 && (
                <div className="staff-navigation-buttons">
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => goToPage(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </>
    );
}

export default StaffViewAuction;
