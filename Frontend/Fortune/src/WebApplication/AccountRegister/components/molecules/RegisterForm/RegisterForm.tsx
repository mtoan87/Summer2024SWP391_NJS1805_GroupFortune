
import './introduction.scss'
import BasicExample from './form'

function Introduction() {
    return (
        <>
            <div className="guest-introduction">
            <div className="content-wrapper">
                    <img src="../../../../../../src/assets/img/jewelry.jpg" alt="Jewelry Introduction" className="background-image" />
                    <div className="overlay"></div>
                    <div className="text-overlay">
                        <h1>Jewelry Auctions</h1>
                        <BasicExample/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Introduction