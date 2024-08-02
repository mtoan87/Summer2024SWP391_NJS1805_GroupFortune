import { useState, useEffect } from 'react';
import api from '../../../../../config/axios';
import './member-auction.scss';
import { message } from 'antd';

function MemberViewAuctions() {
    const [auctions, setAuctions] = useState<any[]>([]);
    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
    const accountId = loginedUser?.accountId;

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get(`/api/Auctions/GetByAccountId/${accountId}`);
                const auctionsData = response.data.$values;

                // Fetch the jewelry images for each auction
                const auctionsWithImages = await Promise.all(
                    auctionsData.map(async (auction) => {
                        const imageUrl = await fetchJewelryImages(auction);
                        return { ...auction, imageUrl };
                    })
                );
                setAuctions(auctionsWithImages);
            } catch (err) {
                console.error('Error fetching auctions:', err);
                message.error('Failed to fetch auctions. Please try again later.');
            }
        };

        fetchAuctions();
    }, [accountId]);

    const fetchJewelryImages = async (auction) => {
        try {
            const { jewelryGoldId, jewelrySilverId, jewelryGolddiaId } = auction;
            let apiURL;

            if (jewelryGoldId) {
                apiURL = `/api/JewelryGold/GetById/${jewelryGoldId}`;
            } else if (jewelrySilverId) {
                apiURL = `/api/JewelrySilver/GetById/${jewelrySilverId}`;
            } else if (jewelryGolddiaId) {
                apiURL = `/api/JewelryGoldDia/GetById/${jewelryGolddiaId}`;
            }

            if (apiURL) {
                const response = await api.get(apiURL);
                const imageUrl = response.data?.jewelryImg || 'src/assets/img/jewelry_introduction.jpg';
                return imageUrl;
            }
        } catch (err) {
            console.error('Error fetching jewelry:', err);
            message.error('Failed to fetch jewelry. Please try again later.');
        }
    };

    const renderDateFromData = (data: string) => {
        const date = new Date(data);
        return date.toLocaleDateString();
    };

    const renderTimeFromData = (data: string) => {
        const date = new Date(data);
        return date.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="auctions-content">
                <h1>My Auctions</h1>
            </div>
            <div className="auctions-container">
                {auctions.length > 0 ? (
                    auctions.map((auction) => (
                        <div key={auction.auctionId} className="auction-item">
                            <img
                                src={`https://localhost:44361/${auction.imageUrl}`}
                                alt="Jewelry Img"
                                onError={(e) => { e.currentTarget.src = 'src/assets/img/jewelry_introduction.jpg'; }}
                            />
                            <p>Start Date: {renderDateFromData(auction.starttime)}</p>
                            <p>Start Time: {renderTimeFromData(auction.starttime)}</p>
                            <p>End Time: {renderTimeFromData(auction.endtime)}</p>
                        </div>
                    ))
                ) : (
                    <p>No Auctions here</p>
                )}
            </div>
        </>
    );
}

export default MemberViewAuctions;
