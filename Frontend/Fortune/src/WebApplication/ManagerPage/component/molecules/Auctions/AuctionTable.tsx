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
    const updateData = {
      accountId: auction.accountId,
      starttime: auction.starttime,
      endtime: auction.endtime,
      status: newStatus,
    };

    let apiUrl = '';

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
      { title: 'Name', dataIndex: 'name', key: 'name',
        render: (text: string, item: any) => (
          <span>
            <span>{text}</span>
            <img
              src={`https://localhost:44361/${item.jewelryImg}`}
              alt={text}
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
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
        })
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

  const getColumnSearchProps = (dataIndex: string, placeholder: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
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
    onFilter: (value: any, record: any) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <span style={{ whiteSpace: 'nowrap' }}>
          {text}
        </span>
      ) : (
        text
      ),
  });

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setFilterDateRange(dateStrings);
  };

  const columns = [
    {
      title: 'Auction ID',
      dataIndex: 'auctionId',
      key: 'auctionId',
      ...getColumnSearchProps('auctionId', 'Search Auction ID'),
    },
    {
      title: 'Account ID',
      dataIndex: 'accountId',
      key: 'accountId',
      ...getColumnSearchProps('accountId', 'Search Account ID'),
    },
    {
      title: 'Jewelry ID',
      dataIndex: 'jewelryId',
      key: 'jewelryId',
      render: (_, record: Auction) =>
        record.jewelryGoldId ?? record.jewelryGolddiaId ?? record.jewelrySilverId ?? 'N/A',
    },
    {
      title: 'Start Date',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: Auction, b: Auction) => new Date(a.starttime).getTime() - new Date(b.starttime).getTime(),
      sortDirections: ['descend', 'ascend'],
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            value={filterDateRange.map((date) => (date ? moment(date) : null))}
            onChange={handleDateRangeChange}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              OK
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        const startDate = moment(record.starttime);
        return startDate.isBetween(moment(filterDateRange[0]), moment(filterDateRange[1]), null, '[]');
      },
    },
    {
      title: 'End Date',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: Auction, b: Auction) => new Date(a.endtime).getTime() - new Date(b.endtime).getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (text: string) => new Date(text).toLocaleTimeString(),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (text: string) => new Date(text).toLocaleTimeString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: Auction) => (
        <Button
          type={record.status === 'Active' ? 'primary' : 'default'}
          onClick={() => handleStatusChange(record)}
        >
          {record.status}
        </Button>
      ),
    },
  ];

  return (
    <div className="auction-table-container">
      <h1>Auctions</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search Email, Name, Auction ID, Account ID"
          allowClear
          enterButton="Search"
          onSearch={(value) => setSearchText(value)}
          style={{ width: 400 }}
        />
        <DatePicker.RangePicker onChange={(dates, dateStrings) => setFilterDateRange([dates[0], dates[1]])} />
      </Space>
      {loading ? (
        <Spin tip="Loading..." />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <Table
          columns={columns}
          dataSource={auctions.filter((auction) =>
            Object.values(auction).some((val) =>
              val ? val.toString().toLowerCase().includes(searchText.toLowerCase()) : false
            )
          )}
          rowKey="auctionId"
          expandable={{ expandedRowRender }}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}

export default AuctionTable;
