import { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import './member-auction.scss';

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
                const response = await api.get(`/api/Auctions/GetAuctionAndJewelrySilverByAccountId/${accountId}`);
                console.log('API response:', response.data);
                
                if (response.data && Array.isArray(response.data.$values)) {
                    const auctionsData = response.data.$values;
                    const auctionsWithImages = await Promise.all(
                        auctionsData.map(async (auction) => {
                            const imageUrl = await fetchJewelryImage(auction.jewelryId);
                            return { ...auction, imageUrl };
                        })
                    );
                    setAuctions(auctionsWithImages);
                } else {
                    console.error('Invalid response data format:', response.data);
                }
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
                {auctions.map((auction) => {
    console.log("Auction ID:", auction.auctionId);
    return (
        <div key={auction.auctionId} className="auction-item">
              <img 
              src={`https://localhost:44361/${auction.imageUrl}`} 
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
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
