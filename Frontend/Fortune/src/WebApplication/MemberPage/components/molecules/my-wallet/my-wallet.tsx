import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios'; // Import your axios configuration
import './my-wallet.scss';

function MyWallet() {
    const [walletInfo, setWalletInfo] = useState(null);
    const accountId = JSON.parse(sessionStorage.getItem('loginedUser'))?.accountId;
    const navigate = useNavigate();
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const pathName = parsedUrl.pathname;
    const parts = pathName.split('/');
    const endpoint = parts[1];
    const UrlID = parts[2];

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

    const handleChargeWallet = () => {
        navigate('/update-wallet')
    };
    const handleRegisterWallet = () => {
        navigate(`/register-wallet/${endpoint}/${UrlID}`)
    };

    const handleWithdrawWallet = () => {
        navigate('/withdraw-wallet')
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
                    <div className="action-button">
                        <button onClick={handleChargeWallet}>Charge</button>
                        <button onClick={handleWithdrawWallet}>Withdraw</button>
                    </div>
                </>
            ) : (
                <>
                    <p>You have not register wallet yet</p>
                    <button className='register-wallet-button' onClick={handleRegisterWallet}>Register Wallet</button>
                </>
            )}
        </div>
    );
}

export default MyWallet;
