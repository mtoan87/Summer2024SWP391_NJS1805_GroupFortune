import MemberFooter from "../../atoms/member-footer/member-footer"
import MemberHeader from "../../atoms/member-header/member-header"
import MemberRegisterJewelryAucTemp from "../../template/member-register-jewelry-auction/member-register-jewelry-auction"

function MemberRegisterJewelryAuctionPg() {
    return (
        <>
        <header>
            <MemberHeader />
        </header>
        <div>
            <MemberRegisterJewelryAucTemp />
        </div>
        <footer>
            <MemberFooter />
        </footer>
        </>
        )
}

export default MemberRegisterJewelryAuctionPg