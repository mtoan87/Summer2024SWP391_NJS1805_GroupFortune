import React from 'react'
import StaffHeader from '../../atoms/staff-header/staff-header'
import StaffAuctionTmp from '../../template/staff-auctions/staff-auctions-tmp'
import StaffFooter from '../../atoms/staff-footer/staff-footer'

function StaffAuctionsPg() {
  return (
    <>
    <header>
        <StaffHeader />
    </header>
    <div>
        <StaffAuctionTmp />
    </div>
    <footer>
        <StaffFooter />
    </footer>
    </>
  )
}

export default StaffAuctionsPg