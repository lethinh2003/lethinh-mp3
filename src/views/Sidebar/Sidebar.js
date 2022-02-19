import { NavLink, Link } from "react-router-dom";
import { MdUpload, MdFeaturedPlayList } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaMicrophone, FaStore } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { getUserLogin, removeUserLogin, accessAccount, btnLogin, btnUpload } from "../../redux/actions";

const Sidebar = (props) => {
  const nav = useRef(null);
  const dataUser = useSelector((state) => state.getUserLogin);
  const dataSelectedMusic = useSelector((state) => state.selectedMusic.data);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Array.isArray(dataSelectedMusic)) {
      nav.current.classList.remove("has-player");
    } else {
      nav.current.classList.add("has-player");
    }
  }, [dataSelectedMusic]);
  const handleClickUpload = () => {
    dispatch(btnUpload(true));
  };
  return (
    <>
      <aside className="ms-sidebar" ref={nav}>
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
              <NavLink to={`/user/${dataUser._id}`} activeClassName="active" exact>
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
                <FaMicrophone />
              </span>
              <span className="ms-navbar__item--title">Artists</span>
            </div>
            <div className="ms-navbar__item">
              <span className="ms-navbar__item--icon">
                <GiLoveSong />
              </span>
              <span className="ms-navbar__item--title">Songs</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
