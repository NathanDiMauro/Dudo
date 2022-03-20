import { useEffect, useContext } from 'react';
import { SocketContext } from '../../context/socketContext';
import JoinGame from './join';
import HostGame from './host';
import '../../styles/join.css';

const PreGame = () => (
    <div className="preGame">
        <HostGame />
        <hr />
        <JoinGame />
    </div>
)


export default PreGame;