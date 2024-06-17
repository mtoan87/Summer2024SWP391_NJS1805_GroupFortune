import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../styles/payment.scss';

const PaymentForm: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [amount, setAmount] = useState<string>(''); // Sử dụng string để giữ định dạng nhập liệu của người dùng
    const [points, setPoints] = useState<number>(0);

    const handlePaymentMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPaymentMethod(event.target.value);
    };

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/,/g, ''); // Loại bỏ dấu phẩy nếu có
        if (value === '' || !isNaN(Number(value))) {
            setAmount(value);
            calculatePoints(Number(value));
        }
    };

    const handleAmountBlur = () => {
        if (amount) {
            const formattedAmount = Number(amount).toLocaleString();
            setAmount(formattedAmount);
        }
    };

    const calculatePoints = (amount: number) => {
        if (!isNaN(amount)) {
            const points = Math.floor(amount / 1000);
            setPoints(points);
        } else {
            setPoints(0);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Xử lý logic gửi dữ liệu hoặc các thao tác khác tại đây
        console.log('Phương thức thanh toán:', paymentMethod);
        console.log('Số lượng tiền:', amount);
        console.log('Tổng điểm nhận được:', points);
    };

    return (
      
        <form onSubmit={handleSubmit}>
          <h2>PAYMENTS</h2>
            <div>
                <label>Payment methods:</label>
                <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                    <option value="">Choose method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    {/* Thêm các phương thức thanh toán khác nếu cần */}
                </select>
            </div>
            <div>
                <label>Totals Money:</label>
                <div className="input-container">
                    <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        onBlur={handleAmountBlur}
                    />
                    <span> VNĐ</span>
                </div>
            </div>
            <div>
                <label>Total points:</label>
                <div className="input-container">
                    <input
                        type="text"
                        value={points.toLocaleString()}
                        readOnly
                    />
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default PaymentForm;
