import React, { useEffect, useRef, useContext } from "react";
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
            {notificationLog.length > 0 &&
                <div class='notification'>
                    {notificationLog.map((notification, key) =>
                        <p key={key}>
                            <strong>{notification.title}</strong>
                            <small>{notification.description && `: ${notification.description}`}</small>
                        </p>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            }
        </div>
    )
}


export default Notification;