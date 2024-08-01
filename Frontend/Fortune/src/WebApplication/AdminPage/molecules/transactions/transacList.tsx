import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './tableTransact.scss'; // Import SCSS file

const { Search } = Input;

const TableTransact = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTransactionData();
  }, []);

  useEffect(() => {
    // Update filteredData when transactionData or searchText changes
    filterData();
  }, [transactionData, searchText]);

  const fetchTransactionData = async () => {
    try {
      const response = await api.get('api/Transaction/GetAllTransactions');
      console.log('Fetched data:', response.data);
      const formattedData = response.data.$values.map(transaction => {
        // Split datetime into date and time
        const [date, time] = transaction.dateTime.split('T');
        return {
          transactionId: transaction.transactionId,
          accountwalletId: transaction.accountwalletId,
          amount: transaction.amount,
          date,
          time
        };
      });
      setTransactionData(formattedData);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  const filterData = () => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const filtered = transactionData.filter(transaction => {
      return (
        transaction.transactionId.toString().includes(lowerCaseSearchText) ||
        transaction.accountwalletId.toString().includes(lowerCaseSearchText) ||
        transaction.amount.toString().includes(lowerCaseSearchText) 
      );
    });
    setFilteredData(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReload = () => {
    fetchTransactionData();
    setSearchText(''); // Reset search text
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Account Wallet ID',
      dataIndex: 'accountwalletId',
      key: 'accountwalletId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      className: 'table-column',
      render: (text) => `${text}$`,
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
        <h1>Transaction Data</h1>
        <Button onClick={handleReload} className="reload" icon={<ReloadOutlined />} />
        <Search
          placeholder="Search transactions..."
          onSearch={handleSearch}
          style={{ marginBottom: 10 }}
          enterButton
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="transactionId"
          pagination={{ pageSize: 15 }}
        />
      </div>
    </>
  );
};

export default TableTransact;
