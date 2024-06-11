import '../styles/introduction.scss';
import SimpleSlider from '../../MemberPage/components/molecules/SlideShow/SimpleSlider';
function Introduction() {
    return (
        <>
            <div className="guest-introduction">
                {/* <div className="content-wrapper">
                    <img src="../../../../../../src/assets/img/jewelry.jpg" alt="Jewelry Introduction" className="background-image" />
                    <div className="overlay"></div>
                    <div className="text-overlay">
                        <h1>Jewelry Auctions</h1>
                        <h2>Dive into the Glittering World of Jewelry Auctions - Where Every Bid Shines Bright!</h2>
                        <button
                            className="action-button"
                            role="button"
                            aria-pressed="false"
                        >
                            Get Started
                        </button>
                    </div>
                </div> */}
            </div>
            <SimpleSlider/>

        </>
    )
}

export default Introduction