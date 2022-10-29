import React from 'react';
import MainFooter from './MainFooter';
import Logo from "../../../assets/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <MainFooter>
      <div className='container-content'>
        <img src={Logo} alt="" />
        <h1>Hello from footer</h1>
      </div>
    </MainFooter>
  )
}

export default Footer
