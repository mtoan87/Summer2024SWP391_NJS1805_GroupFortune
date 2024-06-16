import { useEffect, useState } from 'react';
import api from '../../../config/axios';
import '../styles/auctions.scss';
import { useNavigate } from 'react-router-dom';
function Auctions() {
    const [auctions, setAuctions] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('api/Auctions/GetAllActiveAuctions');
                const auctionsData = response.data.$values;
                console.log('API response:', response.data.$values);
                console.log(auctionsData);

                const auctionsWithImages = await Promise.all(
                    auctionsData.map(async (auction) => {
                        const imageUrl = await fetchJewelryImage(auction.jewelryId);
                        return { ...auction, imageUrl };
                    })
                );
                console.log(auctionsWithImages);
                setAuctions(auctionsWithImages);
                console.log(auctions);
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, []);
    const fetchJewelryImage = async (jewelryId) => {
        try {
            const response = await api.get(`api/Jewelries/GetById/${jewelryId}`);
            return response.data.jewelryImg; // Assuming imageUrl is the property containing the image URL
        } catch (err) {
            console.error('Error fetching jewelry image:', err);
            return null;
        }
    };
    return (
        <><div className="auctions-content">
            <h1>Auctions</h1>
        </div>
            <div className="auctions-container">
                {auctions.map((auction) => (
                    <div key={auction.auctionId} className="auction-item">
                         <img 
              src={`https://localhost:44361/${auction.imageUrl}`} 
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
                        <p>Start Time: {auction.starttime}</p>
                        <p>End Time: {auction.endtime}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Auctions;
