import { useState, useEffect, useRef } from "react";
import "../styles/newmusic.scss";

import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import errorAuth from "./utils/errorAuth";
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
} from "../redux/actions";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { useHistory } from "react-router-dom";
// Import Swiper styles
// import "swiper/swiper.scss";
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css";
// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

const NewMusic = () => {
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

  const dispatch = useDispatch();
  const isPlayingPlaylist = localStorage.getItem("isPlayingPlaylist") || "false";

  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/musics/new-musics");
      dispatch(getListMusic(response.data.data.data));
      setIsLoading(false);
      if (getUserLogin) {
        let data = [];
        const response = await axios.get("https://random-musics.herokuapp.com/api/v1/hearts/" + getUserLogin._id);
        const dataFromDB = response.data.data.data;
        dataFromDB.map((item) => {
          data.push(item.music[0]);
          if (!checkMusicHearted(item.music[0])) {
            dispatch(getMyListHearts(item.music[0]));
          }
        });
        localStorage.setItem("MyListHearts", JSON.stringify(data));
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

  const handleChangeMusic = (data) => {
    localStorage.setItem("isPlayingPlaylist", false);
    dispatch(setIsPlayingPlaylist(false));
    if (currentMusic._id !== data._id) {
      // const updateView = axios
      //   .post("http://localhost:8000/api/music/update_view", {
      //     id: data.id,
      //   })

      //   .catch(function (error) {
      //     console.log(error);
      //   });
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
    const checkMusic = checkMusicHearted(data._id);
    if (!getUserLogin) {
      return toast.error("You must login to heart this music!!");
    } else if (getUserLogin && checkMusic === true) {
      return toast.error("You have hearted this music!!");
    }

    try {
      let currentUser;
      if (localStorage.getItem("currentUser")) {
        currentUser = JSON.parse(localStorage.getItem("currentUser"))._id;
      }
      const axiosData = {
        user: currentUser,
        music: data._id,
      };
      const updateHeart = await axios.post(
        `https://random-musics.herokuapp.com/api/v1/musics/${data._id}/hearts`,
        axiosData
      );
      const test = dispatch(getMyListHearts(data.id));
      console.log(test);

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
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };
  const addPlayListToDB = async (data, userId) => {
    try {
      const response = await axios.post(`https://random-musics.herokuapp.com/api/v1/musics/${data._id}/playlists`, {
        user: [userId],
      });

      toast.success("Added your playlist!");
      dispatch(addMyPlaylistUser(data));
    } catch (err) {
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
      }
    }
  };
  return (
    <>
      <div className="box-new_music">
        <div className="box-header">
          <span className="box-title">New Music</span>
          <div className="box-right_icon">
            <FiArrowLeft />
            <FiArrowRight />
          </div>
        </div>

        <div className="new-music">
          {isLoading &&
            Array.from({ length: 5 }).map((item, i) => {
              return (
                <SkeletonTheme baseColor="#464646" highlightColor="#191420" key={i}>
                  <div className="category-item">
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
          {!isLoading && (
            <Swiper
              // slidesPerView={5}
              // spaceBetween={30}
              // slidesPerGroup={5}
              loop={false}
              loopFillGroupWithBlank={true}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                  slidesPerGroup: 2,
                },

                640: {
                  slidesPerView: 1,
                  spaceBetween: 5,
                  slidesPerGroup: 1,
                },
                780: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                  slidesPerGroup: 2,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                  slidesPerGroup: 5,
                },
              }}
              className="new-music_slider"
            >
              {dataMusic &&
                dataMusic.length > 0 &&
                dataMusic.map((item, i) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="new-music-item">
                        <div className="item-thumbnail">
                          <div className="item-thumbnail_hover"></div>
                          <div className="item-play_icon">
                            <i className="fa fa-heart" onClick={() => handleClickHeart(item)}></i>
                            <div className="item-thumbnail__icon--play">
                              <i className="fa fa-play" aria-hidden="true" onClick={() => handleChangeMusic(item)}></i>
                            </div>
                            <AiOutlinePlus onClick={() => handleClickAddMusic(item)} />
                          </div>
                          <img src={item.info[0].thumbnail} alt="" />
                        </div>
                        <div className="item-desc">
                          <span className="item-name">
                            <a title={item.info[0].name}>{item.info[0].name}</a>
                          </span>
                          <span className="item_desc">{item.artist[0].name}</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
};
export default NewMusic;
