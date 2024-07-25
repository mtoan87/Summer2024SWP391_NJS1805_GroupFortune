import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
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
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

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

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof BidRecord,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof BidRecord): TableColumnType<BidRecord> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<BidRecord> = [
    {
      title: 'Bid Record ID',
      dataIndex: 'bidRecordId',
      key: 'bidRecordId',
      ...getColumnSearchProps('bidRecordId'),
    },
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId',
      ...getColumnSearchProps('bidId'),
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      ...getColumnSearchProps('bidAmount'),
    },
    {
      title: 'Bid Step',
      dataIndex: 'bidStep',
      key: 'bidStep',
      ...getColumnSearchProps('bidStep'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      ...getColumnSearchProps('time'),
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
