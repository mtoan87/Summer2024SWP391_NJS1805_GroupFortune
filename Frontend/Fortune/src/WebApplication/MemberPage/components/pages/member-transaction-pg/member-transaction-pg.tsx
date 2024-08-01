import MemberHeader from '../../atoms/member-header/member-header'
import MemberTransactionTmp from '../../template/member-transaction/member-transaction-tmp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberTransactionPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberTransactionTmp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberTransactionPg