import { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import api from '../../../../../config/axios';
import './my-transaction.scss';

function MyTransaction() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
  const accountId = loginedUser?.accountId;

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await api.get(`/AccountWallet/GetAccountWalletByAccountId/${accountId}`);
        const walletData = response.data;
        setWallet(walletData);
        console.log(walletData);

        const transactionResponse = await api.get(`/api/Transaction/GetTransactionByWalletId`, {
          params: { id: walletData.accountwalletId },
        });
        setTransactions(transactionResponse.data?.$values || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        message.error('Failed to fetch data. Please try again later.');
      }
    };

    if (accountId) {
      fetchWallet();
    }
  }, [accountId]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Time',
      dataIndex: 'dateTime',
      key: 'time',
      render: (text) => new Date(text).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (amount < 0 ? '' : '+') + amount + '$',
    },
  ];

  return (
    <div className="my-transaction-container">
      <h1>My Transactions</h1>
      {error && <p className="error-message">{error}</p>}
      <Table 
        columns={columns} 
        dataSource={transactions} 
        rowKey="transactionId" 
        pagination={false} 
        className="transactions-table" 
      />
    </div>
  );
}

export default MyTransaction;
