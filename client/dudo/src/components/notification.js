import React, { useState, useEffect } from "react";
import '../styles/notification.css'

const Notification = (props) => {
    const [notificationLog, setNotificationLog] = useState([]);

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

    if (props.show || !notification.title) return null;

    return (
        <div id='notification'>
            {notificationLog}
        </div>
    )
}


export default Notification;