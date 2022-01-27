import "../styles/mainpage.scss";
import UserInfo from "./UserInfo";
import Category from "./Category";
import NewMusic from "./NewMusic";
import Search from "./Search";
import Popular from "./Popular";
import Playlists from "./Playlists";
import Artists from "./Artists";
import Heart from "./Heart";
import { MdFeaturedPlayList } from "react-icons/md";
import { FaMicrophone, FaStore } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";
import { FiRadio } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { GoBrowser } from "react-icons/go";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
const Layout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const nav = useRef(null);
  const hanldeOnOffNavbar = () => {
    if (isNavOpen) {
      nav.current.style = "transform: translateX(-100%); opacity: 0; visibility: hidden;";
    } else {
      nav.current.style = "opacity: 1; visibility: visible;transform: translateX(0); ";
    }
    setIsNavOpen(!isNavOpen);
  };
  return (
    <>
      <Heart />
      <div className="ms-layout">
        {/* SIDEBAR */}
        {/* <aside className="ms-sidebar" ref={nav}>
          <div className="ms-sidebar__logo">
            <img src="https://i.imgur.com/O784N6i.png" />
          </div>

          <div className="ms-sidebar__wrapper">
            <div className="ms-navbar">
              <div className="ms-navbar__item">
                <span className="ms-navbar__item--title">Library</span>
              </div>
              <NavLink to="/" activeClassName="active" exact>
                <div className="ms-navbar__item">
                  <span className="ms-navbar__item--icon">
                    <i className="fa fa-home" aria-hidden="true"></i>
                  </span>
                  <span className="ms-navbar__item--title">Home</span>
                </div>
              </NavLink>

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

            <div className="ms-navbar">
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
              <div className="ms-navbar__item close">
                <span className="ms-navbar__item--icon">
                  <RiCloseCircleLine />
                </span>
                <span className="ms-navbar__item--title">Close Menu</span>
              </div>
            </div>
          </div>
        </aside> */}

        {/* HEADER */}
        {/* <header className="ms-header">
          <div className="level">
            <div className="level-left">
              <span className="ms-btn">
                <IoIosArrowRoundBack />
              </span>
              <span className="ms-btn">
                <IoIosArrowRoundForward />
              </span>
              <div className="search"></div>
            </div>
            <div className="level-right">
              <span className="ms-btn navbar" onClick={() => hanldeOnOffNavbar()}>
                {isNavOpen ? <RiBarChartHorizontalLine /> : <FaBars />}
              </span>

              <div className="login-btn">
                <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </header> */}

        {/* MAINPAGE */}
        {/* <div className="ms-mainpage">
          <Artists />
          <NewMusic />
          <div className="box-two-col">
            <Popular />
            <Playlists />
          </div>
        </div> */}
      </div>
    </>
  );
};
export default Layout;
