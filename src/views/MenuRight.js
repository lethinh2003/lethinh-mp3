import "../styles/menuright.scss";
import { useState, useEffect, memo, useRef } from "react";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector, useDispatch } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { Audio } from "react-loading-icons";
import {
  setSelectedMusic,
  removeSelectedMusic,
  addMyPlaylistUser,
  removeMyPlaylistUser,
  removeMyPlaylist,
  setNextSelectedMusic,
  setPreviousSelectedMusic,
  removeNextSelectedMusic,
  removePreviousSelectedMusic,
  setIsPlayingPlaylist,
} from "../redux/actions";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import errorAuth from "./utils/errorAuth";

const MenuRight = (props) => {
  const menuRight = useRef(null);
  const {
    currentMusic,
    isOpenMenuRight,
    handleUpdateCurrentMusic,

    listCurrentMusic,
  } = props;
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const accessAccount = useSelector((state) => state.accessAccount);
  const dataMusic = useSelector((state) => state.addMyPlaylist);
  const dataMusicUser = useSelector((state) => state.addMyPlaylistUser);
  const dataSelectedMusic = useSelector((state) => state.selectedMusic.data);
  const isPlayingPlaylist = useSelector((state) => state.isPlayingPlaylist);
  const dispatch = useDispatch();

  const TokenAccount = localStorage.getItem("jwt");
  const AccessAccount = localStorage.getItem("accessAccount");
  let currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    currentUser = JSON.parse(currentUser);
  }
  // Get PlayList User
  const MyPlayListFromDB = async (userId) => {
    try {
      const response = await axios.get(`https://random-musics.herokuapp.com/api/v1/playlists/${userId}/`);

      const dataStorage = [];
      const data = response.data.data.data.map((item) => {
        dataStorage.push(item.music[0]);
      });
      localStorage.setItem("MyPlayListMusicFromDB", JSON.stringify(dataStorage));
      setIsLoading(false);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };

  useEffect(() => {
    //Check User Valid
    if (TokenAccount && AccessAccount === "true" && currentUser) {
      MyPlayListFromDB(currentUser._id);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!accessAccount) {
      if (!Array.isArray(currentMusic)) {
        if (dataMusic.length > 1) {
          const nextMusicId = findNextMusic(currentMusic, dataMusicUser, dataMusic);
          const previousMusicId = findPreviousMusic(currentMusic, dataMusicUser, dataMusic);
          if (nextMusicId !== undefined && previousMusicId !== undefined) {
            const nextMusic = dataMusic[nextMusicId];
            const previousMusic = dataMusic[previousMusicId];
            dispatch(setNextSelectedMusic(nextMusic));
            dispatch(setPreviousSelectedMusic(previousMusic));
          }
        }

        if (dataMusic.length <= 1) {
          localStorage.removeItem("nextSelectedMusic");
          localStorage.removeItem("previousSelectedMusic");
        }
        if (dataMusic.length === 0) {
          localStorage.removeItem("selectedMusic");
        }
      }
    } else {
      if (!Array.isArray(currentMusic)) {
        if (dataMusicUser.length > 1) {
          const nextMusicId = findNextMusic(currentMusic, dataMusicUser, dataMusic);
          const previousMusicId = findPreviousMusic(currentMusic, dataMusicUser, dataMusic);
          if (nextMusicId !== undefined && previousMusicId !== undefined) {
            const nextMusic = dataMusicUser[nextMusicId];
            const previousMusic = dataMusicUser[previousMusicId];
            dispatch(setNextSelectedMusic(nextMusic));
            dispatch(setPreviousSelectedMusic(previousMusic));
          }
        }
        if (dataMusicUser.length <= 1) {
          localStorage.removeItem("nextSelectedMusic");
          localStorage.removeItem("previousSelectedMusic");
        }
        if (dataMusicUser.length === 0) {
          localStorage.removeItem("selectedMusic");
        }
      }
    }
  }, [dataMusic, dataMusicUser, isPlayingPlaylist]);
  useEffect(() => {}, [isPlayingPlaylist]);

  useEffect(() => {
    if (!Array.isArray(currentMusic)) {
      if (menuRight.current) {
        menuRight.current.classList.add("has-player");
      }
      const menuPre = document.querySelectorAll(".menu-pre");
      if (menuPre && menuPre.length > 0) {
        menuPre.forEach((item) => {
          item.classList.remove("active");
        });
      }
    }
  }, [currentMusic]);

  // Open/Close Menu Right

  if (isOpenMenuRight === true && menuRight.current) {
    menuRight.current.style = `transform: translateX(0)`;
    // const overlay = document.querySelector(".overlay");
    // if (overlay) {
    //   overlay.style.display = "block";
    // }
  } else if (isOpenMenuRight === false && menuRight.current) {
    menuRight.current.style = `transform: translateX(100%)`;
    // const overlay = document.querySelector(".overlay");
    // if (overlay) {
    //   overlay.style.display = "none";
    // }
  }

  // Set Background Selected Music
  const handleChangeMusic = async (data, e) => {
    localStorage.setItem("isPlayingPlaylist", true);
    dispatch(setIsPlayingPlaylist(true));
    const menuPre = document.querySelectorAll(".menu-pre");
    if (menuPre && menuPre.length > 0) {
      menuPre.forEach((item) => {
        item.classList.remove("active");
      });
      e.target.classList.add("active");
    }
    // Update View Music
    if (!Array.isArray(data)) {
      const nextMusicId = findNextMusic(data, dataMusicUser, dataMusic);
      const previousMusicId = findPreviousMusic(data, dataMusicUser, dataMusic);
      if (nextMusicId !== undefined && previousMusicId !== undefined) {
        if (TokenAccount) {
          const nextMusic = dataMusicUser[nextMusicId];
          const previousMusic = dataMusicUser[previousMusicId];

          dispatch(setNextSelectedMusic(nextMusic));
          dispatch(setPreviousSelectedMusic(previousMusic));
        } else {
          const nextMusic = dataMusic[nextMusicId];
          const previousMusic = dataMusic[previousMusicId];
          dispatch(setNextSelectedMusic(nextMusic));
          dispatch(setPreviousSelectedMusic(previousMusic));
        }
      }

      dispatch(removeSelectedMusic());
      dispatch(setSelectedMusic(data));
      handleUpdateCurrentMusic(data);
      try {
        const updateView = await axios.post(
          `https://random-musics.herokuapp.com/api/v1/musics/${data._id}/update-views`
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Delete Music From Playlist
  const hanldeDeleteMusic = (musicId, e) => {
    const loadingView = document.querySelector(".loading-opacity");
    e.stopPropagation();
    if (accessAccount) {
      if (!Array.isArray(currentMusic) && musicId === currentMusic._id) {
        return toast.error("Can't remove current music");
      }

      if (currentMusic._id !== musicId) {
        const DeletePlayListFromDB = async (userId) => {
          try {
            if (loadingView) {
              loadingView.classList.remove("is-hide");
              loadingView.classList.add("is-show");
            }
            const response = await axios.delete(
              `https://random-musics.herokuapp.com/api/v1/playlists/${userId}/${musicId}`
            );
            if (loadingView) {
              loadingView.classList.add("is-hide");
              loadingView.classList.remove("is-show");
            }
            const dataStorage = localStorage.getItem("MyPlayListMusicFromDB");
            if (dataStorage) {
              const dataStorageParse = JSON.parse(dataStorage);
              const findIndexMusic = dataStorageParse.findIndex((item) => item._id === musicId);
              if (findIndexMusic !== -1) {
                dataStorageParse.splice(findIndexMusic, 1);
                localStorage.setItem("MyPlayListMusicFromDB", JSON.stringify(dataStorageParse));
                dispatch(removeMyPlaylistUser()); /// REMOVE MUSIC FROM PLAYLIST
                if (!Array.isArray(currentMusic)) {
                  const nextMusicId = findNextMusic(currentMusic, dataMusicUser, dataMusic);
                  const previousMusicId = findPreviousMusic(currentMusic, dataMusicUser, dataMusic);
                  if (nextMusicId !== undefined && previousMusicId !== undefined) {
                    const nextMusic = dataMusicUser[nextMusicId];
                    const previousMusic = dataMusicUser[previousMusicId];
                    dispatch(setNextSelectedMusic(nextMusic));
                    dispatch(setPreviousSelectedMusic(previousMusic));
                  }
                }
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
        DeletePlayListFromDB(currentUser._id);
      }
    } else {
      if (!Array.isArray(currentMusic) && musicId === currentMusic._id) {
        return toast.error("Can't remove current music");
      }

      const dataStorage = localStorage.getItem("MyPlayListMusic");
      if (dataStorage) {
        const dataStorageParse = JSON.parse(dataStorage);
        const findIndexMusic = dataStorageParse.findIndex((item) => item._id === musicId);
        if (findIndexMusic !== -1) {
          dataStorageParse.splice(findIndexMusic, 1);
          localStorage.setItem("MyPlayListMusic", JSON.stringify(dataStorageParse));
          dispatch(removeMyPlaylist()); /// REMOVE MUSIC FROM PLAYLIST
          if (!Array.isArray(currentMusic)) {
            const nextMusicId = findNextMusic(currentMusic, dataMusicUser, dataMusic);
            const previousMusicId = findPreviousMusic(currentMusic, dataMusicUser, dataMusic);
            if (nextMusicId !== undefined && previousMusicId !== undefined) {
              const nextMusic = dataMusic[nextMusicId];
              const previousMusic = dataMusic[previousMusicId];
              dispatch(setNextSelectedMusic(nextMusic));
              dispatch(setPreviousSelectedMusic(previousMusic));
            }
          }
        }
      }
    }
  };

  return (
    <>
      <div className="menu-right" ref={menuRight}>
        <div className="menu-list">
          {isLoading &&
            Array.from({ length: 5 }).map((item, i) => {
              return (
                <SkeletonTheme baseColor="#464646" highlightColor="#191420" key={i}>
                  <div className="menu-pre">
                    <div className="pre-thumbnail">
                      <Skeleton height={40} width={40} />
                    </div>
                    <div className="pre-info">
                      <span className="pre-name">
                        <Skeleton width={150} />
                      </span>
                      <span className="pre-artis">
                        <Skeleton width={150} />
                      </span>
                    </div>
                  </div>
                </SkeletonTheme>
              );
            })}

          {!isLoading &&
            TokenAccount &&
            currentUser &&
            dataMusicUser &&
            dataMusicUser.length > 0 &&
            dataMusicUser.map((item, i) => {
              return (
                <div
                  className="menu-pre"
                  onClick={(e) => handleChangeMusic(item, e)}
                  style={
                    isPlayingPlaylist && !Array.isArray(currentMusic) && currentMusic._id === item._id
                      ? {
                          backgroundColor: "#ebeaec",
                          borderRadius: "5px",
                          opacity: "1",
                        }
                      : null
                  }
                  key={i}
                >
                  <div className="pre-thumbnail">
                    <div className="pre-icon_play">
                      <i className="fa fa-play" aria-hidden="true"></i>
                    </div>
                    <img src={item.thumbnail} alt="" />
                  </div>
                  <div className="pre-info">
                    <span className="pre-name">{item.name}</span>
                    <span className="pre-artis">{item.artist[0].name}</span>
                  </div>
                  <div className="pre-features">
                    <AiFillDelete onClick={(e) => hanldeDeleteMusic(item._id, e)} />
                  </div>
                </div>
              );
            })}
          {!isLoading &&
            !TokenAccount &&
            dataMusic &&
            dataMusic.length > 0 &&
            dataMusic.map((item, i) => {
              return (
                <div
                  className="menu-pre"
                  onClick={(e) => handleChangeMusic(item, e)}
                  style={
                    isPlayingPlaylist === true && !Array.isArray(currentMusic) && currentMusic._id === item._id
                      ? {
                          backgroundColor: "#7200a1",
                          borderRadius: "5px",
                          opacity: "1",
                        }
                      : {
                          backgroundColor: "",
                          borderRadius: "",
                          opacity: "",
                        }
                  }
                  key={i}
                >
                  <div className="pre-thumbnail">
                    <div className="pre-icon_play">
                      <i className="fa fa-play" aria-hidden="true"></i>
                    </div>
                    <img src={item.thumbnail} alt="" />
                  </div>
                  <div className="pre-info">
                    <span className="pre-name">{item.name}</span>
                    <span className="pre-artis">{item.artist[0].name}</span>
                  </div>
                  <div className="pre-features">
                    <AiFillDelete onClick={(e) => hanldeDeleteMusic(item._id, e)} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
export default MenuRight;
