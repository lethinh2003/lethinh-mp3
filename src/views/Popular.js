import "../styles/popular.scss";
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
} from "../redux/actions";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import errorAuth from "./utils/errorAuth";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import { Audio } from "react-loading-icons";
const Popular = () => {
  let history = useHistory();
  const TokenAccount = localStorage.getItem("jwt");
  const dataMusic = useSelector((state) => state.popularMusic.data);
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const dataMyPlaylist = useSelector((state) => state.addMyPlaylist);
  const dataMyPlaylistUser = useSelector((state) => state.addMyPlaylistUser);
  const getUserLogin = useSelector((state) => state.getUserLogin);
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
  const isPlayingPlaylist = localStorage.getItem("isPlayingPlaylist") || "false";
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    const response = await axios
      .get("https://random-musics.herokuapp.com/api/v1/musics/top-views-day")
      .catch((err) => console.log(err));
    if (response) {
      dispatch(getPopular(response.data.data.data));
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);
  const checkMusicHearted = (id) => {
    let hasHeart = false;
    if (currentMusic) {
      myListHearts.map((item) => {
        if (item === id) {
          hasHeart = true;
        }
      });
    }
    return hasHeart;
  };
  const handleClickHeart = async (data) => {
    const loadingView = document.querySelector(".loading-opacity");
    const checkMusic = checkMusicHearted(data._id);
    if (!getUserLogin) {
      return toast.error("You must login to heart this music!!");
    } else if (getUserLogin && checkMusic === true) {
      return handleClickUnHeart(data);
    }
    try {
      if (loadingView) {
        loadingView.classList.remove("is-hide");
        loadingView.classList.add("is-show");
      }
      const updateHeart = await axios.post(`https://random-musics.herokuapp.com/api/v1/musics/${data._id}/hearts`);
      dispatch(getMyListHearts(data._id));
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
      const heartContainer = document.querySelector(".heart-opacity");
      if (heartContainer) {
        fetchAPI();
        heartContainer.style.opacity = 1;
        heartContainer.style.visibility = "visible";
        setTimeout(() => {
          heartContainer.style.opacity = 0;
          heartContainer.style.visibility = "hidden";
        }, 500);
      }
    } catch (err) {
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };
  // UNHEART
  const handleClickUnHeart = async (data) => {
    const loadingView = document.querySelector(".loading-opacity");
    const checkMusic = checkMusicHearted(data._id);
    if (!getUserLogin) {
      return toast.error("You must login to unheart this music!!");
    } else if (getUserLogin && checkMusic === false) {
      return toast.error("You must heart this music!!");
    }

    try {
      if (loadingView) {
        loadingView.classList.remove("is-hide");
        loadingView.classList.add("is-show");
      }
      const updateHeart = await axios.post(`https://random-musics.herokuapp.com/api/v1/hearts/delete`, {
        music: data._id,
      });
      dispatch(removeMyListHearts(data._id));
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
    } catch (err) {
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };

  const addPlayListToDB = async (data, userId) => {
    const loadingView = document.querySelector(".loading-opacity");
    try {
      if (loadingView) {
        loadingView.classList.remove("is-hide");
        loadingView.classList.add("is-show");
      }
      const response = await axios.post(`https://random-musics.herokuapp.com/api/v1/musics/${data._id}/playlists`);

      toast.success("Added your playlist!");
      dispatch(addMyPlaylistUser(data));
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
    } catch (err) {
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };

  const handleClickAddMusic = async (data) => {
    let check = true;
    if (!TokenAccount) {
      if (dataMyPlaylist && dataMyPlaylist.length > 0) {
        await dataMyPlaylist.forEach((item) => {
          if (item._id === data._id) {
            check = false;
          }
        });
      }
      if (check) {
        dispatch(addMyPlaylist(data));
        if (isPlayingPlaylist === "true") {
          const nextMusicId = findNextMusic(data);
          const previousMusicId = findPreviousMusic(data);

          if (nextMusicId !== undefined && previousMusicId !== undefined) {
            if (TokenAccount) {
              const nextMusic = dataMyPlaylistUser[nextMusicId];
              const previousMusic = dataMyPlaylistUser[previousMusicId];
              dispatch(setNextSelectedMusic(nextMusic));
              dispatch(setPreviousSelectedMusic(previousMusic));
            } else {
              const nextMusic = dataMyPlaylist[nextMusicId];
              const previousMusic = dataMyPlaylist[previousMusicId];
              dispatch(setNextSelectedMusic(nextMusic));
              dispatch(setPreviousSelectedMusic(previousMusic));
            }
          }
        }
        toast.success("Added your playlist!");
      } else {
        toast.error("You have added this music to your playlist!");
      }
    } else {
      if (dataMyPlaylistUser && dataMyPlaylistUser.length > 0) {
        await dataMyPlaylistUser.forEach((item) => {
          if (item._id === data._id) {
            check = false;
          }
        });
      }
      if (check) {
        addPlayListToDB(data, getUserLogin._id);
      } else {
        toast.error("You have added this music to your playlist!");
      }
    }
  };
  const handleChangeMusic = async (data) => {
    localStorage.setItem("isPlayingPlaylist", false);
    dispatch(setIsPlayingPlaylist(false));
    if (currentMusic._id !== data._id) {
      const findIndexCurrentMusic = dataMyPlaylistUser.findIndex((item) => item._id === data._id);
      if (findIndexCurrentMusic === -1) {
        localStorage.removeItem("nextSelectedMusic");
        localStorage.removeItem("previousSelectedMusic");
        dispatch(removeSelectedMusic());
        dispatch(setSelectedMusic(data));
        dispatch(removeNextSelectedMusic());
        dispatch(removePreviousSelectedMusic());
      } else {
        dispatch(removeSelectedMusic());
        dispatch(setSelectedMusic(data));
        const nextMusicId = findNextMusic(data, dataMyPlaylistUser, dataMyPlaylist);
        const previousMusicId = findPreviousMusic(data, dataMyPlaylistUser, dataMyPlaylist);
        if (nextMusicId !== undefined && previousMusicId !== undefined) {
          if (TokenAccount) {
            const nextMusic = dataMyPlaylistUser[nextMusicId];
            const previousMusic = dataMyPlaylistUser[previousMusicId];
            dispatch(setNextSelectedMusic(nextMusic));
            dispatch(setPreviousSelectedMusic(previousMusic));
          } else {
            const nextMusic = dataMyPlaylist[nextMusicId];
            const previousMusic = dataMyPlaylist[previousMusicId];
            dispatch(setNextSelectedMusic(nextMusic));
            dispatch(setPreviousSelectedMusic(previousMusic));
          }
        }
      }
      try {
        const updateView = await axios.post(
          `https://random-musics.herokuapp.com/api/v1/musics/${data._id}/update-views`
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <div className="box-popular">
        <span className="box-title">Popular</span>
        <div className="box-popular__">
          {dataMusic &&
            dataMusic.length === 0 &&
            Array.from({ length: 4 }).map((item, i) => {
              return (
                <SkeletonTheme baseColor="#464646" highlightColor="#191420" key={i}>
                  <div className="popular-item">
                    <div className="popular-item__image">
                      <Skeleton height={40} width={40} />
                    </div>
                    <div className="popular-item__desc">
                      <span className="popular-item__desc--name">
                        <Skeleton />
                      </span>
                      <span className="popular-item__desc--author">
                        <Skeleton />
                      </span>
                    </div>
                    <div className="popular-item__icon">
                      <Skeleton />
                    </div>
                  </div>
                </SkeletonTheme>
              );
            })}

          {dataMusic &&
            dataMusic.length > 0 &&
            dataMusic.map((item, i) => {
              return (
                <div
                  className="popular-item"
                  key={i}
                  style={currentMusic.id === item.id ? { backgroundColor: "#dbdbdb" } : null}
                >
                  <div className={i + 1 <= 3 ? `popular-item__number top${i + 1}` : "popular-item__number"}>
                    {i + 1}
                  </div>
                  <div className="popular-item__image" onClick={() => handleChangeMusic(item)}>
                    <div
                      className="popular-item__image--active"
                      style={currentMusic.id === item.id ? { opacity: "1" } : {}}
                    ></div>
                    <div
                      className="item-play_icon"
                      style={currentMusic.id === item.id ? { opacity: "1", border: "unset" } : {}}
                    >
                      {isAudioPlay ? (
                        <Audio
                          style={{
                            width: "50%",
                            height: "50%",
                          }}
                        />
                      ) : (
                        <i className="fa fa-play" aria-hidden="true" style={{ fontSize: "20px" }}></i>
                      )}
                    </div>
                    <img src={item.thumbnail} alt="" />
                  </div>
                  <div className="popular-item__desc">
                    <span className="popular-item__desc--name">{item.name}</span>
                    <span className="popular-item__desc--author">{item.artist[0].name}</span>
                  </div>
                  <div className="popular-item__icon">
                    <i
                      className="fa fa-heart heart-icon"
                      style={checkMusicHearted(item._id) ? { color: "#ff6e6e" } : { color: "" }}
                      onClick={() => handleClickHeart(item)}
                    >
                      {/* <div className="heart-icon__value">
                        <span>{item.hearts.length >= 9 ? "9+" : item.hearts.length}</span>
                      </div> */}
                    </i>
                    <AiOutlinePlus className="cursor-pointer" onClick={() => handleClickAddMusic(item)} />
                  </div>
                </div>
              );
            })}
          <div className="is-center">
            <Link className="more" to="/bang-xep-hang">
              Xem Thêm
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Popular;
