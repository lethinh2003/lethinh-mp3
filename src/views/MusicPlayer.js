import "../styles/musicplayer.scss";
import { Audio } from "react-loading-icons";
import MenuRight from "../views/MenuRight";
import FullView from "./FullView";
import { MdQueueMusic } from "react-icons/md";
import { BiVolumeFull, BiVolumeLow, BiVolumeMute } from "react-icons/bi";
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
  removeMyListHearts,
  getUserLogin,
  getMyListHeartsDetail,
  removeMyListHeartsDetail,
  addMyPlaylist,
  addMyPlaylistUser,
} from "../redux/actions";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import { filterListHeartsDetail, checkMusicHearted } from "./utils/hearts";
import { Slider, IconButton } from "@mui/material";
import { PlayArrowRounded, PauseRounded, FastForwardRounded, FastRewindRounded } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
const MusicPlayer = () => {
  const dataMyPlaylist = useSelector((state) => state.addMyPlaylist);
  const dataMyPlaylistUser = useSelector((state) => state.addMyPlaylistUser);
  const dataListMusic = useSelector((state) => state.listMusic.data);
  const dataMusicUser = useSelector((state) => state.addMyPlaylistUser);
  const dataMusic = useSelector((state) => state.addMyPlaylist);
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const [isChooseMusic, setIsChooseMusic] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [fullView, setFullView] = useState();
  const [isOpenMenuRight, setIsOpenMenuRight] = useState(false);
  const [isMouseValue, setIsMouseValue] = useState(false);
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
  const [musicVolume, setMusicVolume] = useState(1);
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

  const handleClickHeart = async (data, e) => {
    e.stopPropagation();
    const loadingView = document.querySelector(".loading-opacity");
    const checkMusic = checkMusicHearted(data._id, myListHearts);
    if (!getUserLogin) {
      return toast.error("You must login to heart this music!!");
    } else if (getUserLogin && checkMusic === true) {
      return handleClickUnHeart(data);
    }
    try {
      if (Array.isArray(currentMusic) === false) {
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
  const handleChangeVolume = (e) => {
    if (audioPlay) {
      setMusicVolume(e.target.value);
      audioPlay.volume = e.target.value;
    }
  };
  const handleClickAddMusic = async (data, e) => {
    e.stopPropagation();
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
  const handleChangeValueMouseDown = () => {
    setIsMouseValue(true);
  };
  const handleChangeValueMouseLeave = () => {
    setIsMouseValue(false);
  };
  return (
    <>
      <FullView
        musicVolume={musicVolume}
        handleChangeVolume={handleChangeVolume}
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
        onClick={!isMouseValue ? () => openFullScreenPlayer() : null}
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
                <IconButton aria-label="favorite music" onClick={(e) => handleClickHeart(currentMusic, e)}>
                  <FavoriteIcon
                    fontSize="small"
                    color={checkMusicHearted(currentMusic._id, myListHearts) ? "error" : "inherit"}
                  />
                </IconButton>
                <IconButton aria-label="add music" onClick={(e) => handleClickAddMusic(currentMusic, e)}>
                  <AddIcon fontSize="small" />
                </IconButton>
                {/* <AiOutlinePlus onClick={(e) => handleClickAddMusic(currentMusic, e)} /> */}
              </div>
            </div>
            {/* Music Process Bar */}

            <audio id="audio" src={currentMusic.link}></audio>
            <div className="music-process">
              <div className="playbar-top">
                <IconButton aria-label="previous song" onClick={(e) => handleClickPrevious(e)}>
                  <FastRewindRounded fontSize="large" />
                </IconButton>
                <div className="playbar-top__icon--play">
                  <IconButton
                    color="inherit"
                    aria-label={!isAudioPlay ? "play" : "pause"}
                    onClick={(e) => handleOnOffMusic(e)}
                  >
                    {!isAudioPlay ? (
                      <PlayArrowRounded color="#ffffff" sx={{ fontSize: "2rem" }} />
                    ) : (
                      <PauseRounded sx={{ fontSize: "2rem" }} />
                    )}
                  </IconButton>
                  {/* <i
                    className={!isAudioPlay ? "fa play-icon fa-play" : "fa play-icon fa-pause"}
                    aria-hidden="true"
                    onClick={(e) => handleOnOffMusic(e)}
                  ></i> */}
                </div>
                <IconButton aria-label="previous song" onClick={(e) => handleClickNext(e)}>
                  <FastForwardRounded fontSize="large" />
                </IconButton>
              </div>
              <div className="playbar-bottom">
                <span className="playbar-bottom__time--left">
                  {getMusicDuration && getMusicDuration.minutesCurrent ? getMusicDuration.minutesCurrent : "0"}:
                  {getMusicDuration && getMusicDuration.secondsCurrent ? getMusicDuration.secondsCurrent : "00"}
                </span>
                <Slider
                  className="range"
                  onMouseDown={() => handleChangeValueMouseDown()}
                  onMouseLeave={() => handleChangeValueMouseLeave()}
                  onChange={(e) => handleChangeValue(e)}
                  value={getMusicDuration && getMusicDuration.valueCurrent ? getMusicDuration.valueCurrent : "0"}
                  size="small"
                  aria-label="Small"
                />

                <span className="playbar-bottom__time--right">
                  {getMusicDuration && getMusicDuration.minutesDuration ? getMusicDuration.minutesDuration : "0"}:
                  {getMusicDuration && getMusicDuration.secondsDuration ? getMusicDuration.secondsDuration : "00"}
                </span>
              </div>
            </div>
            {/* Control Music */}
            <div className="music-control">
              <div className="music-control__volume">
                <div className="volume-icon">
                  {musicVolume >= 1 ? (
                    <BiVolumeFull />
                  ) : musicVolume > 0 && musicVolume < 1 ? (
                    <BiVolumeLow />
                  ) : (
                    <BiVolumeMute />
                  )}
                </div>
                <Slider
                  sx={{ ml: 1 }}
                  size="small"
                  className="range-volume"
                  onMouseDown={() => handleChangeValueMouseDown()}
                  onMouseLeave={() => handleChangeValueMouseLeave()}
                  onChange={(e) => handleChangeVolume(e)}
                  aria-label="Volume"
                  min={0}
                  max={1}
                  step={0.1}
                  value={musicVolume}
                />
                {/* <input
                  onMouseDown={() => handleChangeValueMouseDown()}
                  onMouseLeave={() => handleChangeValueMouseLeave()}
                  onChange={(e) => handleChangeVolume(e)}
                  type="range"
                  id="volumn"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                /> */}
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
