import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './tablePayments.scss'; // Import SCSS file

const { Search } = Input;

const TablePayment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPaymentData();
  }, []);

  useEffect(() => {
    // Update filtered data whenever payment data or search text changes
    filterData();
  }, [paymentData, searchText]);

  const fetchPaymentData = async () => {
    try {
      const response = await api.get('api/Payment/GetAllPayments');
      console.log('Fetched data:', response.data);
      const formattedData = response.data.$values.map(payment => {
        // Split datetime into date and time
        const [date, time] = payment.date.split('T');
        return {
          paymentId: payment.paymentId,
          accountId: payment.accountId,
          auctionResultId: payment.auctionResultId,
          status: payment.status,
          paymentmethod: payment.paymentmethod,
          date,
          time,
          price: payment.price,
          totalprice: payment.totalprice,
          fee: payment.fee
        };
      });
      setPaymentData(formattedData);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const filterData = () => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const filtered = paymentData.filter(payment => {
      return (
        payment.paymentId.toString().includes(lowerCaseSearchText) ||
        payment.accountId.toString().includes(lowerCaseSearchText) ||
        payment.auctionResultId.toString().includes(lowerCaseSearchText) ||
        payment.status.toLowerCase().includes(lowerCaseSearchText) ||
        payment.paymentmethod.toLowerCase().includes(lowerCaseSearchText) ||
        payment.date.includes(lowerCaseSearchText) ||
        payment.time.includes(lowerCaseSearchText) ||
        payment.price.toString().includes(lowerCaseSearchText) ||
        payment.totalprice.toString().includes(lowerCaseSearchText) ||
        payment.fee.toString().includes(lowerCaseSearchText)
      );
    });
    setFilteredData(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReload = () => {
    fetchPaymentData();
    setSearchText(''); // Reset search text
  };

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
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
      title: 'Auction Result ID',
      dataIndex: 'auctionResultId',
      key: 'auctionResultId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentmethod',
      key: 'paymentmethod',
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
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      className: 'table-column',
      render: (text) => `${text}$`,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalprice',
      key: 'totalprice',
      align: 'center',
      className: 'table-column',
      render: (text) => `${text}$`,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      align: 'center',
      className: 'table-column',
      render: (text) => `${text}$`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      className: 'table-column',
      render: (text) => {
        let backgroundColor = 'transparent'; // Default background
        let color = 'black'; // Default text color
  
        if (text === 'Successful') {
          backgroundColor = 'green';
          color = 'white'; // White text for better contrast
        } else if (text === 'Failed') {
          backgroundColor = 'red';
          color = 'white'; // White text for better contrast
        }
  
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor,
              color,
              textAlign: 'center', // Center-align text
              width: '100%', // Make sure text is centered in the box
              boxSizing: 'border-box' // Ensure padding is included in width
            }}
          >
            {text}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="table-container">
        <h1>Payment Data</h1>
        <Button onClick={handleReload} className="reload" icon={<ReloadOutlined />} />
        <Search
          placeholder="Search payments..."
          onSearch={handleSearch}
          style={{ marginBottom: 10 }}
          enterButton
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="paymentId"
          pagination={{ pageSize: 15 }}
        />
      </div>
    </>
  );
};

export default TablePayment;
