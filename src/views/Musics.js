import { useState, useEffect, useRef } from "react";
import "../styles/newmusic.scss";
import { Audio } from "react-loading-icons";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import errorAuth from "./utils/errorAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
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
  getMyListHeartsDetail,
  removeMyListHeartsDetail,
} from "../redux/actions";

import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { Link, useHistory } from "react-router-dom";
import { filterListHeartsDetail, checkMusicHearted } from "./utils/hearts";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
SwiperCore.use([Pagination, Navigation]);
const Musics = () => {
  let history = useHistory();
  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    currentUser = JSON.parse(currentUser);
  }
  const TokenAccount = localStorage.getItem("jwt");

  const [isLoading, setIsLoading] = useState(true);
  const getUserLogin = useSelector((state) => state.getUserLogin);
  const dataMusic = useSelector((state) => state.listMusic.data);
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const dataMyPlaylist = useSelector((state) => state.addMyPlaylist);
  const dataMyPlaylistUser = useSelector((state) => state.addMyPlaylistUser);
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
  const dispatch = useDispatch();
  const isPlayingPlaylist = localStorage.getItem("isPlayingPlaylist") || "false";

  const fetchAPI = async () => {
    try {
      const getAllMusics = axios.get("https://random-musics.herokuapp.com/api/v1/musics/");
      await Promise.all([getAllMusics]).then((data) => {
        localStorage.setItem("AllMusics", JSON.stringify(data[0].data.data.data));
        dispatch(getListMusic(data[0].data.data.data));
      });

      setIsLoading(false);
      if (getUserLogin) {
        let data = [];
        let dataListHeartsDetail = [];
        const response = await axios.get("https://random-musics.herokuapp.com/api/v1/hearts/user/" + getUserLogin._id);
        const dataFromDB = response.data.data.data;
        const myListHearts = localStorage.getItem("AllMusics") ? JSON.parse(localStorage.getItem("AllMusics")) : null;

        dataFromDB.map((item) => {
          let filterListHearts;
          if (myListHearts) {
            filterListHearts = myListHearts.filter((data) => data._id === item.music[0]);
            dataListHeartsDetail = [...dataListHeartsDetail, filterListHearts[0]];
          }
          data.push(item.music[0]);
          if (!checkMusicHearted(item.music[0], myListHearts) && filterListHearts) {
            dispatch(getMyListHearts(item.music[0]));
            // dispatch(getMyListHeartsDetail(filterListHearts[0]));
          }
        });
        localStorage.setItem("MyListHearts", JSON.stringify(data));
        localStorage.setItem("MyListHeartsDetail", JSON.stringify(dataListHeartsDetail));
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);

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

  const handleClickHeart = async (data) => {
    const loadingView = document.querySelector(".loading-opacity");
    const checkMusic = checkMusicHearted(data._id, myListHearts);
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
    const checkMusic = checkMusicHearted(data._id, myListHearts);
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
    const loadingView = document.querySelector(".loading-opacity");
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
        if (loadingView) {
          loadingView.classList.add("is-show");
          loadingView.classList.remove("is-hide");
        }
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
        setTimeout(() => {
          if (loadingView) {
            loadingView.classList.remove("is-show");
            loadingView.classList.add("is-hide");
            toast.success("Added your playlist!");
          }
        }, 200);
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
      <div className="ms-mainpage">
        <div className="box-new_music" style={{ marginTop: "80px" }}>
          <div className="box-header">
            <span className="box-title"># Music</span>
          </div>

          <div className="new-music" style={{ display: "flex", justifyContent: "center" }}>
            {isLoading &&
              Array.from({ length: 2 }).map((item, i) => {
                return (
                  <SkeletonTheme baseColor="#464646" highlightColor="#191420" key={i}>
                    <div className="new-music-item" style={{ width: "unset" }}>
                      <div className="item-thumbnail">
                        <Skeleton height={178} width={188} />
                      </div>
                      <div className="item-desc">
                        <span className="item-name">
                          <Skeleton />
                        </span>
                        <span className="item_desc">
                          <Skeleton />
                        </span>
                      </div>
                    </div>
                  </SkeletonTheme>
                );
              })}

            {!isLoading &&
              dataMusic &&
              dataMusic.length > 0 &&
              dataMusic.map((item, i) => {
                return (
                  <div className="new-music-item" style={{ width: "190px" }} key={i}>
                    <div className="item-thumbnail">
                      <div className="item-thumbnail_hover"></div>
                      <div className="item-play_icon">
                        <i
                          className="fa fa-heart"
                          style={checkMusicHearted(item._id, myListHearts) ? { color: "#ff6e6e" } : { color: "" }}
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
                            <i className="fa fa-play" aria-hidden="true" onClick={() => handleChangeMusic(item)}></i>
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
      </div>
    </>
  );
};
export default Musics;
