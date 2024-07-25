import MemberHeader from '../../atoms/member-header/member-header'
import UpdateWalletTmp from '../../template/member-update-wallet/update-wallet-tmp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function UpdateWalletPg() {
    return (
        <>
            <header>
                <MemberHeader />
            </header>
            <div>
                <UpdateWalletTmp /></div>
            <footer>
                <MemberFooter />
            </footer>
        </>
    )
}

export default UpdateWalletPg