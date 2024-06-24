import { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import './member-auction.scss';
import { useNavigate } from 'react-router-dom';

function MemberAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('/api/Auctions/GetAllActiveAuctions');
                const auctionsData = response.data.$values;
                console.log('Fetched auctions data:', auctionsData);

                const auctionsWithImages = await Promise.all(
                    auctionsData.map(async (auction) => {
                        const imageUrl = await fetchAuctionImage(auction);
                        return { ...auction, imageUrl };
                    })
                );
                setAuctions(auctionsWithImages);
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, []);

    const fetchAuctionImage = async (auction) => {
        try {
            const { jewelryGoldId, jewelrySilverId } = auction;
            const apiUrl = jewelryGoldId
                ? `/api/JewelryGold/GetById/${jewelryGoldId}`
                : `/api/JewelrySilver/GetById/${jewelrySilverId}`;

            const response = await api.get(apiUrl);
            const imageUrl = response.data?.jewelryImg || 'src/assets/img/jewelry_introduction.jpg';
            return `https://localhost:44361/assets/${imageUrl}`;
        } catch (err) {
            console.error('Error fetching auction image:', err);
            return 'src/assets/img/jewelry_introduction.jpg';
        }
    };

    const handleAuctionClick = (auctionId) => {
        navigate(`/auction/${auctionId}`);
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
            <div className="member-auctions-content">
                <h1>AUCTIONS</h1>
            </div>
            <div className="member-auctions-container">
                {auctions.length === 0 ? (
                    <p>There are no available auctions</p>
                ) : (
                    displayedAuctions.map((auction) => (
                        <div
                            key={auction.auctionId}
                            className="member-auction-item"
                            onClick={() => handleAuctionClick(auction.auctionId)}
                        >
                            <img
                                src={auction.imageUrl}
                                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
                                alt="Jewelry"
                            />
                            <p>Date: {formatDate(auction.starttime)}</p>
                            <p>Start Time: {formatTime(auction.starttime)}</p>
                            <p>End Time: {formatTime(auction.endtime)}</p>
                        </div>
                    ))
                )}
            </div>
            {auctions.length > 0 && (
                <div className="member-navigation-buttons">
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

export default MemberAuctions;
