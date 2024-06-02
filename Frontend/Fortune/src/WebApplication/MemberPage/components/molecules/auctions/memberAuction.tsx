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

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get<Auction[]>('api/Auctions/GetAllAuctions');
                console.log('API response:', response.data);
                setAuctions(response.data);
            } catch (err) {
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredAuctions = auctions.filter(auction => 
        auction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.starttime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.endtime.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="auctions-content">
                <h1>My Auctions</h1>
                
            </div>
            <div className='searchBar'>
                <div className="fui-input-label-animation ">
      <input type="text" className="form-input" placeholder='' value={searchQuery} 
                    onChange={handleSearchChange}  />
      <label htmlFor="name" className="form-label">Search for Auctions</label>
    </div></div>
            <div className="auctions-container">
                {/* Create Auction Item */}
                <div className="auction-item create-auction">
                    <img src='../../../../../../src/assets/img/Auction.png' alt="" />
                    <button onClick={() => console.log('Create Auction clicked')}>
                        Create Auction
                    </button>
                </div>
                {/* Auction Items */}
                {filteredAuctions.map((auction) => (
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

export default MemberViewAuctions;
