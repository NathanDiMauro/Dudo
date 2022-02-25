import React from 'react'

class About extends React.Component {
    render() {
      return (
        <><div style={{marginLeft: '25%',marginRight: '25%'}}>
        <h1>About</h1>
        <p>Dudo is a liar's dice game. Learn more <a href="https://en.wikipedia.org/wiki/Dudo" target="_blank">HERE</a></p>
        <p>We at ScrumShot strive to create an online hub for players to enjoy the wonderful game that is Dudo.</p><br></br>
        <p>
          <h4>Team Members</h4>
          <ul><h5>Front-end</h5>
            <li>Nathan DiMauro</li>
            <li>Adam Cerutti</li>
          </ul>
          <ul><h5>Back-end</h5>
            <li>Liam Cannon</li>
            <li>Jake Capra</li>
          </ul>
        </p>
        </div></>
      )}
  }
  export default About