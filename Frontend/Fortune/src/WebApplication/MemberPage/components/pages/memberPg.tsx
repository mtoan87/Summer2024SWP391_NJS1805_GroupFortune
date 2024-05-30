import GuestFooter from '../atoms/guest-footer/guest-footer'
import GuestHeader from '../atoms/guest-header/guest-header'
import GuestHomeTemp from '../templates/guest-home-temp/guest-home-temp'

function GuestHomePg() {
  return (
    <>
    <header> <GuestHeader /> </header>
    <div>
        <GuestHomeTemp />
    </div>
    <footer> <GuestFooter /> </footer>
    </>
  )
}

export default GuestHomePg