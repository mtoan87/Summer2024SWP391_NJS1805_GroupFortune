import { useState } from 'react';
import api from '../../../../../config/axios';
import './account-wallet.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function AccountWallet() {
    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [formData, setFormData] = useState({
        accountId: loginedUser?.accountId || 0,
        bankName: '',
        bankNo: '',
        budget: 0,
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
        try {
            const response = await api.post('/AccountWallet/CreateAccountWallet', formData);
            console.log('Account wallet created successfully:', response.data);
            toast.success('Account wallet created successfully!', { position: 'top-right' });

            navigate('/');
        } catch (error) {
            console.error('Error creating account wallet:', error);
            toast.error('Error creating account wallet. Please try again!', { position: 'top-right' });
        }
    };

    return (
        <>

            <form onSubmit={handleSubmit} className="wallet-form">
                {/* <h1>My Wallet</h1> */}
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
                <button type="submit">Submit</button>
            </form>
            <ToastContainer />
        </>
    );
}

export default AccountWallet;
