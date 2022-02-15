import "../styles/footer.scss";
import { RiFacebookFill } from "react-icons/ri";
import { IoLogoInstagram } from "react-icons/io";
import { AiOutlineTwitter } from "react-icons/ai";
const Footer = () => {
  return (
    <>
      <footer className="ms-footer">
        <div className="about">
          <div className="about-column">
            <div className="about-column__title">Hỗ trợ</div>
            <div className="about-column__contents">
              <span className="about-column__content">Liên hệ</span>
              <span className="about-column__content">Bảo mật</span>
              <span className="about-column__content">Điều khoản</span>
            </div>
          </div>
          <div className="about-column">
            <div className="about-column__title">About me</div>
            <div className="about-column__contents">
              <span className="about-column__content">Giới thiệu</span>
              <span className="about-column__content">Đối tác</span>
            </div>
          </div>
          <div className="about-column">
            <div className="about-column__title">Contact</div>
            <div className="about-column__contents">
              <span className="about-column__content">lethinh.developer@gmail.com</span>
              <span className="about-column__content">Thinh Le</span>
            </div>
          </div>
        </div>
        <div className="social">
          <div className="social-btn">
            <RiFacebookFill />
          </div>
          <div className="social-btn">
            <IoLogoInstagram />
          </div>
          <div className="social-btn">
            <AiOutlineTwitter />
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
