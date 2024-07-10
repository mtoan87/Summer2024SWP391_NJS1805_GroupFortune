import React, { useEffect, useState } from 'react';
import { Table, Button, Spin, message, Input, Space, DatePicker } from 'antd';
import api from '../../../../../config/axios';
import './AuctionsTable.scss';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Auction {
  auctionId: number;
  accountId: number | null;
  jewelryGoldId?: number | null;
  jewelryGolddiaId?: number | null;
  jewelrySilverId?: number | null;
  starttime: string;
  endtime: string;
  status: string;
  accountEmail?: string;
  accountName?: string;
  jewelryDetails?: any;
  shipment?: string;
}

function AuctionTable() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);

  useEffect(() => {
    const fetchAccountDetails = async (accountId: number) => {
      try {
        const response = await api.get(`/Account/GetById/${accountId}`);
        return response.data;
      } catch (err) {
        console.error(`Error fetching account details for accountId ${accountId}:`, err);
        return null;
      }
    };

    const fetchJewelryDetails = async (auction: Auction) => {
      try {
        if (auction.jewelryGoldId) {
          const response = await api.get(`/api/JewelryGold/GetById/${auction.jewelryGoldId}`);
          return { ...response.data, type: 'Gold' };
        } else if (auction.jewelryGolddiaId) {
          const response = await api.get(`/api/JewelryGoldDia/GetById/${auction.jewelryGolddiaId}`);
          return { ...response.data, type: 'GoldDia' };
        } else if (auction.jewelrySilverId) {
          const response = await api.get(`/api/JewelrySilver/GetById/${auction.jewelrySilverId}`);
          return { ...response.data, type: 'Silver' };
        }
        return null;
      } catch (err) {
        console.error('Error fetching jewelry details:', err);
        return null;
      }
    };

    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/Auctions/GetAllAuctions');
        if (response.data && Array.isArray(response.data.$values)) {
          const auctionsWithDetails = await Promise.all(
            response.data.$values.map(async (auction: Auction) => {
              if (auction.accountId) {
                const accountDetails = await fetchAccountDetails(auction.accountId);
                if (accountDetails) {
                  auction.accountEmail = accountDetails.accountEmail;
                  auction.accountName = accountDetails.accountName;
                }
              }
              auction.jewelryDetails = await fetchJewelryDetails(auction);
              return auction;
            })
          );
          console.log("All Auctions:",auctionsWithDetails);
          setAuctions(auctionsWithDetails);
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
    let apiUrl = '';

    const updateData = {
      accountId: auction.accountId,
      starttime: auction.starttime,
      endtime: auction.endtime,
      status: newStatus,
    };

    if (auction.jewelryGoldId !== null) {
      apiUrl = `/api/Auctions/UpdateGoldAuction?id=${auction.auctionId}`;
      updateData['jewelryGoldId'] = auction.jewelryGoldId;
    } else if (auction.jewelryGolddiaId !== null) {
      apiUrl = `/api/Auctions/UpdateGoldDiamondAuction?id=${auction.auctionId}`;
      updateData['jewelryGolddiaId'] = auction.jewelryGolddiaId;
    } else if (auction.jewelrySilverId !== null) {
      apiUrl = `/api/Auctions/UpdateSilverAuction?id=${auction.auctionId}`;
      updateData['jewelrySilverId'] = auction.jewelrySilverId;
    }

    try {
      const response = await api.put(apiUrl, updateData);
      console.log('Status update response:', response.data);

      // Update the local state after successful status change
      setAuctions((prevAuctions) =>
        prevAuctions.map((a) =>
          a.auctionId === auction.auctionId ? { ...a, status: newStatus } : a
        )
      );
      message.success('Auction status updated successfully');
    } catch (err) {
      console.error('Error updating auction status:', err);
      setError('Error updating auction status');
      message.error('Error updating auction status');
    }
  };

  const expandedRowRender = (record: Auction) => {
    const accountColumns = [
      { title: 'Email', dataIndex: 'accountEmail', key: 'accountEmail' },
      { title: 'Name', dataIndex: 'accountName', key: 'accountName' },
    ];

    const jewelryColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, item: any) => (
          <span>
            <span>{text}</span>
            <img
              src={`https://localhost:44361/${item.jewelryImg}`}
              alt={text}
              onError={(e) => {
                e.target.src = 'src/assets/img/jewelry_introduction.jpg';
              }}
              style={{ display: 'none', position: 'absolute', zIndex: 999 }}
            />
          </span>
        ),
        onCell: () => ({
          onMouseEnter: (event: any) => {
            const img = event.currentTarget.querySelector('img');
            if (img) img.style.display = 'block';
          },
          onMouseLeave: (event: any) => {
            const img = event.currentTarget.querySelector('img');
            if (img) img.style.display = 'none';
          },
        }),
      },
      { title: 'Materials', dataIndex: 'materials', key: 'materials' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Shipment', dataIndex: 'shipment', key: 'shipment' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
    ];

    if (record.jewelryDetails?.type === 'Gold') {
      jewelryColumns.push({ title: 'Gold Age', dataIndex: 'goldAge', key: 'goldAge' });
    } else if (record.jewelryDetails?.type === 'Silver') {
      jewelryColumns.push({ title: 'Purity', dataIndex: 'purity', key: 'purity' });
    } else if (record.jewelryDetails?.type === 'GoldDia') {
      jewelryColumns.push(
        { title: 'Gold Age', dataIndex: 'goldAge', key: 'goldAge' },
        { title: 'Carat', dataIndex: 'carat', key: 'carat' },
        { title: 'Clarity', dataIndex: 'clarity', key: 'clarity' }
      );
    }

    const accountData = [
      {
        key: 1,
        accountEmail: record.accountEmail,
        accountName: record.accountName,
      },
    ];

    const jewelryData = [record.jewelryDetails];

    return (
      <div>
        <Table
          columns={accountColumns}
          dataSource={accountData}
          pagination={false}
          title={() => 'Account Details'}
        />
        <Table
          columns={jewelryColumns}
          dataSource={jewelryData}
          pagination={false}
          title={() => 'Jewelry Details'}
          style={{ marginTop: 16 }}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (keys: React.Key[]) => void;
      selectedKeys: React.Key[];
      confirm: () => void;
      clearFilters: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as string}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: string, record: Auction) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  const handleDateRangeChange = (dates: [moment.Moment | null, moment.Moment | null]) => {
    setFilterDateRange(dates);
  };

  const columns = [
    {
      title: 'Auction ID',
      dataIndex: 'auctionId',
      key: 'auctionId',
      sorter: (a: Auction, b: Auction) => a.auctionId - b.auctionId,
      ...getColumnSearchProps('auctionId'),
    },
    {
      title: 'Account ID',
      dataIndex: 'accountId',
      key: 'accountId',
      sorter: (a: Auction, b: Auction) => (a.accountId || 0) - (b.accountId || 0),
      ...getColumnSearchProps('accountId'),
    },
    {
      title: 'Jewelry ID',
      dataIndex: 'jewelryGoldId',
      key: 'jewelryGoldId',
      render: (text: any, record: Auction) =>
        (record.jewelryGoldId ?? record.jewelryGolddiaId ?? record.jewelrySilverId),
      sorter: (a: Auction, b: Auction) =>
        ((a.jewelryGoldId ?? a.jewelryGolddiaId ?? a.jewelrySilverId) || 0) -
        ((b.jewelryGoldId ?? b.jewelryGolddiaId ?? b.jewelrySilverId) || 0),
      ...getColumnSearchProps('jewelryGoldId'),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: Auction, b: Auction) => moment(a.starttime).diff(moment(b.starttime)),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: Auction, b: Auction) => moment(a.endtime).diff(moment(b.endtime)),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'UnActive', value: 'UnActive' },
      ],
      onFilter: (value: string, record: Auction) => record.status.indexOf(value) === 0,
      render: (text: string, record: Auction) => (
        <Button
          type="primary"
          onClick={() => handleStatusChange(record)}
          disabled={isJewelryIdActive(record)}
        >
          {text === 'Active' ? 'Set UnActive' : 'Set Active'}
        </Button>
      ),
    },
  ];

  const isJewelryIdActive = (auction: Auction) => {
    const jewelryId = auction.jewelryGoldId ?? auction.jewelryGolddiaId ?? auction.jewelrySilverId;
    return auctions.some(
      (a) =>
        ((a.jewelryGoldId === jewelryId ||
          a.jewelryGolddiaId === jewelryId ||
          a.jewelrySilverId === jewelryId) &&
        a.status === 'Active' &&
        a.auctionId !== auction.auctionId)
    );
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={auctions}
          rowKey="auctionId"
          expandedRowRender={expandedRowRender}
          pagination={{ pageSize: 10 }}
          className="auction-table"
        />
      )}
    </div>
  );
}

export default AuctionTable;
