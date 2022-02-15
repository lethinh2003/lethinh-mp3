import "../styles/fullview.scss";
import { useState, useEffect, useRef } from "react";
import { BiVolumeFull, BiVolumeLow, BiVolumeMute } from "react-icons/bi";
import { Audio } from "react-loading-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getStatusSelectedMusic,
  setPreviousSelectedMusic,
  setNextSelectedMusic,
  getDuration,
  accessAccount,
  setSelectedMusic,
  removeSelectedMusic,
} from "../redux/actions";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
const FullView = (props) => {
  let {
    handleSetCurrentMusic,
    currentMusic,
    handleCloseFullView,
    handleUpdateStatusAudio,
    listCurrentMusic,
    musicVolume,
    handleChangeVolume,
  } = props;

  const [count, setCount] = useState(0);
  const [minutesCurrent, setMinutesCurrent] = useState(0);
  const [secondsCurrent, setSecondsCurrent] = useState(0);
  const [minutesDuration, setMinutesDuration] = useState(0);
  const [secondsDuration, setSecondsDuration] = useState(0);
  const [valueCurrent, setValueCurrent] = useState(0);

  const [isAutoNext, setIsAutoNext] = useState(false);
  const [isRepeatMusic, setIsRepeatMusic] = useState(false);
  const iconNextMusic = useRef(null);
  const iconPreviousMusic = useRef(null);
  const audioPlay = useRef(null);
  const iconRepeat = useRef(null);
  const iconAutoNext = useRef(null);

  //Get Data From Redux
  const dataMusicUser = useSelector((state) => state.addMyPlaylistUser);
  const dataMusic = useSelector((state) => state.addMyPlaylist);
  const dataSelectedMusic = useSelector((state) => state.selectedMusic.data);
  const getMusicDuration = useSelector((state) => state.getDuration.data);
  const accessAccount = useSelector((state) => state.accessAccount);
  const isPlayingPlaylist = useSelector((state) => state.isPlayingPlaylist);
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
  const nextMusic = useSelector((state) => state.setNextSelectedMusic.data);
  const previousMusic = useSelector((state) => state.setPreviousSelectedMusic.data);

  const dispatch = useDispatch();

  useEffect(() => {
    let updateRealTime = setInterval(updateTime);
    if (Array.isArray(currentMusic) === false && audioPlay.current && isAudioPlay) {
      document.title = "You are listening " + currentMusic.name;
      const audioPromise = audioPlay.current.play();
      if (audioPromise !== undefined) {
        audioPromise
          .then(() => {
            audioPlay.current.play();
            handleUpdateStatusAudio(true);
          })
          .catch((error) => {});
      }
      dispatch(getStatusSelectedMusic(true)); // set isAudioPlay = true
    }

    return () => {
      clearInterval(updateRealTime);
    };
  }, [currentMusic]);

  useEffect(() => {
    let updateRealTime;
    if (isAudioPlay) {
      updateRealTime = setInterval(updateTime);
      document.title = "You are listening " + currentMusic.name;
    }
    //Update Real Time
    if (!isAudioPlay && updateRealTime) {
      clearInterval(updateRealTime);
    }

    return () => {
      clearInterval(updateRealTime);
    };
  }, [currentMusic, isAudioPlay]);
  const updateTime = () => {
    if (audioPlay.current) {
      let getMinutes = Math.floor(audioPlay.current.duration / 60);
      let getSeconds = Math.floor(audioPlay.current.duration - getMinutes * 60);
      if (getSeconds < 10) {
        getSeconds = "0" + getSeconds;
      } else {
        getSeconds = getSeconds;
      }
      let getMinutesCurrent = Math.floor(audioPlay.current.currentTime / 60);
      let getSecondsCurrent = Math.floor(audioPlay.current.currentTime - getMinutesCurrent * 60);
      if (getSecondsCurrent < 10) {
        getSecondsCurrent = "0" + getSecondsCurrent;
      } else {
        getSecondsCurrent = getSecondsCurrent;
      }
      const valueCurrent = Math.floor((audioPlay.current.currentTime / audioPlay.current.duration) * 100);
      setMinutesCurrent(getMinutesCurrent);
      setSecondsCurrent(getSecondsCurrent);
      setMinutesDuration(getMinutes);
      setSecondsDuration(getSeconds);
      setValueCurrent(valueCurrent);
      if (isRepeatMusic) {
        if (valueCurrent >= 100) {
          audioPlay.current.play();
          audioPlay.current.currentTime = 0;
        }
      } else {
        if (!isAutoNext && valueCurrent >= 100) {
          audioPlay.current.pause();
          dispatch(getStatusSelectedMusic(false));
          handleUpdateStatusAudio(false);
          audioPlay.current.currentTime = 0;
        } else if (isAutoNext && valueCurrent >= 100) {
          // clearInterval(updateRealTime);

          audioPlay.current.pause();

          dispatch(getStatusSelectedMusic(false));
          handleUpdateStatusAudio(false);
          setTimeout(() => {
            audioPlay.current.currentTime = 0;
            handleUpdateCurrentMusic(nextMusic);
          }, 1000);
        }
      }
      // set local storage
      const newStore = {
        data: {
          minutesDuration: getMinutes,
          secondsDuration: getSeconds,
          minutesCurrent: getMinutesCurrent,
          secondsCurrent: getSecondsCurrent,
          valueCurrent: valueCurrent,
          musicVolume: musicVolume,
          repeatMusic: isRepeatMusic,
          autoNextMusic: isAutoNext,
        },
      };
      localStorage.setItem("musicTime", JSON.stringify(newStore));

      //set redux
      const newStoreRedux = {
        minutesDuration: getMinutes,
        secondsDuration: getSeconds,
        minutesCurrent: getMinutesCurrent,
        secondsCurrent: getSecondsCurrent,
        valueCurrent: valueCurrent,
        musicVolume: musicVolume,
        repeatMusic: isRepeatMusic,
        autoNextMusic: isAutoNext,
      };
      dispatch(getDuration(newStoreRedux));
    }
  };
  const handleUpdateCurrentMusic = (data) => {
    if (isPlayingPlaylist) {
      if (accessAccount && dataMusicUser.length > 1) {
        // dispatch(removeSelectedMusic());
        dispatch(setSelectedMusic(data));

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
        // dispatch(removeSelectedMusic());
        dispatch(setSelectedMusic(data));

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
  //Handle Change Value Music
  const handleChangeValue = (e) => {
    if (audioPlay.current && getMusicDuration.minutesDuration && Array.isArray(currentMusic) === false) {
      const changeValue = (audioPlay.current.duration / 100) * e.target.value;
      setValueCurrent(e.target.value);
      audioPlay.current.currentTime = changeValue;
    }
  };

  //Change Repeat Music Status
  const handleChangeRepeatMusic = () => {
    if (iconRepeat.current && isRepeatMusic === true) {
      iconRepeat.current.style = "";
    } else if (iconRepeat.current && isRepeatMusic === false) {
      iconRepeat.current.style = "color: #b55fe2;";
    }
    //set redux
    const newStoreRedux = {
      repeatMusic: !isRepeatMusic,
    };
    // dispatch(getDuration(newStoreRedux));
    setIsRepeatMusic(!isRepeatMusic);
  };

  //Hanlde Close Full View
  const handleClickCloseFullView = () => {
    handleCloseFullView(false);
  };

  //On/Off music
  const handleOnOffMusic = () => {
    if (Array.isArray(currentMusic) === false) {
      if (isAudioPlay) {
        dispatch(getStatusSelectedMusic(false));
        handleUpdateStatusAudio(false);
        audioPlay.current.pause();
      } else {
        dispatch(getStatusSelectedMusic(true));
        handleUpdateStatusAudio(true);
        audioPlay.current.play();
      }
    }
  };

  //Click Pre Music
  const handleClickPrevious = () => {
    handleSetCurrentMusic(previousMusic);
  };

  //Click Next Music
  const handleClickNext = () => {
    handleSetCurrentMusic(nextMusic);
  };

  //Handle Auto Next Music
  const handleAutoNext = () => {
    if (iconAutoNext.current) {
      if (isAutoNext === false) {
        iconAutoNext.current.style.color = `rgb(181, 95, 226)`;
      } else if (isAutoNext === true) {
        iconAutoNext.current.style.color = ``;
      }

      setIsAutoNext(!isAutoNext);
    }
  };

  return (
    <>
      <div className="fullview">
        <div className="fullview__icon--turnoff" onClick={() => handleClickCloseFullView()}>
          <i className="fa fa-chevron-down" aria-hidden="true"></i>
        </div>

        {Array.isArray(currentMusic) === false && (
          <>
            <audio id="audio" src={currentMusic.link} ref={audioPlay}></audio>
            <div className="list_music_current">
              {/* Previous Music */}
              {/* {(dataMusicUser.length >= 2 || dataMusic.length >= 2) &&
                previousMusic &&
                typeof previousMusic === "object" &&
                !Array.isArray(previousMusic) &&
                isPlayingPlaylist === "true" && (
                  <div className="info-current_music previous">
                    <div className="thumbnail-current">
                      <div className="item-thumbnail_hover"></div>
                      <div
                        className="item-play_icon"
                        style={{ width: "100px", height: "100px" }}
                        onClick={() => handleClickPrevious()}
                      >
                        <i
                          className="fa fa-play big-icon"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <img src={previousMusic.thumbnail} />
                    </div>
                    <div className="desc-current">
                      <span className="music_name">
                        {previousMusic.name}
                      </span>
                      <span className="music_author">
                        {previousMusic.artist[0].name}
                      </span>
                    </div>
                  </div>
                )} */}
              {/* End Previous Music  */}

              <div className="info-current_music">
                <div className="thumbnail-current">
                  <div className="item-thumbnail_hover"></div>
                  {isAudioPlay === true && (
                    <div className="item-playing_icon">
                      <Audio
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  )}
                  <div
                    className="item-play_icon"
                    style={{ width: "100px", height: "100px" }}
                    onClick={() => handleOnOffMusic()}
                  >
                    {isAudioPlay === false && <i className="fa fa-play big-icon" aria-hidden="true"></i>}
                    {isAudioPlay === true && <i className="fa fa-pause big-icon" aria-hidden="true"></i>}
                  </div>
                  <img src={currentMusic.thumbnail} />
                </div>

                <div className="desc-current">
                  <span className="music_name">{currentMusic.name}</span>
                  <span className="music_author">{currentMusic.artist[0].name}</span>
                </div>
              </div>

              {/* Next Music */}
              {/* {(dataMusicUser.length >= 2 || dataMusic.length >= 2) &&
                nextMusic &&
                typeof nextMusic === "object" &&
                !Array.isArray(nextMusic) &&
                isPlayingPlaylist === "true" && (
                  <div className="info-current_music next">
                    <div className="thumbnail-current">
                      <div className="item-thumbnail_hover"></div>
                      <div
                        className="item-play_icon"
                        style={{ width: "100px", height: "100px" }}
                        onClick={() => handleClickNext()}
                      >
                        <i
                          className="fa fa-play big-icon"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <img src={nextMusic.thumbnail} />
                    </div>
                    <div className="desc-current">
                      <span className="music_name">
                        {nextMusic.name}
                      </span>
                      <span className="music_author">
                        {nextMusic.artist[0].name}
                      </span>
                    </div>
                  </div>
                )} */}
              {/* End Next Music */}
            </div>
            <div className="fullview__music-player">
              <div className="music-playing">
                <div className="music-controler">
                  <div className="volume-icon">
                    {musicVolume >= 1 ? (
                      <BiVolumeFull />
                    ) : musicVolume > 0 && musicVolume < 1 ? (
                      <BiVolumeLow />
                    ) : (
                      <BiVolumeMute />
                    )}
                  </div>
                  <input
                    onChange={(e) => handleChangeVolume(e)}
                    type="range"
                    id="volumn"
                    min="0"
                    max="1"
                    step="0.1"
                    value={musicVolume}
                  ></input>
                </div>
                <div className="playbar-bottom">
                  <span className="time-left" style={{ width: "50px" }}>
                    {getMusicDuration && getMusicDuration.minutesCurrent ? getMusicDuration.minutesCurrent : "0"}:
                    {getMusicDuration && getMusicDuration.secondsCurrent ? getMusicDuration.secondsCurrent : "00"}
                  </span>
                  <input
                    onChange={(e) => handleChangeValue(e)}
                    type="range"
                    className="range"
                    name="vol"
                    value={getMusicDuration && getMusicDuration.valueCurrent ? valueCurrent : "0"}
                    min="0"
                    max="100"
                  />

                  <span className="time-right" style={{ width: "50px" }}>
                    {getMusicDuration && getMusicDuration.minutesDuration ? getMusicDuration.minutesDuration : "0"}:
                    {getMusicDuration && getMusicDuration.secondsDuration ? getMusicDuration.secondsDuration : "00"}
                  </span>
                </div>
                <div className="playbar-top">
                  <i
                    className="fa fa-random"
                    ref={iconAutoNext}
                    aria-hidden="true"
                    onClick={() => handleAutoNext()}
                  ></i>

                  <i
                    className="fa fa-step-backward"
                    aria-hidden="true"
                    style={{
                      opacity: 1,
                    }}
                    onClick={() => handleClickPrevious()}
                  ></i>

                  {isAudioPlay === false && (
                    <i
                      className="fa play-icon fa-play-circle-o"
                      onClick={() => handleOnOffMusic()}
                      style={{ fontSize: "40px" }}
                      aria-hidden="true"
                    ></i>
                  )}
                  {isAudioPlay === true && (
                    <i
                      className="fa play-icon fa-pause-circle-o"
                      onClick={() => handleOnOffMusic()}
                      style={{
                        fontSize: "40px",
                        color: " rgb(181, 95, 226)",
                      }}
                      aria-hidden="true"
                    ></i>
                  )}

                  <i
                    className="fa fa-step-forward"
                    aria-hidden="true"
                    style={{
                      opacity: 1,
                    }}
                    onClick={() => handleClickNext()}
                  ></i>

                  <i
                    className="fa fa-repeat"
                    ref={iconRepeat}
                    onClick={() => handleChangeRepeatMusic()}
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default FullView;
