import React from 'react';
import ReactDOM from 'react-dom';
import './styles/colors.css';
import './styles/index.css';
import App from './pages/App';
import { 
  BrowserRouter, 
  Routes,
  Route } from "react-router-dom";
import About from './pages/about';
import Header from './components/header'
import Footer from './components/footer'
import License from './pages/license'
import { SocketProvider } from './context/socketContext';

ReactDOM.render(
  <React.StrictMode>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@500&display=swap" rel="stylesheet" />
    
    <SocketProvider id="game">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/license" element={<License />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);