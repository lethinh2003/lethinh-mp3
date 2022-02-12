import "../styles/navigation.scss";
import { MdFeaturedPlayList, MdHorizontalSplit } from "react-icons/md";
import { FaMicrophone, FaStore } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";
import { FiRadio, FiUpload } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { GoBrowser } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { MdUpload } from "react-icons/md";

import { RiCloseCircleLine } from "react-icons/ri";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount, btnLogin, btnUpload } from "../redux/actions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Search from "./Search";
const Navigation = () => {
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const nav = useRef(null);

  const dataUser = useSelector((state) => state.getUserLogin);
  const dataSelectedMusic = useSelector((state) => state.selectedMusic.data);

  let history = useHistory();
  useEffect(() => {
    if (Array.isArray(dataSelectedMusic)) {
      nav.current.classList.remove("has-player");
    } else {
      nav.current.classList.add("has-player");
    }
  }, [dataSelectedMusic]);

  const hanldeOnOffNavbar = () => {
    if (isNavOpen) {
      nav.current.style = "transform: translateX(-100%); opacity: 0; visibility: hidden;";
    } else {
      nav.current.style = "opacity: 1; visibility: visible;transform: translateX(0); ";
    }
    setIsNavOpen(!isNavOpen);
  };

  const hanldeClickBackHistory = () => {
    history.goBack();
  };
  const hanldeClickForwardHistory = () => {
    history.goForward();
  };
  const handleClickLogin = () => {
    dispatch(btnLogin(true));
  };
  const handleClickUpload = () => {
    dispatch(btnUpload(true));
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="ms-sidebar" ref={nav}>
        {/* {dataUser && (
          <div className="userlogin-info">
            <div className="userlogin-info__avatar">
              <Link to="/auth/me">
                <img src={dataUser.avatar} />
              </Link>
            </div>
            <div className="userlogin-info__desc">
              <span className="userlogin-info__desc--name">{dataUser.name}</span>
              <span className="userlogin-info__desc--level">{dataUser.role}</span>
            </div>
          </div>
        )} */}

        <div className="ms-sidebar__wrapper">
          <div className="ms-navbar">
            {dataUser && (
              <div className="ms-navbar__item">
                <span className="ms-navbar__item--icon upload">
                  <MdUpload className="icon-upload" onClick={() => handleClickUpload()} />
                </span>
              </div>
            )}
            <NavLink to="/" activeClassName="active" exact>
              <div className="ms-navbar__item">
                <span className="ms-navbar__item--icon">
                  <i className="fa fa-home" aria-hidden="true"></i>
                </span>
                <span className="ms-navbar__item--title">Home</span>
              </div>
            </NavLink>
            {dataUser && (
              <NavLink to="/auth/me" activeClassName="active" exact>
                <div className="ms-navbar__item">
                  <span className="ms-navbar__item--icon">
                    <CgProfile />
                  </span>
                  <span className="ms-navbar__item--title">Profile</span>
                </div>
              </NavLink>
            )}

            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <MdFeaturedPlayList />
              </span>
              <span className="ms-navbar__item--title">Playlists</span>
            </div>
            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <FaMicrophone />
              </span>
              <span className="ms-navbar__item--title">Aartist</span>
            </div>
            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <GiLoveSong />
              </span>
              <span className="ms-navbar__item--title">Songs</span>
            </div>
          </div>

          {/* <div className="ms-navbar">
            <div className="ms-navbar__item">
              <span className="ms-navbar__item--title">Discover</span>
            </div>

            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <FaStore />
              </span>
              <span className="ms-navbar__item--title">Store</span>
            </div>

            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <FiRadio />
              </span>
              <span className="ms-navbar__item--title">Radio</span>
            </div>
            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <BsHeartFill />
              </span>
              <span className="ms-navbar__item--title">For You</span>
            </div>
          </div> */}
        </div>
      </aside>

      {/* HEADER */}
      <header className="ms-header">
        <div className="level">
          <div className="level-left">
            <div className="ms-sidebar__logo">
              <img src="https://i.imgur.com/U0BdIic.png" />
            </div>
            {/* <span className="ms-btn back" onClick={() => hanldeClickBackHistory()}>
              <IoIosArrowRoundBack />
            </span>
            <span className="ms-btn next" onClick={() => hanldeClickForwardHistory()}>
              <IoIosArrowRoundForward />
            </span> */}
          </div>
          <div className="level-right">
            <Search />
            <span className="ms-btn navbar" onClick={() => hanldeOnOffNavbar()}>
              {isNavOpen ? <RiBarChartHorizontalLine /> : <FaBars />}
            </span>

            <div className="header-btn">
              {!dataUser ? (
                <span onClick={() => handleClickLogin()}>Login</span>
              ) : (
                <Link to="/auth/logout">Logout</Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default Navigation;
