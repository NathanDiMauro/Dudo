import React, { useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/socketContext";
import '../styles/notification.css'
import sendIcon from '../images/tanSend.png';

const Notification = () => {
    // const { notificationLog } = useContext(SocketContext);
    const notificationLog = [{ title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }, { title: "tmp", description: "dfhsdfksdf" }]

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(() => {
        scrollToBottom()
    }, [notificationLog]);


    return (
        <div className='notificationContainer'>
            <div className="notification">
                {notificationLog.map((notification, key) =>
                    <p key={key}>
                        <strong>{notification.title}</strong>
                        <small>{notification.description && `: ${notification.description}`}</small>
                    </p>
                )}
            </div>
            <div ref={messagesEndRef} />
            <div className="chatInput">
                <input type="text" />
                <img className="sendImage" src={sendIcon} alt="Send" onClick={() => console.log('click')} />
            </div>
        </div>
    )
}


export default Notification;