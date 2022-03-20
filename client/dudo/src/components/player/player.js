import React, { useState, useEffect, useContext } from 'react';
import '../../styles/player.css'
import PlayerActions from './playerActions';
import LatestBid from './latestBid';
import Hand from './hand'


const Player = () =>  (
        <div className="player">
            <Hand />
            <PlayerActions />
            {/* {hand.length > 0 &&
                <h3>Your Hand: {hand.map((die, key) => <img className="die" src={die} key={key} alt="dice" />)}</h3>
            } */}

            {/* <LatestBid />
             */}
        </div>
    );

    export default Player;