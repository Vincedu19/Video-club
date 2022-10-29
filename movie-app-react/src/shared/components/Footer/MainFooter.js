import React from 'react';
import "./MainFooter.css";

const MainFooter = (props) => {
  return (
    <footer className='container-footer'>
      {props.children}
    </footer>
  )
}

export default MainFooter
