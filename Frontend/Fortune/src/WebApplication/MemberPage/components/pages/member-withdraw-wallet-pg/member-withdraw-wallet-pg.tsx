import MemberHeader from '../../atoms/member-header/member-header'
import WithdrawWalletTmp from '../../template/member-withdraw-wallet/member-withdraw-wallet'
import MemberFooter from '../../atoms/member-footer/member-footer'

function WithdrawWalletPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <WithdrawWalletTmp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default WithdrawWalletPg