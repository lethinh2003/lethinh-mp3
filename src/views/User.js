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
  getMyListHeartsDetail,
  removeMyListHeartsDetail,
} from "../redux/actions";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import errorAuth from "./utils/errorAuth";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import { Audio } from "react-loading-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { AiOutlinePlus } from "react-icons/ai";
SwiperCore.use([Pagination, Navigation]);
const User = () => {
  let history = useHistory();
  const currentUser = localStorage.getItem("currentUser");
  const [profileUser, setProfileUser] = useState("");
  const TokenAccount = localStorage.getItem("jwt");
  const dataMyListHeartsDetail = useSelector((state) => state.getMyListHeartsDetail);
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
      const myListHearts = localStorage.getItem("MyListHearts");
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
  const filterListHeartsDetail = (id) => {
    const myListHearts = localStorage.getItem("AllMusics") ? JSON.parse(localStorage.getItem("AllMusics")) : null;
    let filterListHearts;
    if (myListHearts) {
      filterListHearts = myListHearts.filter((data) => data._id === id);
    }
    return filterListHearts;
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
  const checkMusicHearted = (id) => {
    let hasHeart = false;
    myListHearts.map((item) => {
      if (item === id) {
        hasHeart = true;
      }
    });
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
      const musicHeartsDetail = filterListHeartsDetail(data._id);
      if (musicHeartsDetail) {
        dispatch(getMyListHeartsDetail(musicHeartsDetail[0]));
      }
      if (loadingView) {
        loadingView.classList.add("is-hide");
        loadingView.classList.remove("is-show");
      }
      const heartContainer = document.querySelector(".heart-opacity");
      if (heartContainer) {
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
      dispatch(removeMyListHeartsDetail(data._id));
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
        addPlayListToDB(data, currentUser._id);
      } else {
        toast.error("You have added this music to your playlist!");
      }
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
                <a title={profileUser.name}>
                  <span className="header__info--name">{profileUser.name}</span>
                </a>
                <span className="header__info--desc">
                  PLAYLIST: {dataMyPlaylistUser.length} musics. FOVORITE: {dataMyListHeartsDetail.length} musics
                </span>
              </div>
            </div>
            <div className="box-profile__body">
              <div className="box-new_music" style={{ padding: "unset" }}>
                <div className="box-header">
                  <span className="box-title">Playlists</span>
                </div>
                <div className="new-music__mobile">
                  <div className="new-music__mobile--wrapper">
                    {dataMyPlaylistUser &&
                      dataMyPlaylistUser.length > 0 &&
                      dataMyPlaylistUser.map((item, i) => {
                        return (
                          <div className="new-music-item__mobile" key={i}>
                            <div className="item-thumbnail">
                              <div className="item-thumbnail_hover"></div>
                              <div className="item-play_icon">
                                <i
                                  className="fa fa-heart"
                                  style={
                                    checkMusicHearted(item._id, myListHearts) ? { color: "#ff6e6e" } : { color: "" }
                                  }
                                  onClick={() => handleClickHeart(item)}
                                ></i>
                                <div className="item-thumbnail__icon--play">
                                  {currentMusic._id === item._id && isAudioPlay ? (
                                    <Audio
                                      style={{
                                        width: "50%",
                                        height: "50%",
                                      }}
                                    />
                                  ) : (
                                    <i
                                      className="fa fa-play"
                                      aria-hidden="true"
                                      onClick={() => handleChangeMusic(item)}
                                    ></i>
                                  )}
                                </div>
                                <AiOutlinePlus onClick={() => handleClickAddMusic(item)} />
                              </div>
                              <img src={item.thumbnail} alt="" />
                            </div>
                            <div className="item-desc">
                              <span className="item-name">
                                <a title={item.name}>{item.name}</a>
                              </span>
                              <span className="item_desc">{item.artist[0].name}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <Swiper
                  loop={false}
                  loopFillGroupWithBlank={true}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                      slidesPerGroup: 1,
                    },
                    390: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                      slidesPerGroup: 2,
                    },
                    540: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                      slidesPerGroup: 3,
                    },

                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                      slidesPerGroup: 4,
                    },
                    1280: {
                      slidesPerView: 6,
                      spaceBetween: 10,
                      slidesPerGroup: 6,
                    },
                  }}
                  className="new-music_slider"
                >
                  {dataMyPlaylistUser &&
                    dataMyPlaylistUser.length > 0 &&
                    dataMyPlaylistUser.map((item, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <div className="new-music-item">
                            <div className="item-thumbnail">
                              <div className="item-thumbnail_hover"></div>
                              <div className="item-play_icon">
                                <i
                                  className="fa fa-heart"
                                  style={checkMusicHearted(item._id) ? { color: "#ff6e6e" } : { color: "" }}
                                  onClick={() => handleClickHeart(item)}
                                ></i>
                                <div className="item-thumbnail__icon--play">
                                  {currentMusic._id === item._id && isAudioPlay ? (
                                    <Audio
                                      style={{
                                        width: "50%",
                                        height: "50%",
                                      }}
                                    />
                                  ) : (
                                    <i
                                      className="fa fa-play"
                                      aria-hidden="true"
                                      onClick={() => handleChangeMusic(item)}
                                    ></i>
                                  )}
                                </div>
                                <AiOutlinePlus onClick={() => handleClickAddMusic(item)} />
                              </div>
                              <img src={item.thumbnail} alt="" />
                            </div>
                            <div className="item-desc">
                              <span className="item-name">
                                <a title={item.name}>{item.name}</a>
                              </span>
                              <span className="item_desc">{item.artist[0].name}</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
              <div className="box-new_music" style={{ padding: "unset" }}>
                <div className="box-header">
                  <span className="box-title">Favorite Musics</span>
                </div>
                <div className="new-music__mobile">
                  <div className="new-music__mobile--wrapper">
                    {dataMyListHeartsDetail &&
                      dataMyListHeartsDetail.length > 0 &&
                      dataMyListHeartsDetail.map((item, i) => {
                        return (
                          <div className="new-music-item__mobile" key={i}>
                            <div className="item-thumbnail">
                              <div className="item-thumbnail_hover"></div>
                              <div className="item-play_icon">
                                <i
                                  className="fa fa-heart"
                                  style={
                                    checkMusicHearted(item._id, myListHearts) ? { color: "#ff6e6e" } : { color: "" }
                                  }
                                  onClick={() => handleClickHeart(item)}
                                ></i>
                                <div className="item-thumbnail__icon--play">
                                  {currentMusic._id === item._id && isAudioPlay ? (
                                    <Audio
                                      style={{
                                        width: "50%",
                                        height: "50%",
                                      }}
                                    />
                                  ) : (
                                    <i
                                      className="fa fa-play"
                                      aria-hidden="true"
                                      onClick={() => handleChangeMusic(item)}
                                    ></i>
                                  )}
                                </div>
                                <AiOutlinePlus onClick={() => handleClickAddMusic(item)} />
                              </div>
                              <img src={item.thumbnail} alt="" />
                            </div>
                            <div className="item-desc">
                              <span className="item-name">
                                <a title={item.name}>{item.name}</a>
                              </span>
                              <span className="item_desc">{item.artist[0].name}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <Swiper
                  loop={false}
                  loopFillGroupWithBlank={true}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                      slidesPerGroup: 1,
                    },
                    390: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                      slidesPerGroup: 2,
                    },
                    540: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                      slidesPerGroup: 3,
                    },

                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                      slidesPerGroup: 4,
                    },
                    1280: {
                      slidesPerView: 6,
                      spaceBetween: 10,
                      slidesPerGroup: 6,
                    },
                  }}
                  className="new-music_slider"
                >
                  {dataMyListHeartsDetail &&
                    dataMyListHeartsDetail.length > 0 &&
                    dataMyListHeartsDetail.map((item, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <div className="new-music-item">
                            <div className="item-thumbnail">
                              <div className="item-thumbnail_hover"></div>
                              <div className="item-play_icon">
                                <i
                                  className="fa fa-heart"
                                  style={checkMusicHearted(item._id) ? { color: "#ff6e6e" } : { color: "" }}
                                  onClick={() => handleClickHeart(item)}
                                ></i>
                                <div className="item-thumbnail__icon--play">
                                  {currentMusic._id === item._id && isAudioPlay ? (
                                    <Audio
                                      style={{
                                        width: "50%",
                                        height: "50%",
                                      }}
                                    />
                                  ) : (
                                    <i
                                      className="fa fa-play"
                                      aria-hidden="true"
                                      onClick={() => handleChangeMusic(item)}
                                    ></i>
                                  )}
                                </div>
                                <AiOutlinePlus onClick={() => handleClickAddMusic(item)} />
                              </div>
                              <img src={item.thumbnail} alt="" />
                            </div>
                            <div className="item-desc">
                              <span className="item-name">
                                <a title={item.name}>{item.name}</a>
                              </span>
                              <span className="item_desc">{item.artist[0].name}</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default User;
