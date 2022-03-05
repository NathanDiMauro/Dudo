import React, { useState, useEffect } from "react";
import '../styles/notification.css'

const Notification = (props) => {
    const [notification, setNotification] = useState({});

    useEffect(() => {
       props.socket.on('notification', notification => {
          console.log(notification);
          if (notification?.eof) props.setStartRound(true);
          setNotification(notification)
        })
    
      }, [props.socket])

    if (props.show || !notification.title) return null;

    return (
        <div id='notification'>
            <p>{notification.description}</p>
        </div>
    )
}


export default Notification;