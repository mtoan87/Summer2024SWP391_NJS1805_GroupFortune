import { useState, useEffect } from 'react';
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
      }
    };

    if (accountId) {
      fetchWallet();
    }
  }, [accountId]);

  return (
    <div className="my-transaction-container">
      <h1>My Transactions</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p>No transactions found for this wallet.</p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.transactionId} className="transaction-item">
              <p>Date: {new Date(transaction.dateTime).toLocaleDateString()}</p>
              <p>Time: {new Date(transaction.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Amount: {transaction.amount}$</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTransaction;
