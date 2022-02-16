import "../styles/navigation.scss";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount, btnLogin, btnUpload, btnSignup } from "../redux/actions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Sidebar from "./Sidebar/Sidebar";
import SidebarMobile from "../views/Sidebar/SidebarMobile";
import Search from "./Search";
const Navigation = () => {
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const nav = useRef(null);

  const dataUser = useSelector((state) => state.getUserLogin);

  let history = useHistory();

  const hanldeOnOffNavbar = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleClickLogin = () => {
    dispatch(btnLogin(true));
  };
  const handleClickSignup = () => {
    dispatch(btnSignup(true));
  };

  const accountDetail = useRef();
  const accountBtn = useRef();
  const [isAccountDetail, setIsAccountDetail] = useState(false);
  const handleClickAccountBtn = () => {
    if (dataUser && accountDetail.current && accountBtn.current) {
      if (!isAccountDetail) {
        accountDetail.current.classList.add("is-show");
        accountBtn.current.style = "background-color: #282828";
        setIsAccountDetail(true);
      } else {
        accountDetail.current.classList.remove("is-show");
        accountBtn.current.style = null;
        setIsAccountDetail(false);
      }
    }
  };
  const handleCloseAccountBtn = () => {
    if (dataUser && accountDetail.current && accountBtn.current) {
      setIsAccountDetail(false);
      accountDetail.current.classList.remove("is-show");
      accountBtn.current.style = null;
    }
  };
  useEffect(() => {
    const handleClick = (e) => {
      if (accountBtn.current && accountDetail.current) {
        if (!accountBtn.current.contains(e.target)) {
          handleCloseAccountBtn();
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <>
      <Sidebar />
      <SidebarMobile
        isNavOpen={isNavOpen}
        hanldeOnOffNavbar={hanldeOnOffNavbar}
        handleClickLogin={handleClickLogin}
        handleClickSignup={handleClickSignup}
      />
      {/* HEADER */}
      <header className="ms-header">
        <div className="level">
          <div className="level-left">
            <div className="ms-sidebar__logo">
              <Link to="/">
                <img src="https://i.imgur.com/U0BdIic.png" />
              </Link>
            </div>
            <div className="ms-sidebar__slogan">LT-MP3, nghe là ghiền</div>
            <span className="ms-btn navbar" onClick={() => hanldeOnOffNavbar()}>
              {isNavOpen ? <RiBarChartHorizontalLine /> : <FaBars />}
            </span>
          </div>
          <div className="level-right">
            <Search />

            {!dataUser && (
              <div className="header-btn" onClick={() => handleClickLogin()}>
                Login
              </div>
            )}
            {dataUser && (
              <>
                <div className="account__header-btn" ref={accountBtn}>
                  <div className="account__header-btn--wrapper" onClick={() => handleClickAccountBtn()}>
                    <img className="account--avatar" src={dataUser.avatar} />

                    <span className="account--name">{dataUser.name}</span>
                    <span className="account--icon">
                      {isAccountDetail ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                    </span>
                  </div>
                  <div className="account__header-btn--detail" ref={accountDetail}>
                    <Link to={`/user/${dataUser._id}`} className="detail-title" onClick={handleCloseAccountBtn}>
                      Profile
                    </Link>

                    <Link to="/auth/logout" className="detail-title" onClick={handleCloseAccountBtn}>
                      Logout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
export default Navigation;
