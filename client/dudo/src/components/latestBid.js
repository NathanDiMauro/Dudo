import React, { useState, useEffect } from "react";
import '../styles/latestBid.css'

const LatestBid = (props) => {
    const [bid, setBid] = useState();

    useEffect(() => {
        const handleNewBid = (newBid) => {
            setBid(newBid);
        }

        props.socket.on('newBid', handleNewBid);
    }, [props.socket])

    if (props.show || !bid) return null;

    return (
        <div id="latestBid">
            <h4>Current Bid: {bid.bid.amount} {bid.bid.dice}s</h4>
        </div>
    )
}

export default LatestBid;