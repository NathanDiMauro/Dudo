import React, { useEffect, useRef, useContext, useState } from "react";
import { SocketContext } from "../context/socketContext";
import '../styles/notification.css'
import sendIcon from '../images/tanSend.png';

const Notification = () => {
    const { notificationLog, socket } = useContext(SocketContext);
    const messagesEndRef = useRef(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        scrollToBottom()
    }, [notificationLog]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    const sendMessage = () => {
        if (message === "") return;
        socket.emit("sendMessage", { message: message }, error => {
            if (error) {
                console.log(error);
            } else {
                setMessage("");
            }
        })
    }


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
                <input
                    type="text" value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.code === "Enter" && sendMessage()} />
                <img className="sendImage" src={sendIcon} alt="Send" onClick={sendMessage} />
            </div>
        </div>
    )
}


export default Notification;