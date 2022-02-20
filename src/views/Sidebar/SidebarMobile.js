import { useEffect, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { ImHome } from "react-icons/im";
import { MdUpload } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaMicrophone } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";

import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount, btnLogin, btnUpload } from "../../redux/actions";

const SidebarMobile = (props) => {
  const dataUser = useSelector((state) => state.getUserLogin);
  const dispatch = useDispatch();
  const sidebarMobile = useRef();
  const { isNavOpen, hanldeOnOffNavbar, handleClickLogin, handleClickSignup } = props;

  const handleCloseSidebar = () => {
    sidebarMobile.current.classList.add("hasnot-display");
    sidebarMobile.current.classList.remove("has-display");
    sidebarMobileBody.current.classList.add("nav_is-hide");
    sidebarMobileBody.current.classList.remove("nav_is-display");
    hanldeOnOffNavbar(false);
  };
  useEffect(() => {
    if (sidebarMobile.current) {
      if (isNavOpen) {
        sidebarMobile.current.classList.remove("hasnot-display");
        sidebarMobile.current.classList.add("has-display");
        sidebarMobileBody.current.classList.remove("nav_is-hide");
        sidebarMobileBody.current.classList.add("nav_is-display");
      } else {
        sidebarMobile.current.classList.add("hasnot-display");
        sidebarMobile.current.classList.remove("has-display");
        sidebarMobileBody.current.classList.add("nav_is-hide");
        sidebarMobileBody.current.classList.remove("nav_is-display");
      }
    }
  }, [isNavOpen]);
  const sidebarMobileBody = useRef();

  const handleClickOff = (e) => {
    if (sidebarMobileBody.current) {
      if (!sidebarMobileBody.current.contains(e.target)) {
        handleCloseSidebar();
      }
    }
  };
  const handleClickLoginMiddle = () => {
    handleClickLogin();
    handleCloseSidebar();
  };
  const handleClickSignupMiddle = () => {
    handleClickSignup();
    handleCloseSidebar();
  };
  const handleClickUpload = () => {
    dispatch(btnUpload(true));

    handleCloseSidebar();
  };
  return (
    <>
      <div className="sidebar-mobile__opacity hasnot-display" ref={sidebarMobile} onClick={(e) => handleClickOff(e)}>
        <div className="sidebar-mobile__body nav_is-hide" ref={sidebarMobileBody}>
          <div className="sidebar-body__wrapper">
            {!dataUser && (
              <>
                <div className="sidebar-body__feature" onClick={() => handleClickLoginMiddle()}>
                  <span className="sidebar-body__feature--icon">
                    <FaSignInAlt />
                  </span>
                  <span className="sidebar-body__feature--title">Đăng nhập</span>
                </div>
                <div className="sidebar-body__feature" onClick={() => handleClickSignupMiddle()}>
                  <span className="sidebar-body__feature--icon">
                    <FaSignInAlt />
                  </span>
                  <span className="sidebar-body__feature--title">Đăng ký</span>
                </div>
              </>
            )}
            <NavLink to="/" activeClassName="active-mobile" exact>
              <div className="sidebar-body__feature" onClick={() => handleCloseSidebar()}>
                <span className="sidebar-body__feature--icon">
                  <ImHome />
                </span>
                <span className="sidebar-body__feature--title">Trang chủ</span>
              </div>
            </NavLink>
            {dataUser && (
              <>
                <div className="sidebar-body__feature" onClick={() => handleClickUpload()}>
                  <span className="sidebar-body__feature--icon">
                    <MdUpload />
                  </span>
                  <span className="sidebar-body__feature--title">Upload</span>
                </div>
                <NavLink to={`/users/${dataUser._id}`} activeClassName="active-mobile" exact>
                  <div className="sidebar-body__feature" onClick={() => handleCloseSidebar()}>
                    <span className="sidebar-body__feature--icon">
                      <CgProfile />
                    </span>
                    <span className="sidebar-body__feature--title">Cá nhân</span>
                  </div>
                </NavLink>
              </>
            )}
            <NavLink to={`/musics`} activeClassName="active-mobile" exact>
              <div className="sidebar-body__feature" onClick={() => handleCloseSidebar()}>
                <span className="sidebar-body__feature--icon">
                  <GiLoveSong />
                </span>
                <span className="sidebar-body__feature--title">Âm nhạc</span>
              </div>
            </NavLink>
            <NavLink to={`/artists`} activeClassName="active-mobile" exact>
              <div className="sidebar-body__feature" onClick={() => handleCloseSidebar()}>
                <span className="sidebar-body__feature--icon">
                  <FaMicrophone />
                </span>
                <span className="sidebar-body__feature--title">Nghệ sĩ</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};
export default SidebarMobile;
