import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/socketContext";
import '../styles/latestBid.css'

const LatestBid = () => {
    const { socket } = useContext(SocketContext);
    const [bid, setBid] = useState(undefined);

    useEffect(() => {
        socket.on('newBid', newBid => {
            setBid(newBid)
        });
    }, [socket])

    return (
        <div id="latestBid">
            {bid &&
                <h4>Current Bid: {bid.bid.amount} {bid.bid.dice}s</h4>
            }
        </div>
    )
}

export default LatestBid;