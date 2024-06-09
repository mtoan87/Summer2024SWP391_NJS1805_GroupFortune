import React from 'react';
import GuestFooter from '../components/guest-footer';
import GuestHeader from '../components/guest-header';
import GuestHomeTemp from '../guest-home-temp/guest-home-temp';

const GuestHomePg: React.FC = () => {
  return (
    <>
      <header> 
        <GuestHeader /> 
      </header>
      <div>
        <GuestHomeTemp />
      </div>
      <footer> 
        <GuestFooter /> 
      </footer>
    </>
  );
}

export default GuestHomePg;