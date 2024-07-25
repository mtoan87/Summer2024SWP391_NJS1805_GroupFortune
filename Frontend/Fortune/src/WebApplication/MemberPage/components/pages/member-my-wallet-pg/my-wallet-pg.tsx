import MemberHeader from '../../atoms/member-header/member-header'
import MyWalletTemp from '../../template/member-my-wallet/my-wallet-tmp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MyWalletPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MyWalletTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MyWalletPg