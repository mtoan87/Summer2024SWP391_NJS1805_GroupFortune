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
  
    // Check if there is already an active jewelry for this auction
    const activeJewelryExists = auctions.some(a => a.auctionId === auction.auctionId && a.status === 'Active' && a.jewelryDetails);
  
    if (newStatus === 'Active' && activeJewelryExists) {
      message.error('Only one jewelry item can be active for each auction.');
      return;
    }
  
    const updateData = {
      accountId: auction.accountId,
      starttime: auction.starttime,
      endtime: auction.endtime,
      status: newStatus,
    };
  
    if (auction.jewelryGoldId !== null) {
      apiUrl = newStatus === 'Active' ? `/api/Auctions/UpdateGoldAuction?id=${auction.auctionId}` : `/api/Auctions/UpdateGoldAuction?id=${auction.auctionId}`;
      updateData['jewelryGoldId'] = auction.jewelryGoldId;
    } else if (auction.jewelryGolddiaId !== null) {
      apiUrl = newStatus === 'Active' ? `/api/Auctions/UpdateGoldDiamondAuction?id=${auction.auctionId}` : `/api/Auctions/UpdateGoldDiamondAuction?id=${auction.auctionId}`;
      updateData['jewelryGolddiaId'] = auction.jewelryGolddiaId;
    } else if (auction.jewelrySilverId !== null) {
      apiUrl = newStatus === 'Active' ? `/api/Auctions/UpdateSilverAuction?id=${auction.auctionId}` : `/api/Auctions/UpdateSilverAuction?id=${auction.auctionId}`;
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
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <span>{text}</span>
      ) : (
        text
      ),
  });

  const handleDateRangeChange = (dates: [moment.Moment | null, moment.Moment | null]) => {
    setFilterDateRange(dates);
  };

  const getColumnDateRangeProps = () => ({
    filterDropdown: ({ confirm }: any) => (
      <div style={{ padding: 8 }}>
        <DatePicker.RangePicker
          value={filterDateRange}
          onChange={handleDateRangeChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    onFilter: (_: any, record: any) => {
      if (!filterDateRange[0] || !filterDateRange[1]) return true;
      const startTime = moment(record.starttime);
      const endTime = moment(record.endtime);
      return (
        startTime.isSameOrAfter(filterDateRange[0]) && endTime.isSameOrBefore(filterDateRange[1])
      );
    },
  });

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
      dataIndex: 'jewelryDetails',
      key: 'jewelryDetails',
      render: (jewelryDetails: any) => {
        let idText = '';
  
        if (jewelryDetails?.type === 'Silver') {
          idText = jewelryDetails?.jewelrySilverId || '';
        } else if (jewelryDetails?.type === 'GoldDia') {
          idText = jewelryDetails?.jewelryGolddiaId || '';
        } else if (jewelryDetails?.type === 'Gold') {
          idText = jewelryDetails?.jewelryGoldId || '';
        }
  
        return `${jewelryDetails?.type || ''} ID: ${idText} `;
      },
      filters: [
        { text: 'Gold', value: 'Gold' },
        { text: 'GoldDia', value: 'GoldDia' },
        { text: 'Silver', value: 'Silver' },
      ],
      onFilter: (value: string, record: any) => record.jewelryDetails?.type === value,
    },
    {
      title: 'Email',
      dataIndex: 'accountEmail',
      key: 'accountEmail',
      ...getColumnSearchProps('accountEmail', 'Search Email'),
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName',
      ...getColumnSearchProps('accountName', 'Search Name'),
    },
    {
      title: 'Start Date',
      dataIndex: 'starttime',
      key: 'startdate',
      ...getColumnDateRangeProps(),
      render: (starttime: string) => moment(starttime).format('YYYY-MM-DD'),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (starttime: string) => moment(starttime).format('HH:mm:ss'),
    },
    {
      title: 'End Date',
      dataIndex: 'endtime',
      key: 'enddate',
      ...getColumnDateRangeProps(),
      render: (endtime: string) => moment(endtime).format('YYYY-MM-DD'),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (endtime: string) => moment(endtime).format('HH:mm:ss'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: Auction) => {
        const isDisabled = record.jewelryDetails?.shipment !== 'Deliveried' || record.jewelryDetails?.status !== 'Verified';
  
        return (
          <Button
            type={text === 'Active' ? 'primary' : 'default'}
            onClick={() => handleStatusChange(record)}
            disabled={isDisabled}
          >
            {text}
          </Button>
        );
      },
    },
  ];
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Auction Details</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          className="auction-table"
          columns={columns}
          dataSource={auctions}
          rowKey={(record) => record.auctionId}
          expandable={{ expandedRowRender }}
        />
      )}
    </div>
  );
}

export default AuctionTable;
