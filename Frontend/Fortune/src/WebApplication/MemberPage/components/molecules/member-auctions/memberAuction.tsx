import React, { useState, useEffect } from 'react';
import api from '../../../../../config/axios';
import './member-auction.scss';

interface Auction {
    auctionId: number;
    accountId: number | null;
    status: string;
    starttime: string;
    endtime: string;
    jewelrySilverId?: number | null;
    jewelryGoldId?: number | null;
    jewelryGolddiaId?: number | null;
    imageUrl?: string;
    jewelryName?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
}

interface Jewelry {
    jewelryImg: string;
    name: string;
}

function MemberViewAuctions() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
    const accountId = loginedUser?.accountId;

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const [goldResponse, silverResponse, goldDiaResponse] = await Promise.all([
                    api.get(`/api/Auctions/GetAuctionAndJewelryGoldByAccountId/${accountId}`),
                    api.get(`/api/Auctions/GetAuctionAndJewelrySilverByAccountId/${accountId}`),
                    api.get(`/api/Auctions/GetAuctionAndJewelryGoldDiamondByAccountId/${accountId}`)
                ]);

                const auctionsData: Auction[] = [];

                if (goldResponse.data.$values.length > 0) {
                    auctionsData.push(...goldResponse.data.$values);
                }
                if (silverResponse.data.$values.length > 0) {
                    auctionsData.push(...silverResponse.data.$values);
                }
                if (goldDiaResponse.data.$values.length > 0) {
                    auctionsData.push(...goldDiaResponse.data.$values);
                }

                const auctionsWithDetails = auctionsData.map(auction => {
                    let jewelryDetails: Jewelry = { jewelryImg: 'src/assets/img/jewelry_introduction.jpg', name: 'Unknown Jewelry' };

                    if (auction.jewelrySilver) {
                        jewelryDetails = {
                            jewelryImg: auction.jewelrySilver.jewelryImg || 'src/assets/img/jewelry_introduction.jpg',
                            name: auction.jewelrySilver.name || 'Unknown Jewelry'
                        };
                    } else if (auction.jewelryGold) {
                        jewelryDetails = {
                            jewelryImg: auction.jewelryGold.jewelryImg || 'src/assets/img/jewelry_introduction.jpg',
                            name: auction.jewelryGold.name || 'Unknown Jewelry'
                        };
                    } else if (auction.jewelryGolddia) {
                        jewelryDetails = {
                            jewelryImg: auction.jewelryGolddia.jewelryImg || 'src/assets/img/jewelry_introduction.jpg',
                            name: auction.jewelryGolddia.name || 'Unknown Jewelry'
                        };
                    }

                    const startDateTime = new Date(auction.starttime);
                    const endDateTime = new Date(auction.endtime);

                    const formattedAuction = {
                        ...auction,
                        imageUrl: jewelryDetails.jewelryImg,
                        jewelryName: jewelryDetails.name,
                        startDate: startDateTime.toLocaleDateString(),
                        startTime: startDateTime.toLocaleTimeString(),
                        endDate: endDateTime.toLocaleDateString(),
                        endTime: endDateTime.toLocaleTimeString(),
                    };

                    return formattedAuction;
                });

                setAuctions(auctionsWithDetails);
            } catch (err) {
                console.error('Error fetching auctions:', err);
                setError('Failed to fetch auctions. Please try again later.');
            }
        };

        fetchAuctions();
    }, [accountId]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredAuctions = auctions.filter(auction =>
        auction.jewelryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="auctions-content">
                <h1>My Auctions</h1>
            </div>
            <div className="searchBar">
                <div className="fui-input-label-animation">
                    <input type="text" className="form-input" placeholder="" value={searchQuery} onChange={handleSearchChange} />
                    <label htmlFor="name" className="form-label">Search for Auctions</label>
                </div>
            </div>
            <div className="auctions-container">
                {error ? (
                    <p>{error}</p>
                ) : (
                    filteredAuctions.map((auction) => (
                        <div key={auction.auctionId} className="auction-item">
                            <img
                                src={`https://localhost:44361/${auction.imageUrl}`}
                                alt={auction.jewelryName}
                                onError={(e) => { e.currentTarget.src = 'src/assets/img/jewelry_introduction.jpg'; }}
                            />
                            <p>Start Date: {auction.startDate}</p>
                            <p>Start Time: {auction.startTime}</p>
                            <p>End Time: {auction.endTime}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default MemberViewAuctions;
