import MemberFooter from '../../atoms/member-footer/member-footer'
import MemberHeader from '../../atoms/member-header/member-header'
import MemberBidsRecordTmp from '../../template/member-bids-record/member-bids-record'

function MemberBidsRecordPg() {
    return (
        <>
            <header>
                <MemberHeader />
            </header>
            <div>
                <MemberBidsRecordTmp />
            </div>
            <footer>
                <MemberFooter />
            </footer>
        </>
    )
}

export default MemberBidsRecordPg