import { useEffect, useState } from 'react';
import api from '../../../config/axios';
import '../styles/auctions.scss';

function Auctions() {
    const [auctions, setAuctions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('api/Auctions/GetAllActiveAuctions');
                const auctionsData = response.data.$values;

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
            const jewelryId = jewelryGoldId || jewelrySilverId;

            const apiUrl = jewelryGoldId
                ? `/api/JewelryGold/GetById/${jewelryGoldId}`
                : `/api/JewelrySilver/GetById/${jewelrySilverId}`;

            const response = await api.get(apiUrl);
            const imageUrl = response.data?.jewelryImg || 'src/assets/img/jewelry_introduction.jpg';
            return imageUrl;
        } catch (err) {
            console.error('Error fetching auction image:', err);
            return 'src/assets/img/jewelry_introduction.jpg';
        }
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
        return date.toLocaleDateString(); // Returns a string in the current locale's default format (e.g., "6/15/2024" for en-US)
    };

    return (
        <>
            <div className="auctions-content">
                <h1>AUCTIONS</h1>
            </div>
            <div className="auctions-container">
                {displayedAuctions.map((auction) => (
                    <div key={auction.auctionId} className="auction-item">
                        <img
                            src={auction.imageUrl}
                            onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
                            alt="Jewelry"
                        />
                        <p>Date: {formatDate(auction.dateofAuction)}</p>
                        <p>Start Time: {auction.starttime}</p>
                        <p>End Time: {auction.endtime}</p>
                    </div>
                ))}
            </div>
            <div className="navigation-buttons">
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
        </>
    );
}

export default Auctions;
