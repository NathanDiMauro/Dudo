import React from 'react'
import '../styles/footer.css'
import {Link} from "react-router-dom"

class Footer extends React.Component {
    render() {
      return (
        <div id='foot'>
          <a href='https://en.wikipedia.org/wiki/Dudo' className='fLink' id='first' target='new'>How to Play</a>
          <Link to='/license' className='fLink'>License</Link>
        </div>
      )}
  }
  export default Footer