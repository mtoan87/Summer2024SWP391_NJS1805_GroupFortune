import { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import './auctions.scss';

function MemberAuctions() {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('api/Auctions/GetAllActiveAuctions');
                console.log('API response:', response.data.$values);
                setAuctions(response.data.$values);
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, []);

    return (
        <><div className="auctions-content">
            <h1>Auctions</h1>
        </div>
            <div className="auctions-container">
                {auctions.map((auction) => (
                    <div key={auction.auctionId} className="auction-item">
                        <img src="../../../../../../src/assets/img/jewelry_introduction.jpg" alt="" />
                        <p>Start Time: {auction.starttime}</p>
                        <p>End Time: {auction.endtime}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default MemberAuctions;
