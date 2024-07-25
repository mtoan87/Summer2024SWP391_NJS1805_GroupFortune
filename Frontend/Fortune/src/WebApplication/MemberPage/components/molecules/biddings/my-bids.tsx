import React from 'react';
import CommentForm from './components/comment';
import MainContent from './components/maincontent';
import MemberHeader from '../../atoms/member-header/member-header';
import MemberFooter from '../../atoms/member-footer/member-footer';
import BiddingForm from './components/biddingForm';
import './Styles/biddingPG.scss'; // Import your custom CSS file

function MyBidding() {
  return (
    <>
      <header>
        <MemberHeader />
      </header>
      <main>
        <div className="content-container">
          <BiddingForm />
          <MainContent />
        </div>
      </main>

      <footer>
        <MemberFooter />
      </footer>
    </>
  );
}

export default MyBidding;
