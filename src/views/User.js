import "../styles/user.scss";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import {
  getUserLogin,
  getPopular,
  getListMusic,
  setSelectedMusic,
  removeSelectedMusic,
  addMyPlaylist,
  addMyPlaylistUser,
  setNextSelectedMusic,
  removeNextSelectedMusic,
  setPreviousSelectedMusic,
  removePreviousSelectedMusic,
  setIsPlayingPlaylist,
  getMyListHearts,
  removeMyListHearts,
  getStatusSelectedMusic,
  btnProfile,
} from "../redux/actions";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import errorAuth from "./utils/errorAuth";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import { Audio } from "react-loading-icons";

const User = () => {
  let history = useHistory();
  const currentUser = localStorage.getItem("currentUser");
  const [profileUser, setProfileUser] = useState("");
  const TokenAccount = localStorage.getItem("jwt");
  const dataMusic = useSelector((state) => state.popularMusic.data);
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const dataMyPlaylist = useSelector((state) => state.addMyPlaylist);
  const dataMyPlaylistUser = useSelector((state) => state.addMyPlaylistUser);
  const getUserLogin = useSelector((state) => state.getUserLogin);
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
  const isPlayingPlaylist = localStorage.getItem("isPlayingPlaylist") || "false";
  const isBtnProfile = useSelector((state) => state.btnProfile);
  const dispatch = useDispatch();
  let { id } = useParams();
  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/users/" + id);
      setProfileUser(response.data.data.data);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };
  useEffect(() => {
    fetchAPI();
  }, [isBtnProfile]);
  const hanldeClickEdit = () => {
    if (currentUser && JSON.parse(currentUser)._id === profileUser._id) {
      dispatch(btnProfile(true));
    }
  };

  return (
    <>
      {profileUser && (
        <div className="ms-mainpage">
          <div className="box-profile">
            <div className="box-profile__header">
              <div className="header__avatar">
                {currentUser && JSON.parse(currentUser)._id === profileUser._id && (
                  <span className="header__avatar--edit" onClick={() => hanldeClickEdit()}>
                    <FiEdit2 style={{ fontSize: "60px" }} />
                    <h3>Edit</h3>
                  </span>
                )}
                <img src={profileUser.avatar} />
              </div>
              <div className="header__info">
                <span className="header__info--title">Profile</span>
                <span className="header__info--name">{profileUser.name}</span>
                <span className="header__info--desc">Descript</span>
              </div>
            </div>
            <div className="box-profile__body"></div>
          </div>
        </div>
      )}
    </>
  );
};
export default User;
