import { ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import '../Styles/bidding.scss';

function BiddingForm() {
    
    return (
        <>
            <div className="bidding-form">
                <h2>Auction</h2>
                <div className="infor-auction">
                    <ul>
                        <li><ClockCircleOutlined /> <strong>Start-Time:</strong></li>
                        <li><ClockCircleOutlined /> <strong>End-Time:</strong></li>
                        <li><ClockCircleOutlined /> <strong>Time:</strong></li>
                    </ul>
                </div>
                <div className="infor-price">
                    <ul>
                        <li><DollarCircleOutlined /> <strong>Starting Price:</strong></li>
                        <li><DollarCircleOutlined /> <strong>Highest Price:</strong></li>
                        <li><DollarCircleOutlined /> <strong>Closing Price:</strong></li>
                    </ul>
                </div>
                <div className="infor-bidding">
                    <ul>
                        <li><strong>Fill Your Price to Bidding!</strong></li>
                        <li>
                            <input type="number" placeholder="Price" />
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
