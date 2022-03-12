import { useEffect, useContext } from 'react';
import { SocketContext } from '../../context/socketContext';
import JoinGame from './join';
import HostGame from './host';

const PreGame = () => (
    <div>
        <HostGame />
        <JoinGame />
    </div>
)


export default PreGame;