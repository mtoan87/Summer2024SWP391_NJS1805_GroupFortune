import React from "react";
import '../Styles/bidding.scss';  // Đảm bảo rằng bạn đã import đúng tệp CSS

function BiddingForm() {
    return (
        <>
            <div className="bidding-form">
                <h2>Auction</h2>
                <div className="infor-auction">
                    <ul>
                        <li><strong>Start-Time:</strong> 10:00 AM</li>
                        <li><strong>End-Time:</strong> 2:00 PM</li>
                        <li><strong>Time:</strong></li>
                    </ul>
                </div>
                <div className="infor-price">
                    <ul>
                        <li><strong>Giá Khởi điểm:</strong> $1000</li>
                        <li><strong>Giá Cao Nhất:</strong> $5000</li>
                        <li><strong>Giá Chốt:</strong> $4500</li>
                    </ul>
                </div>
                <div className="infor-bidding">
                    <ul>
                        <li><strong>Nhập Giá bạn muốn đấu giá:</strong></li>
                        <li>
                            <input type="number" placeholder="Enter your bid" />
                        </li>
                        <li>
                            <button>Send</button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default BiddingForm;
