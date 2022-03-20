import '../styles/header.css'
import { Link } from "react-router-dom"

// const Header = () => (
//   <Navbar sticky="top" id="header">
//     <Navbar.Brand><Link to="/" id='brand'>Dudo Online</Link></Navbar.Brand>
//     <Nav>
//       <Link to="/" className='links' id='first'><h3>Play</h3></Link>
//       <Link to="/about" className='links'><h3>About</h3></Link>
//     </Nav>
//   </Navbar>
// )

const Header = () => (
  <nav>
    <Link to="/" id='brand'>Dudo - Online</Link>
    <Link to="/about" id="aboutLink" className='links'><h3>About</h3></Link>
  </nav >
)


export default Header;