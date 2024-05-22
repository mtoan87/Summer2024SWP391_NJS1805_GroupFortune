import GuestFooter from '../atoms/guest-footer/guest-footer'
import GuestHeader from '../atoms/guest-header/guest-header'
import RegisterForm from '../molecules/RegisterForm/RegisterForm'


function RegisterPg() {
    return (
      <>
      <header> <GuestHeader /> </header>
      <div>
         <RegisterForm/>
      </div>
      <footer> <GuestFooter /> </footer>
      </>
    )
  }
  
  export default RegisterPg