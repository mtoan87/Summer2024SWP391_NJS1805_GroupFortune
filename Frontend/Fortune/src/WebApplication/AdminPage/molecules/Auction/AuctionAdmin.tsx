import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Button, Input } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './TableAuctionAdmin.scss'; // Import SCSS file

const { Text } = Typography;
const { Search } = Input;

const TableAuctionAdmin = () => {
  const [auctionData, setAuctionData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchAuctionData();
  }, []);

  const fetchAuctionData = async () => {
    try {
      const response = await api.get('api/Auctions/GetAllAuctions');
      console.log('Fetched data:', response.data);
      const formattedData = response.data.$values.map(auction => ({
        auctionId: auction.auctionId,
        accountId: auction.accountId,
        jewelryId: auction.jewelrySilverId 
          ? `SilverId: ${auction.jewelrySilverId}`
          : auction.jewelryGoldId 
          ? `GoldId: ${auction.jewelryGoldId}`
          : `GoldDiaId: ${auction.jewelryGolddiaId}`,
        starttime: new Date(auction.starttime).toLocaleTimeString(),
        endtime: new Date(auction.endtime).toLocaleTimeString(),
        startdate: new Date(auction.starttime).toLocaleDateString(),
        enddate: new Date(auction.endtime).toLocaleDateString(),
        status: auction.status,
      }));
      console.log(formattedData);
      setAuctionData(formattedData);
      
    } catch (error) {
      console.error('Error fetching auction data:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReload = () => {
    fetchAuctionData();
    setSearchText(''); // Reset search text
  };

  const filteredData = auctionData.filter(auction => {
    return (
      auction.auctionId.toString().includes(searchText) ||
      auction.accountId.toString().includes(searchText) ||
      auction.jewelryId.toLowerCase().includes(searchText.toLowerCase()) ||
      auction.status.toLowerCase().includes(searchText.toLowerCase()) ||
      auction.startdate.includes(searchText) ||
      auction.enddate.includes(searchText)
    );
  });

  const columns = [
    {
      title: 'Auction ID',
      dataIndex: 'auctionId',
      key: 'auctionId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Account ID',
      dataIndex: 'accountId',
      key: 'accountId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Jewelry ID',
      dataIndex: 'jewelryId',
      key: 'jewelryId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      className: 'table-column',
      render: (_, record) => <Text className="table-text">{record.startdate} - {record.enddate}</Text>,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      className: 'table-column',
      render: (_, record) => <Text className="table-text">{record.starttime} - {record.endtime}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      className: 'table-column',
    },
  ];

  return (
    <>
      <div className="table-container">
        <h1>Auctions</h1>
        <Button onClick={handleReload} className="reload" icon={<ReloadOutlined />} />
        <Search
          placeholder="Search auctions..."
          onSearch={handleSearch}
          style={{ marginBottom: 10 }}
          className="search-bar"
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="auctionId"
          pagination={{ pageSize: 15 }}
        />
      </div>
    </>
  );
};

export default TableAuctionAdmin;
