import MemberHeader from '../../atoms/member-header/member-header'
import AccountWalletTemp from '../../template/member-account-wallet/account-wallet-tmp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberAccountWalletPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <AccountWalletTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberAccountWalletPg