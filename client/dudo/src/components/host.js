import React, {useState, useEffect } from 'react';
import '../styles/join.css'

const HostGame = (props) => {

    const [host, setHost] = useState(false);

    
    //when room or name changes add players to socket
    useEffect(() => {
        if (props.name && props.room && host == true){
            console.log('trying to create room', props.room)

            console.log('trying to join', props.name, "to room", props.room)

            props.socket.emit('createRoom', {name: props.name, roomCode: props.room}, error => {
                if (error) {
                    console.log(error);
                    alert(error);
                    props.setName(null);
                    props.setRoom(null);
                    props.setShow(true);
                } else {
                    console.log(props.name, props.room, props.socket)
                }
            })
            setHost(false);
        }
    }, [props.name])

    const addRoom = () => {
        setHost(true);
        props.setName(document.getElementById("nameInput").value);
        props.setRoom(Math.floor(Math.random() * 9999));
        props.setShow(false);
    }

    if (props.show == false){
        return false;
    }
    
    return (
        <div id="join">
            <h2>Host Game</h2>
            <div id="jInput">
                <h4>Name:</h4>
                <input type="text" id="nameInput"></input>
                <button onClick={addRoom}>Host</button>
                <br />
            </div>
        </div>
    );
}

export default HostGame;