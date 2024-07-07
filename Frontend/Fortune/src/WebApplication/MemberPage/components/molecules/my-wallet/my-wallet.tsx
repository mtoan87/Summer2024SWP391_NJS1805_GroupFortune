import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios'; // Import your axios configuration
import './my-wallet.scss';

function MyWallet() {
    const [walletInfo, setWalletInfo] = useState(null);
    const accountId = JSON.parse(sessionStorage.getItem('loginedUser'))?.accountId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await api.get(`/AccountWallet/GetAccountWalletByAccountId/${accountId}`);
                setWalletInfo(response.data);
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };

        if (accountId) {
            fetchWallet();
        }
    }, [accountId]);

    const handleUpdateWallet = () => {
        navigate('/update-wallet')
    };

    return (
        <div className="my-wallet">
            {walletInfo ? (
                <>
                    <h1>My Wallet</h1>
                    <div className="wallet-info">
                        <p>Bank Name: {walletInfo.bankName}</p>
                        <p>Bank Number: {walletInfo.bankNo}</p>
                        <p>Budget: {walletInfo.budget}</p>
                    </div>
                    <button onClick={handleUpdateWallet}>Update Wallet</button>
                </>
            ) : (
                <p>Loading wallet information...</p>
            )}
        </div>
    );
}

export default MyWallet;
