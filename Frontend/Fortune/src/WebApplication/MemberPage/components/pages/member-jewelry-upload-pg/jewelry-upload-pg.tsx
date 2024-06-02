import MemberHeader from '../../atoms/member-header/member-header'
import JewelryUploadTemp from '../../template/member-jewelry-upload/jewelry-upload-temp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function JewelryUploadPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <JewelryUploadTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default JewelryUploadPg