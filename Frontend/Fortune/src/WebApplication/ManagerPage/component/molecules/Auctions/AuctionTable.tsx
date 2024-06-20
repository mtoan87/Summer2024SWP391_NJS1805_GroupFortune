import React, { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import './AuctionsTable.scss';

interface Auction {
  auctionId: number;
  accountId: number | null;
  jewelryGoldId?: number | null;
  jewelryGolddiaId?: number | null;
  jewelrySilverId?: number | null;
  starttime: string;
  endtime: string;
  status: string;
}

function AuctionTable() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
  const accountId = loginedUser?.accountId;

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/Auctions/GetAllAuctions');
        console.log('API response:', response.data);
        if (response.data && Array.isArray(response.data.$values)) {
          setAuctions(response.data.$values);
        } else {
          console.error('Invalid response data format:', response.data);
          setError('Invalid response data format');
        }
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Error fetching auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleStatusChange = async (auction: Auction) => {
    const newStatus = auction.status === 'Active' ? 'UnActive' : 'Active';
    try {
      const response = await api.put(`/api/Auctions/UpdateAuction?id=${auction.auctionId}`, {
        accountId: auction.accountId,
        jewelryGoldId: auction.jewelryGoldId,
        jewelryGolddiaId: auction.jewelryGolddiaId,
        jewelrySilverId: auction.jewelrySilverId,
        starttime: auction.starttime,
        endtime: auction.endtime,
        status: newStatus
      });
      console.log('Status update response:', response.data);

      // Update the local state after successful status change
      setAuctions((prevAuctions) =>
        prevAuctions.map((a) =>
          a.auctionId === auction.auctionId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error('Error updating auction status:', err);
      setError('Error updating auction status');
    }
  };

  return (
    <div className="auction-table-container">
      <h1>Auctions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="auction-table">
          <thead>
            <tr>
              <th>Auction ID</th>
              <th>Account ID</th>
              <th>Jewelry ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.auctionId}>
                <td>{auction.auctionId}</td>
                <td>{auction.accountId}</td>
                <td>{auction.jewelryGoldId ?? auction.jewelryGolddiaId ?? auction.jewelrySilverId ?? 'N/A'}</td>
                <td>{new Date(auction.starttime).toLocaleString()}</td>
                <td>{new Date(auction.endtime).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleStatusChange(auction)}
                    className={`status-button ${auction.status.toLowerCase()} ${auction.status === 'Active' ? 'flip-to-inactive' : 'flip-to-active'}`}
                    onAnimationEnd={(e) => e.currentTarget.classList.remove('flip-to-active', 'flip-to-inactive')}
                  >
                    {auction.status === 'Active' ? 'Active' : 'UnActive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AuctionTable;
