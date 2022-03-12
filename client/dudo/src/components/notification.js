import React, { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/socketContext";
import '../styles/notification.css'

const Notification = () => {
    const { notificationLog } = useContext(SocketContext);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(() => {
        scrollToBottom()
    }, [notificationLog]);


    return (
        <div>
            {notificationLog &&
                <div id='notification'>
                    {notificationLog.map((notification, key) => <p key={key}>{notification.title}: {notification.description}</p>)}
                    <div ref={messagesEndRef} />
                </div>
            }
        </div>
    )
}


export default Notification;