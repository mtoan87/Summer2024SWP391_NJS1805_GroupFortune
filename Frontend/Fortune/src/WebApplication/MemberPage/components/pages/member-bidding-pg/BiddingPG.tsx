import BiddingTmp from "../../template/member-bidding/biddingtmp";
import { Helmet } from 'react-helmet';

function BiddingPG() {
    return (
        <div>
            <Helmet>
                <meta http-equiv="refresh" content="10" />
            </Helmet>
            <BiddingTmp />
        </div>
    )
}
export default BiddingPG