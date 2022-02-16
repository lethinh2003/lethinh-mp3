import { queryAllByRole } from "@testing-library/react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../styles/search.scss";
import { filterListHeartsDetail, checkMusicHearted } from "./utils/hearts";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { Audio } from "react-loading-icons";
import { Oval } from "react-loading-icons";
const SearchDetail = ({ q }) => {
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
  const myListHearts = useSelector((state) => state.getMyListHearts);
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const isAudioPlay = useSelector((state) => state.getStatusSelectedMusic.data.status);
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
  const handleClickHeart = () => {};
  const handleChangeMusic = () => {};
  const handleClickAddMusic = () => {};
  const handleChangeBox = (id) => {
    if (id === 1) {
      setIsBoxMusic(true);
      setIsBoxArtist(false);
    } else {
      setIsBoxMusic(false);
      setIsBoxArtist(true);
    }
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
                {isBoxMusic &&
                  !isLoading &&
                  queryMusic &&
                  queryMusic.length > 0 &&
                  queryMusic.map((item, i) => {
                    return (
                      <div className="new-music-item" style={{ width: "100%", maxWidth: "180px" }}>
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
                {isBoxArtist && !isLoading && queryArtist && queryArtist.length === 0 && <span>No found anything</span>}
                {isBoxArtist &&
                  !isLoading &&
                  queryArtist &&
                  queryArtist.length > 0 &&
                  queryArtist.map((item, i) => {
                    return (
                      <div className="new-music-item" style={{ width: "100%", maxWidth: "180px" }}>
                        <div className="item-thumbnail">
                          <div className="item-thumbnail_hover"></div>
                          <div className="item-play_icon">
                            <i className="fa fa-heart"></i>
                            <div className="item-thumbnail__icon--play">
                              <i className="fa fa-play" aria-hidden="true"></i>
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
    </>
  );
};
export default SearchDetail;
