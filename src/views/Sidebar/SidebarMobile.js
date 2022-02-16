import { useEffect, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { ImHome } from "react-icons/im";
import { MdUpload } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount, btnLogin, btnUpload } from "../../redux/actions";

const SidebarMobile = (props) => {
  const dataUser = useSelector((state) => state.getUserLogin);
  const dispatch = useDispatch();
  const sidebarMobile = useRef();
  const { isNavOpen, hanldeOnOffNavbar, handleClickLogin, handleClickSignup } = props;
  console.log(isNavOpen);
  const handleCloseSidebar = () => {
    sidebarMobile.current.classList.add("is-dpn");
    sidebarMobile.current.classList.remove("is-dpb");
    hanldeOnOffNavbar(false);
  };
  useEffect(() => {
    if (sidebarMobile.current) {
      if (isNavOpen) {
        sidebarMobile.current.classList.remove("is-dpn");
        sidebarMobile.current.classList.add("is-dpb");
      } else {
        sidebarMobile.current.classList.add("is-dpn");
        sidebarMobile.current.classList.remove("is-dpb");
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
    handleClickLogin();
    handleCloseSidebar();
  };
  const handleClickUpload = () => {
    dispatch(btnUpload(true));

    handleCloseSidebar();
  };
  return (
    <>
      <div className="sidebar-mobile__opacity is-dpn" ref={sidebarMobile} onClick={(e) => handleClickOff(e)}>
        <div className="sidebar-mobile__body" ref={sidebarMobileBody}>
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
            {dataUser && (
              <>
                <div className="sidebar-body__feature" onClick={() => handleClickUpload()}>
                  <span className="sidebar-body__feature--icon">
                    <MdUpload />
                  </span>
                  <span className="sidebar-body__feature--title">Upload</span>
                </div>
                <NavLink to={`/user/${dataUser._id}`} activeClassName="active-mobile" exact>
                  <div className="sidebar-body__feature" onClick={() => handleCloseSidebar()}>
                    <span className="sidebar-body__feature--icon">
                      <CgProfile />
                    </span>
                    <span className="sidebar-body__feature--title">Cá nhân</span>
                  </div>
                </NavLink>
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
          </div>
        </div>
      </div>
    </>
  );
};
export default SidebarMobile;
