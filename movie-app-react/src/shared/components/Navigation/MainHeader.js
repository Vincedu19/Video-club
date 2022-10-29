import React, {useState} from 'react';
import "./MainHeader.css"

const MainHeader = (props) => {
 const [isScrolled, setIsScrolled] = useState(false);

 window.onscroll = () => {
  setIsScrolled(window.pageYOffset === 0 ? false : true);
  return 
 }
  return (
    <header className={isScrolled ? 'main-header scrolled' : 'main-header'}>
      {props.children}
    </header>
  )
}

export default MainHeader
