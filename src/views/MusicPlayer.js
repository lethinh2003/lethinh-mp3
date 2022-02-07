import "../styles/musicplayer.scss";
import { Audio } from "react-loading-icons";
import MenuRight from "../views/MenuRight";
import FullView from "./FullView";
import { MdQueueMusic } from "react-icons/md";
import { RiPlayListLine } from "react-icons/ri";
import { BsVolumeUp } from "react-icons/bs";
import { toast } from "react-toastify";
import APIMusic from "../api/APIMusic";
import { AiOutlinePlus } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import errorAuth from "./utils/errorAuth";
import axios from "axios";
import {
  getStatusSelectedMusic,
  setSelectedMusic,
  removeSelectedMusic,
  getDuration,
  setNextSelectedMusic,
  setPreviousSelectedMusic,
  getMyListHearts,
  getUserLogin,
} from "../redux/actions";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
const MusicPlayer = () => {
  const dataListMusic = useSelector((state) => state.listMusic.data);
  const dataMusicUser = useSelector((state) => state.addMyPlaylistUser);
  const dataMusic = useSelector((state) => state.addMyPlaylist);
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const [isChooseMusic, setIsChooseMusic] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [fullView, setFullView] = useState();
  const [isOpenMenuRight, setIsOpenMenuRight] = useState(false);
  const [musicPlayer, setMusicPlayer] = useState();
  const [navDown, setNavDown] = useState();

  const [musicInfo, setMusicInfo] = useState();
  const [navi, setNavi] = useState();
  const [menuRight, setMenuRight] = useState();
  const [cd, setCd] = useState();
  const [deg, setDeg] = useState(0);
  const [timeRight, setTimeRight] = useState("");
  const musicPlayerHide = useRef("");
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const getMusicDuration = useSelector((state) => state.getDuration.data);
  const TokenAccount = localStorage.getItem("jwt");
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
  const accessAccount = useSelector((state) => state.accessAccount);
  const isPlayingPlaylist = useSelector((state) => state.isPlayingPlaylist);
  const nextMusic = useSelector((state) => state.setNextSelectedMusic.data);
  const previousMusic = useSelector((state) => state.setPreviousSelectedMusic.data);
  const getUserLogin = useSelector((state) => state.getUserLogin);
  const dispatch = useDispatch();
  const audioPlay = document.querySelector("audio");

  useEffect(() => {
    //Set DOM
    const navi = document.querySelector(".navigation");
    const musicPlayer = document.querySelector(".music-player");
    const musicInfo = document.querySelector(".music-info");
    const navDown = document.querySelector(".turn-off_fullview");
    const menuRight = document.querySelector(".ms-sidebar");
    const fullView = document.querySelector(".fullview");
    setFullView(fullView);
    setMenuRight(menuRight);
    setNavi(navi);
    setNavDown(navDown);
    setMusicPlayer(musicPlayer);
    setMusicInfo(musicInfo);
  }, []);
  useEffect(() => {
    //Have current music
    if (Array.isArray(currentMusic) === false && navi && musicPlayer) {
      //Set LocalStorage Music Heart
      // const getStore = JSON.parse(localStorage.getItem(currentMusic.id));
      // if (getStore === null) {
      //   const newStore = {
      //     heart: 0,
      //   };
      //   localStorage.setItem(currentMusic.id, JSON.stringify(newStore));
      // }

      //Set Show Music Bar
      musicPlayer.style = `transform: translateY(0px);`;
      navi.style.height = "calc(100% - 90px)";
    }

    //Haven't Current Music
    else if (Array.isArray(currentMusic) === true && navi && musicPlayer) {
      //Set Hide Music Bar
      musicPlayer.style = `transform: translateY(100%);`;
      navi.style.height = "100%";
    }
  }, []);

  const openFullScreenPlayer = () => {
    if (musicPlayer && isFullView === false && fullView) {
      musicPlayer.style = ` transform: translateY(100%);`;
      fullView.style = `transform: translateY(0);`;
      setIsFullView(true);
    }
  };

  const handleOpenMenuRight = (e) => {
    e.stopPropagation();
    setIsOpenMenuRight(!isOpenMenuRight);
  };
  const handleCloseFullView = (data) => {
    if (musicPlayer && isFullView === true && fullView) {
      fullView.style = `transform: translateY(100%);`;
      musicPlayer.style = `transform: translateY(0);`;
      setIsFullView(data);
    }
  };

  const handleUpdateCurrentMusic = (data) => {
    if (isPlayingPlaylist) {
      if (accessAccount && dataMusicUser.length > 1) {
        dispatch(removeSelectedMusic());
        dispatch(setSelectedMusic(data));
        setIsChooseMusic(true);
        const nextMusicId = findNextMusic(data, dataMusicUser, dataMusic);
        const previousMusicId = findPreviousMusic(data, dataMusicUser, dataMusic);
        if (nextMusicId !== undefined && previousMusicId !== undefined) {
          const nextMusic = dataMusicUser[nextMusicId];
          const previousMusic = dataMusicUser[previousMusicId];
          dispatch(setNextSelectedMusic(nextMusic));
          dispatch(setPreviousSelectedMusic(previousMusic));
        }
      }
      if (!accessAccount && dataMusic.length > 1) {
        dispatch(removeSelectedMusic());
        dispatch(setSelectedMusic(data));
        setIsChooseMusic(true);
        const nextMusicId = findNextMusic(data, dataMusicUser, dataMusic);
        const previousMusicId = findPreviousMusic(data, dataMusicUser, dataMusic);
        if (nextMusicId !== undefined && previousMusicId !== undefined) {
          const nextMusic = dataMusic[nextMusicId];
          const previousMusic = dataMusic[previousMusicId];
          dispatch(setNextSelectedMusic(nextMusic));
          dispatch(setPreviousSelectedMusic(previousMusic));
        }
      }
    }
  };

  const handleUpdateStatusAudio = (data) => {
    dispatch(getStatusSelectedMusic(data));
  };
  const getStoreMusic = JSON.parse(localStorage.getItem("musicTime"));
  if (getStoreMusic) {
    // console.log(getStoreMusic.data.repeatMusic);
  }

  //Handle Change Value Music
  const handleChangeValue = (e) => {
    e.stopPropagation();
    if (audioPlay && getMusicDuration && getMusicDuration.minutesDuration && Array.isArray(currentMusic) === false) {
      const changeValue = (audioPlay.duration / 100) * e.target.value;
      audioPlay.currentTime = changeValue;
      //set redux
      // const newStoreRedux = {
      //   valueCurrent: e.target.value,
      // };
      // dispatch(getDuration(newStoreRedux));
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
  const handleClickHeart = async (data, e) => {
    e.stopPropagation();
    const loadingView = document.querySelector(".loading-opacity");
    const checkMusic = checkMusicHearted(data._id);
    if (!getUserLogin) {
      return toast.error("You must login to heart this music!!");
    } else if (getUserLogin && checkMusic === true) {
      console.log(checkMusic);
      return toast.error("You have hearted this music!!");
    }
    try {
      if (Array.isArray(currentMusic) === false) {
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
          heartContainer.style.opacity = 1;
          heartContainer.style.visibility = "visible";
          setTimeout(() => {
            heartContainer.style.opacity = 0;
            heartContainer.style.visibility = "hidden";
          }, 500);
        }
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
  // useEffect(() => {
  //   if (Array.isArray(currentMusic) === false) {
  //     const heart = document.querySelector(".fa-heart");
  //     let getStore = JSON.parse(localStorage.getItem(currentMusic.id));
  //     if (heart) {
  //       if (getStore.heart > 0) {
  //         heart.classList.add("clicked");
  //       } else {
  //         heart.classList.remove("clicked");
  //       }
  //     }
  //   }
  // });
  //On/Off music
  const handleOnOffMusic = (e) => {
    e.stopPropagation();
    if (Array.isArray(currentMusic) === false && getMusicDuration.minutesDuration) {
      if (isAudioPlay) {
        dispatch(getStatusSelectedMusic(false));
        handleUpdateStatusAudio(false);
        audioPlay.pause();
      } else {
        dispatch(getStatusSelectedMusic(true));
        handleUpdateStatusAudio(true);
        audioPlay.play();
      }
    }
  };
  //Click Pre Music
  const handleClickPrevious = (e) => {
    e.stopPropagation();
    handleUpdateCurrentMusic(previousMusic);
  };

  //Click Next Music
  const handleClickNext = (e) => {
    e.stopPropagation();
    handleUpdateCurrentMusic(nextMusic);
  };

  return (
    <>
      <FullView
        currentMusic={currentMusic}
        handleCloseFullView={handleCloseFullView}
        handleUpdateStatusAudio={handleUpdateStatusAudio}
        listCurrentMusic={dataListMusic}
        handleSetCurrentMusic={handleUpdateCurrentMusic}
      />
      <div className="open-playlist" onClick={(e) => handleOpenMenuRight(e)}>
        <MdQueueMusic />
      </div>

      <div
        className="music-player"
        style={
          Array.isArray(currentMusic) === true ? { transform: "translateY(100%)" } : { transform: "translateY(0px)" }
        }
        onClick={() => openFullScreenPlayer()}
      >
        {Array.isArray(currentMusic) === false && (
          <>
            {/* Music Information */}
            <div className="music-info">
              <div className="music-info__image">
                <div
                  className="music-info__image--icon-play"
                  style={isAudioPlay ? { display: "block" } : { display: "none" }}
                >
                  <Audio
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <img src={currentMusic.thumbnail} alt="" />
              </div>
              <div className="music-info__desc">
                <span className="music-info__desc--name">{currentMusic.name}</span>
                <span className="music-info__desc--author">{currentMusic.artist[0].name}</span>
              </div>
              <div className="music-info__icon">
                <i
                  className={!isAudioPlay ? "fa play-icon fa-play" : "fa play-icon fa-pause"}
                  aria-hidden="true"
                  onClick={(e) => handleOnOffMusic(e)}
                ></i>
                <i className="fa fa-heart" onClick={(e) => handleClickHeart(currentMusic, e)}></i>
                <AiOutlinePlus />
              </div>
            </div>
            {/* Music Process Bar */}
            <audio id="audio" src={currentMusic.link}></audio>
            <div className="music-process">
              <div className="playbar-top">
                <i className="fa fa-step-backward" aria-hidden="true" onClick={(e) => handleClickPrevious(e)}></i>
                <div className="playbar-top__icon--play">
                  <i
                    className={!isAudioPlay ? "fa play-icon fa-play" : "fa play-icon fa-pause"}
                    aria-hidden="true"
                    onClick={(e) => handleOnOffMusic(e)}
                  ></i>
                </div>

                <i className="fa fa-step-forward" aria-hidden="true" onClick={(e) => handleClickNext(e)}></i>
              </div>
              <div className="playbar-bottom">
                <span className="playbar-bottom__time--left">
                  {getMusicDuration && getMusicDuration.minutesCurrent ? getMusicDuration.minutesCurrent : "0"}:
                  {getMusicDuration && getMusicDuration.secondsCurrent ? getMusicDuration.secondsCurrent : "00"}
                </span>
                <input
                  onChange={(e) => handleChangeValue(e)}
                  type="range"
                  className="range"
                  name="vol"
                  value={getMusicDuration && getMusicDuration.valueCurrent ? getMusicDuration.valueCurrent : "0"}
                  min="0"
                  max="100"
                />
                <span className="playbar-bottom__time--right">
                  {getMusicDuration && getMusicDuration.minutesDuration ? getMusicDuration.minutesDuration : "0"}:
                  {getMusicDuration && getMusicDuration.secondsDuration ? getMusicDuration.secondsDuration : "00"}
                </span>
              </div>
            </div>
            {/* Control Music */}
            <div className="music-control">
              <div className="music-control__playlists">
                <RiPlayListLine />
              </div>
            </div>
          </>
        )}
      </div>

      <MenuRight
        listCurrentMusic={dataListMusic}
        currentMusic={currentMusic}
        isOpenMenuRight={isOpenMenuRight}
        handleUpdateCurrentMusic={handleUpdateCurrentMusic}
      />
    </>
  );
};
export default MusicPlayer;
