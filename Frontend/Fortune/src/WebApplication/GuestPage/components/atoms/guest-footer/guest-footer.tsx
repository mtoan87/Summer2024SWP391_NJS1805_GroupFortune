import './guest-footer.scss'

function GuestFooter() {
  return (
    <>
      <div className="guest-footer-high-page">
        <ul className="call-us">
          <li>Gọi chúng tôi</li>
          <li>
            <img src="/src/SWP_RESOURCE/icon/output-onlinegiftools.gif" />
            1900 43 22 31
          </li>
        </ul>

        <ul className="mail-us">
          <li>Gửi tin nhắn cho chúng tôi</li>
          <li>
            <img src="/src/SWP_RESOURCE/icon/output-onlinegiftools (1).gif" />
            fortune@gmail.com
          </li>
        </ul>

        <ul className="follow-us">
          <li>Theo dõi chúng tôi</li>
          <div className="icon">
            <li>
              <img src="/src/SWP_RESOURCE/icon/facebook (1).png" />
            </li>
            <li>
              <img src="/src/SWP_RESOURCE/icon/twitter.png" />
            </li>
            <li>
              <img src="/src/SWP_RESOURCE/icon/instagram.png" />
            </li>
          </div>
        </ul>
      </div>
    </>
  )
}

export default GuestFooter