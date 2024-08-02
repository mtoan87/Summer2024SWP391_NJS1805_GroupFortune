import { useState } from 'react';
import api from '../../../../../config/axios';
import './account-wallet.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

function AccountWallet() {
    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
    const navigate = useNavigate();

    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const pathName = parsedUrl.pathname;
    const endpointAndId = pathName.substring(pathName.indexOf('/', 1));

    const [formData, setFormData] = useState({
        accountId: loginedUser?.accountId || 0,
        bankName: '',
        bankNo: 0,
        amount: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.amount < 0) {
            message.error('Amount cannot be negative.');
            return;
        } else if (formData.bankNo < 0) {
            message.error('Bank number cannot be negative.');
            return;
        }
        try {
            const response = await api.post('/AccountWallet/CreateAccountWallet', formData);
            console.log('Account wallet created successfully:', response.data);
            message.success('Account wallet created successfully!');

            navigate('/userWallet', { state: { message: 'Account wallet created successfully!' } });
        } catch (error) {
            console.error('Error creating account wallet:', error);
            message.error('Error creating account wallet. Please try again!');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="wallet-form">
                <h1>Register Wallet</h1>
                <div className="form-group">
                    <label htmlFor="bankName">Bank Name</label>
                    <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bankNo">Bank Number</label>
                    <input
                        type="number"
                        id="bankNo"
                        name="bankNo"
                        value={formData.bankNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default AccountWallet;
