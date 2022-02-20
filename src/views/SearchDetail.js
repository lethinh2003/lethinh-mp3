import { queryAllByRole } from "@testing-library/react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../styles/search.scss";
import axios from "axios";
import { filterListHeartsDetail, checkMusicHearted } from "./utils/hearts";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import errorAuth from "./utils/errorAuth";
import { Audio } from "react-loading-icons";
import { Oval } from "react-loading-icons";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
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

const SearchDetail = (props) => {
  const dispatch = useDispatch();
  const { q, tab } = props;
  const searchValue = useRef();
  let history = useHistory();
  const [search, setSearch] = useState("");
  const [isBoxMusic, setIsBoxMusic] = useState(true);
  const [isBoxArtist, setIsBoxArtist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [listMusic, setListMusic] = useState([]);
  const [listArtist, setListArtist] = useState([]);
  const [queryMusic, setQueryMusic] = useState([]);
  const [queryArtist, setQueryArtist] = useState([]);
  const getUserLogin = useSelector((state) => state.getUserLogin);
  const isPlayingPlaylist = localStorage.getItem("isPlayingPlaylist") || "false";
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
  const dataMyPlaylist = useSelector((state) => state.addMyPlaylist);
  const dataMyPlaylistUser = useSelector((state) => state.addMyPlaylistUser);
  const TokenAccount = localStorage.getItem("jwt");

  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    currentUser = JSON.parse(currentUser);
  }
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    const allMusics = localStorage.getItem("AllMusics");
    const allArtists = localStorage.getItem("AllArtists");
    if (allMusics) {
      setListMusic(JSON.parse(allMusics));
    }
    if (allArtists) {
      setListArtist(JSON.parse(allArtists));
    }
  }, []);
  useEffect(() => {
    if (tab === "musics") {
      setIsBoxMusic(true);
      setIsBoxArtist(false);
    } else if (tab === "artists") {
      setIsBoxMusic(false);
      setIsBoxArtist(true);
    }
  }, [tab]);
  const handleQueryMusic = () => {
    if (listMusic && listMusic.length > 0 && searchValue.current.value) {
      const listQueryMusicResult = listMusic.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
      setQueryMusic(listQueryMusicResult);
    } else if (listMusic && listMusic.length > 0 && !searchValue.current.value) {
      handleCloseSearch();
    }
  };
  const handleQueryArtist = () => {
    if (listArtist && listArtist.length > 0 && searchValue.current.value) {
      const listQueryArtistResult = listArtist.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
      setQueryArtist(listQueryArtistResult);
    } else if (listArtist && listArtist.length > 0 && !searchValue.current.value) {
      handleCloseSearch();
    }
  };
  const handleCloseSearch = () => {
    setQueryMusic([]);
    setQueryArtist([]);
    setSearch("");
  };
  useEffect(() => {
    if (!isSearch) {
      setSearch(q);
      setIsSearch(true);
    }

    const countLoading = setTimeout(() => {
      if (isSearch) {
        history.replace(`/search?q=${search}`);
        handleQueryArtist();
        handleQueryMusic();
      }
      setIsLoading(false);
    }, 500);
    return () => {
      clearTimeout(countLoading);
      setIsLoading(true);
    };
  }, [search]);
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
  const handleChangeBox = (id) => {
    setIsLoading(true);
    if (id === 1) {
      setIsBoxMusic(true);
      setIsBoxArtist(false);
    } else {
      setIsBoxMusic(false);
      setIsBoxArtist(true);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  return (
    <>
      <div className="ms-mainpage">
        <div className="box-search">
          <div className="box-search__input">
            <input
              type="text"
              value={search}
              placeholder="Search"
              ref={searchValue}
              onChange={(e) => handleChangeSearch(e)}
            />
          </div>
          <div className="box-search__result">
            <div className="box-search__result--header">
              <span className={!isBoxMusic ? "header-title" : "header-title active"} onClick={() => handleChangeBox(1)}>
                Musics
              </span>
              <span
                className={!isBoxArtist ? "header-title" : "header-title active"}
                onClick={() => handleChangeBox(2)}
              >
                Artists
              </span>
            </div>
            <div className="box-search__result--contents">
              <span className={isLoading ? "is-dpb" : "is-dpn"} style={{ alignSelf: "center" }}>
                <Oval style={{ width: "20px" }} stroke="black" />
              </span>
              <div className="contents__result">
                {isBoxMusic && !isLoading && queryMusic && queryMusic.length === 0 && <span>No found anything</span>}
                <div className="result-pc">
                  {isBoxMusic &&
                    !isLoading &&
                    queryMusic &&
                    queryMusic.length > 0 &&
                    queryMusic.map((item, i) => {
                      return (
                        <div key={i} className="search-item">
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
                <div className="result-mobile">
                  {isBoxMusic &&
                    !isLoading &&
                    queryMusic &&
                    queryMusic.length > 0 &&
                    queryMusic.map((item, i) => {
                      return (
                        <div key={i} className="search-item__mobile">
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

                {isBoxArtist && !isLoading && queryArtist && queryArtist.length === 0 && <span>No found anything</span>}
                <div className="result-mobile">
                  {isBoxArtist &&
                    !isLoading &&
                    queryArtist &&
                    queryArtist.length > 0 &&
                    queryArtist.map((item, i) => {
                      return (
                        <div key={i} className="search-item__mobile" style={{ minWidth: "180px" }}>
                          <div className="item-thumbnail">
                            <div className="item-thumbnail_hover"></div>
                            <div className="item-play_icon">
                              <i className="fa fa-heart"></i>
                              <div className="item-thumbnail__icon--play">
                                <Link to={"/artists/" + item._id}>
                                  <i className="fa fa-play" aria-hidden="true"></i>
                                </Link>
                              </div>
                              <AiOutlinePlus />
                            </div>
                            <img src={item.thumbnail} alt="" />
                          </div>
                          <div className="item-desc">
                            <span className="item-name">
                              <a title={item.name}>{item.name}</a>
                            </span>
                            <span className="item_desc">{item.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="result-pc">
                  {isBoxArtist &&
                    !isLoading &&
                    queryArtist &&
                    queryArtist.length > 0 &&
                    queryArtist.map((item, i) => {
                      return (
                        <div key={i} className="search-item" style={{ minWidth: "180px" }}>
                          <div className="item-thumbnail">
                            <div className="item-thumbnail_hover"></div>
                            <div className="item-play_icon">
                              <i className="fa fa-heart"></i>
                              <div className="item-thumbnail__icon--play">
                                <Link to={"/artists/" + item._id}>
                                  <i className="fa fa-play" aria-hidden="true"></i>
                                </Link>
                              </div>
                              <AiOutlinePlus />
                            </div>
                            <img src={item.thumbnail} alt="" />
                          </div>
                          <div className="item-desc">
                            <span className="item-name">
                              <a title={item.name}>{item.name}</a>
                            </span>
                            <span className="item_desc">{item.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchDetail;
