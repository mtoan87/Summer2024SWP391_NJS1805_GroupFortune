import React from "react";
import { Helmet } from "react-helmet"; // Ensure this import matches your Helmet package
import MyBidding from "../../molecules/biddings/my-bids";

function BiddingTmp() {
    return (
        <>
            <Helmet>
                <meta httpEquiv="refresh" content="5" />
            </Helmet>
            <div>
                <MyBidding />
            </div>
        </>
    );
}

export default BiddingTmp;