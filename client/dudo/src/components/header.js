import React from 'react'
import '../styles/header.css'
import {Link} from "react-router-dom"
import {Navbar, Nav} from 'react-bootstrap'

class Header extends React.Component {
    render() {
      return (
      <Navbar sticky="top" id="header">
        <Navbar.Brand><Link to="/" id='brand'>Dudo Online</Link></Navbar.Brand>
          <Nav>
            <Link to="/" className='links' id='first'><h3>Play</h3></Link>
            <Link to="/about" className='links'><h3>About</h3></Link>
          </Nav>
      </Navbar>
      )}
  }
  export default Header