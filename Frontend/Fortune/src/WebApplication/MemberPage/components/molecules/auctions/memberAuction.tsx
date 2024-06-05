import { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import './auctions.scss';

interface Auction {
    auctionId: number;
    accountId: number | null;
    status: string;
    starttime: string;
    endtime: string;
    jewelryId: number | null;
}

function MemberViewAuctions() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get(`/api/Auctions/GetAuctionAndJewelryByAccountId/${accountId}`);
                console.log('API response:', response.data);
        
                if (response.data && Array.isArray(response.data.$values)) {
                    setAuctions(response.data.$values);
                } else {
                    console.error('Invalid response data format:', response.data);
                }
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };
        
        fetchAuctions();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>
            <div className="auctions-content">
                <h1>My Auctions</h1>
            </div>
            <div className='searchBar'>
                <div className="fui-input-label-animation">
                    <input type="text" className="form-input" placeholder='' value={searchQuery}
                        onChange={handleSearchChange} />
                    <label htmlFor="name" className="form-label">Search for Auctions</label>
                </div>
            </div>
            <div className="auctions-container">
                {/* Create Auction Item */}
                <div className="auction-item create-auction">
                    <img src='../../../../../../src/assets/img/Auction.png' alt="" />
                    <button onClick={() => console.log('Create Auction clicked')}>
                        Create Auction
                    </button>
                </div>
                {auctions.map((auction) => {
    console.log("Auction ID:", auction.auctionId);
    return (
        <div key={auction.auctionId} className="auction-item">
            <img src="../../../../../../src/assets/img/jewelry_introduction.jpg" alt="" />
            <p>Start Time: {auction.starttime}</p>
            <p>End Time: {auction.endtime}</p>
        </div>
    );
})}
            </div>
        </>
    );
};

export default MemberViewAuctions;
