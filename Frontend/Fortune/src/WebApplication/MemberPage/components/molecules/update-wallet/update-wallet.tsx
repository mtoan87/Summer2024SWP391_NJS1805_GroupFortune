import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './update-wallet.scss';
import { message } from 'antd';

function UpdateWallet() {
    const [formData, setFormData] = useState({
        accountwalletId: 0,
        bankName: '',
        bankNo: '',
        budget: 0,
    });
    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
    const accountId = loginedUser?.accountId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await api.get(`/AccountWallet/GetAccountWalletByAccountId/${accountId}`);
                setFormData({ ...response.data});
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };

        if (accountId) {
            fetchWallet();
        }
    }, [accountId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await api.put(`/AccountWallet/UpdateAccountWallet?id=${formData.accountwalletId}`, formData); 
            console.log('Wallet updated successfully:', response.data);
            message.success('Update budget successfully');
            navigate('/userWallet');
        } catch (error) {
            console.error('Error updating wallet:', error);
        }
    };

    return (
        <div className="update-my-wallet">
            {formData ? (
                <form onSubmit={handleSubmit}>
                    <h1>Update Wallet</h1>
                    <div className="update-wallet-info">
                        <div className="form-group">
                            <label htmlFor="bankName">Bank Name</label>
                            <input
                                type="text"
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
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
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="budget">Budget</label>
                            <input
                                type="number"
                                id="budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Update Wallet</button>
                </form>
            ) : (
                <p>Loading wallet information...</p>
            )}
        </div>
    );
}

export default UpdateWallet;
