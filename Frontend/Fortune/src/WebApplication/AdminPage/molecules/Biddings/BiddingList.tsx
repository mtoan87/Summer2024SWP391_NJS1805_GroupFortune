import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './tableBiddings.scss'; // Import SCSS file

const { Search } = Input;

const TableBiddings = () => {
  const [bidData, setBidData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchBidData();
  }, []);

  useEffect(() => {
    filterData();
  }, [bidData, searchText]);

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

  const filterData = () => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const filtered = bidData.filter(bid => {
      return (
        bid.bidId.toString().includes(lowerCaseSearchText) ||
        bid.auctionId.toString().includes(lowerCaseSearchText) ||
        bid.minprice.toString().includes(lowerCaseSearchText) ||
        bid.maxprice.toString().includes(lowerCaseSearchText) ||
        bid.date.includes(lowerCaseSearchText) ||
        bid.time.includes(lowerCaseSearchText)
      );
    });
    setFilteredData(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReload = () => {
    fetchBidData();
    setSearchText(''); // Reset search text
  };

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
        <Search
          placeholder="Search bids..."
          onSearch={handleSearch}
          style={{ marginBottom: 10 }}
          enterButton
        />
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
