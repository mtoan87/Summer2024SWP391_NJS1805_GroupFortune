import React, { useEffect, useState } from 'react';
import type { TableColumnsType } from 'antd';
import { Table } from 'antd';
import api from '../../../../../../config/axios';

interface BidRecord {
  bidRecordId: number;
  accountId: number;
  bidId: number;
  bidAmount: number;
  bidStep: number;
  date: string;
  time: string;
}

interface Bid {
  bidId: number;
  auctionId: number;
  minprice: number;
  maxprice: number;
  datetime: string;
}

interface GroupedBids {
  auctionId: number;
  bids: BidRecord[];
}

const BidHistory: React.FC = () => {
  const [groupedBids, setGroupedBids] = useState<GroupedBids[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBidHistory = async () => {
      const loginedUser = sessionStorage.getItem('loginedUser');

      if (!loginedUser) {
        setError('No logged-in user found.');
        return;
      }

      const user = JSON.parse(loginedUser);
      const accountId = user.accountId;

      try {
        const response = await api.get<{ $id: string, $values: BidRecord[] }>(`api/BidRecord/GetBidRecordByAccountId?AccountId=${accountId}`);
        
        if (response.data && response.data.$values) {
          const bidRecords = response.data.$values;

          const groupedBids = await Promise.all(
            bidRecords.map(async (record) => {
              const bidResponse = await api.get<Bid>(`api/Bid/GetBidByBidId?BidId=${record.bidId}`);
              const auctionId = bidResponse.data.auctionId;
              const [date, time] = formatDateTime(bidResponse.data.datetime);
              return { ...record, auctionId, date, time };
            })
          );

          const groupedByAuction = groupedBids.reduce((acc, bid) => {
            const auction = acc.find((a) => a.auctionId === bid.auctionId);
            if (auction) {
              auction.bids.push(bid);
            } else {
              acc.push({ auctionId: bid.auctionId, bids: [bid] });
            }
            return acc;
          }, [] as GroupedBids[]);

          setGroupedBids(groupedByAuction);
        } else {
          setGroupedBids([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch bid history');
      }
    };

    const formatDateTime = (dateTime: string): [string, string] => {
      const jsDate = new Date(dateTime);
      const date = jsDate.toLocaleDateString();
      const time = jsDate.toLocaleTimeString();
      return [date, time];
    };

    fetchBidHistory();
  }, []);

  const columns: TableColumnsType<BidRecord> = [
    {
      title: 'Bid Record ID',
      dataIndex: 'bidRecordId',
      key: 'bidRecordId'
    },
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId'
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount'
    },
    {
      title: 'Bid Step',
      dataIndex: 'bidStep',
      key: 'bidStep'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
  ];

  return (
    <div>
      <h1>My Bid History</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {groupedBids.map((group) => (
        <div key={group.auctionId}>
          <h2>Auction ID: {group.auctionId}</h2>
          <Table columns={columns} dataSource={group.bids} rowKey="bidRecordId" />
        </div>
      ))}
    </div>
  );
};

export default BidHistory;
