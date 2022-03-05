import React, { useState, useEffect, useRef } from "react";
import '../styles/notification.css'

const Notification = (props) => {
    const [notificationLog, setNotificationLog] = useState([]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(() => {
        scrollToBottom()
    }, [notificationLog]);

    useEffect(() => {
       props.socket.on('notification', notification => {
            console.log(notification);

            if (notification?.eof) props.setStartRound(true);

            let notificationLogBuilder = notificationLog;

            notificationLogBuilder.push(notification)

            const notificationLogComponentBuilder = notificationLogBuilder.map((notification) =>
                <p>{notification.title}: {notification.description}</p>);

            setNotificationLog(notificationLogComponentBuilder)
        })
    }, [props.socket])

    if (props.show || !notificationLog[0]) return null;

    return (
        <div>
            <div id='notification'>
                {notificationLog}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}


export default Notification;