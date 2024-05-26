import LoginForm from '../molecules/LoginForm/login'

function Loginpg() {
  
  return (
    <>
    <div className="form-introduction">
            <div className="content-wrapper1">
                    <img src="../../../../../../src/assets/img/jewelry.jpg" alt="Jewelry Introduction" className="background-image1" />
                    <div className="overlay1"></div>
                    <div className="text-overlay1">
                        <h1>FORTUNE</h1>
                        <LoginForm/>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Loginpg