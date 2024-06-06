import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import MemberHeader from '../../component/atoms/member-header/member-header'
import MemberFooter from '../../component/atoms/member-footer/member-footer'
import ManagerHomeBody from '../template/ManagerHomeBody';
import "./ManagerHomePg.scss"
function ManagerHomePg() {
    return (
        <>
            <header>
                <MemberHeader />
            </header>
            <div className='ManaHomeBody'>
                <ManagerHomeBody />
            </div>
            <footer>
                <MemberFooter />
            </footer>
        </>
    )
}

export default ManagerHomePg