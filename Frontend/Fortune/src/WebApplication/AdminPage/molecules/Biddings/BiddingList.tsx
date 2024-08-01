import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Button, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './tableBiddings.scss'; // Import SCSS file

const { Text } = Typography;
const { Search } = Input;

const TableBiddings = () => {
  const [bidData, setBidData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchBidData();
  }, []);

  const fetchBidData = async () => {
    try {
      const response = await api.get('api/Bid/GetAllBids');
      console.log('Fetched data:', response.data);
      const formattedData = response.data.$values.map(bid => {
        // Split datetime into date and time
        const [date, time] = bid.datetime.split('T');
        return {
          bidId: bid.bidId,
          auctionId: bid.auctionId,
          minprice: bid.minprice,
          maxprice: bid.maxprice,
          date,
          time,
        };
      });
      setBidData(formattedData);
    } catch (error) {
      console.error('Error fetching bid data:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReload = () => {
    fetchBidData();
    setSearchText(''); // Reset search text
  };

  const filteredData = bidData.filter(bid => {
    return (
      bid.bidId.toString().includes(searchText) ||
      bid.auctionId.toString().includes(searchText) ||
      bid.minprice.toString().includes(searchText) ||
      bid.maxprice.toString().includes(searchText) ||
      bid.date.includes(searchText) ||
      bid.time.includes(searchText)
    );
  });

  const columns = [
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Auction ID',
      dataIndex: 'auctionId',
      key: 'auctionId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Min Price',
      dataIndex: 'minprice',
      key: 'minprice',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Max Price',
      dataIndex: 'maxprice',
      key: 'maxprice',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      className: 'table-column',
    },
  ];

  return (
    <>
      <div className="table-container">
        <h1>Bid Data</h1>
        <Button onClick={handleReload} className="reload" icon={<ReloadOutlined />} />
        <Search placeholder="Search bids..." onSearch={handleSearch} style={{ marginBottom: 10 }} className="search-bar" />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="bidId"
          pagination={{ pageSize: 15 }}
        />
      </div>
    </>
  );
};

export default TableBiddings;
