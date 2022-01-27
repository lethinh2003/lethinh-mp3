import "../styles/fullview.scss";
import { useState, useEffect, useRef } from "react";
import { BiVolumeFull, BiVolumeLow, BiVolumeMute } from "react-icons/bi";
import { Bars } from "react-loading-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getStatusSelectedMusic,
  setPreviousSelectedMusic,
  setNextSelectedMusic,
  getDuration,
  accessAccount,
} from "../redux/actions";

const FullView = (props) => {
  let {
    handleSetCurrentMusic,
    currentMusic,
    handleCloseFullView,
    handleUpdateStatusAudio,
    listCurrentMusic,
  } = props;

  const [minutesCurrent, setMinutesCurrent] = useState(0);
  const [secondsCurrent, setSecondsCurrent] = useState(0);
  const [minutesDuration, setMinutesDuration] = useState(0);
  const [secondsDuration, setSecondsDuration] = useState(0);
  const [valueCurrent, setValueCurrent] = useState(0);
  const [musicVolume, setMusicVolume] = useState(1);
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
    if (Array.isArray(currentMusic) === false) {
      document.title = "You are listening " + currentMusic.info[0].name;
      if (isAudioPlay === true) {
        if (getMusicDuration.minutesDuration) {
          dispatch(getStatusSelectedMusic(false));
        } else {
          const audioPromise = audioPlay.current.play();
          if (audioPromise !== undefined) {
            audioPromise
              .then(() => {
                audioPlay.current.play();
                handleUpdateStatusAudio(true);
              })
              .catch((error) => {});
          }
        }
      }
    }
  }, [currentMusic]);

  useEffect(() => {
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
        const valueCurrent = Math.floor(
          (audioPlay.current.currentTime / audioPlay.current.duration) * 100
        );
        setMinutesCurrent(getMinutesCurrent);
        setSecondsCurrent(getSecondsCurrent);
        setMinutesDuration(getMinutes);
        setSecondsDuration(getSeconds);
        setValueCurrent(valueCurrent);

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

    //Auto Repeat Music
    if (
      audioPlay.current &&
      getMusicDuration &&
      getMusicDuration.minutesDuration &&
      isRepeatMusic === true &&
      valueCurrent
    ) {
      if (valueCurrent >= 100) {
        audioPlay.current.play();
        audioPlay.current.currentTime = 0;
      }
    } else if (
      audioPlay.current &&
      getMusicDuration &&
      getMusicDuration.minutesDuration &&
      isRepeatMusic === false &&
      valueCurrent
    ) {
      if (valueCurrent >= 100) {
        audioPlay.current.pause();
        audioPlay.current.currentTime = 0;
        dispatch(getStatusSelectedMusic(false));
        handleUpdateStatusAudio(false);
      }
    }

    //Update Real Time
    const updateRealTime = setInterval(updateTime, 100);

    return () => {
      clearInterval(updateRealTime);
    };
  });

  //Handle Change Value Music
  const handleChangeValue = (e) => {
    if (
      audioPlay.current &&
      getMusicDuration.minutesDuration &&
      Array.isArray(currentMusic) === false
    ) {
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
    if (Array.isArray(currentMusic) === false && getMusicDuration.minutesDuration) {
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

  //Change Volume
  const handleChangeVolume = (e) => {
    if (audioPlay.current) {
      setMusicVolume(e.target.value);
      audioPlay.current.volume = e.target.value;
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
  console.log("-----------------");
  console.log("account", accessAccount);
  console.log("isplayingplaylist", isPlayingPlaylist);
  console.log("datamusic", dataMusic);
  console.log("datamusicuser", dataMusicUser);
  console.log("-----------------");

  return (
    <>
      <div className="fullview">
        <div className="fullview__icon--turnoff" onClick={() => handleClickCloseFullView()}>
          <i className="fa fa-chevron-down" aria-hidden="true"></i>
        </div>

        {Array.isArray(currentMusic) === false && (
          <>
            <audio id="audio" src={currentMusic.info[0].link} ref={audioPlay}></audio>
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
                      <img src={previousMusic.info[0].thumbnail} />
                    </div>
                    <div className="desc-current">
                      <span className="music_name">
                        {previousMusic.info[0].name}
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
                      <Bars />
                    </div>
                  )}
                  <div
                    className="item-play_icon"
                    style={{ width: "100px", height: "100px" }}
                    onClick={() => handleOnOffMusic()}
                  >
                    {isAudioPlay === false && (
                      <i className="fa fa-play big-icon" aria-hidden="true"></i>
                    )}
                    {isAudioPlay === true && (
                      <i className="fa fa-pause big-icon" aria-hidden="true"></i>
                    )}
                  </div>
                  <img src={currentMusic.info[0].thumbnail} />
                </div>

                <div className="desc-current">
                  <span className="music_name">{currentMusic.info[0].name}</span>
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
                      <img src={nextMusic.info[0].thumbnail} />
                    </div>
                    <div className="desc-current">
                      <span className="music_name">
                        {nextMusic.info[0].name}
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
                  <span className="time-left">
                    {getMusicDuration && getMusicDuration.minutesCurrent
                      ? getMusicDuration.minutesCurrent
                      : "0"}
                    :
                    {getMusicDuration && getMusicDuration.secondsCurrent
                      ? getMusicDuration.secondsCurrent
                      : "00"}
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

                  <span className="time-right">
                    {getMusicDuration && getMusicDuration.minutesDuration
                      ? getMusicDuration.minutesDuration
                      : "0"}
                    :
                    {getMusicDuration && getMusicDuration.secondsDuration
                      ? getMusicDuration.secondsDuration
                      : "00"}
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
