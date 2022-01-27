import "../styles/navigation.scss";
import { MdFeaturedPlayList } from "react-icons/md";
import { FaMicrophone, FaStore } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";
import { FiRadio } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { GoBrowser } from "react-icons/go";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsArrowsAngleExpand } from "react-icons/bs";
import APIMusic from "../api/APIMusic";
import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "./images/logo.png";
import { getUserLogin } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
const Navigation = () => {
  const dataUser = useSelector((state) => state.getUserLogin);
  const dispatch = useDispatch();
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const navOpen = useRef(null);
  const nav = useRef(null);
  const btnOpen = useRef(null);
  const navItem = useRef(null);
  const navItemTitle = useRef(null);
  const navLogoImg = useRef(null);

  useEffect(() => {}, []);

  const currentUser = localStorage.getItem("currentUser");
  const handleToggleMenu = () => {
    nav.current.style = "transform: translateX(-100%)";
  };
  const handleOpenMenu = () => {
    nav.current.style = "transform: translateX(0)";
  };
  return (
    <>
      <div className="navigation" ref={nav}>
        <div className="userlogin-info">
          <div className="userlogin-info__avatar">
            {dataUser.avatar ? (
              <Link to="/me">
                <img src={dataUser.avatar} />
              </Link>
            ) : (
              <img src="https://images.unsplash.com/photo-1640453998519-956952bbc616?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80" />
            )}
          </div>
          <div className="userlogin-info__desc">
            <span className="userlogin-info__desc--name">
              {dataUser.name ? dataUser.name : "Guess"}
            </span>
            <span className="userlogin-info__desc--level">Preminium</span>
          </div>
        </div>
        <div className="nav__items">
          <div className="nav__item">
            <span className="nav__items--title">Library</span>
          </div>
          <NavLink to="/" activeClassName="active" exact>
            <div className="nav__item">
              <span className="nav__item--icon">
                <i className="fa fa-home" aria-hidden="true"></i>
              </span>
              <span className="nav__item--title">Home</span>
            </div>
          </NavLink>

          <div className="nav__item">
            <span className="nav__item--icon">
              <MdFeaturedPlayList />
            </span>
            <span className="nav__item--title">Playlists</span>
          </div>
          <div className="nav__item">
            <span className="nav__item--icon">
              <FaMicrophone />
            </span>
            <span className="nav__item--title">Aartist</span>
          </div>
          <div className="nav__item">
            <span className="nav__item--icon">
              <GiLoveSong />
            </span>
            <span className="nav__item--title">Songs</span>
          </div>
        </div>
        <div className="nav__items">
          <div className="nav__item">
            <span className="nav__items--title">Discover</span>
          </div>

          <div className="nav__item">
            <span className="nav__item--icon">
              <FaStore />
            </span>
            <span className="nav__item--title">Store</span>
          </div>

          <div className="nav__item">
            <span className="nav__item--icon">
              <FiRadio />
            </span>
            <span className="nav__item--title">Radio</span>
          </div>
          <div className="nav__item">
            <span className="nav__item--icon">
              <BsHeartFill />
            </span>
            <span className="nav__item--title">For You</span>
          </div>
          <div className="nav__item close" onClick={() => handleToggleMenu()}>
            <span className="nav__item--icon">
              <RiCloseCircleLine />
            </span>
            <span className="nav__item--title">Close Menu</span>
          </div>
        </div>
      </div>
      <div
        className="btn-openmenu"
        ref={btnOpen}
        onClick={() => handleOpenMenu()}
      >
        <BsArrowsAngleExpand />
      </div>
    </>
  );
};
export default Navigation;
