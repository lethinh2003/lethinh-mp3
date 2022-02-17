import { useState, useEffect, useRef } from "react";
import { AiOutlineConsoleSql, AiOutlineSearch } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { Oval } from "react-loading-icons";
import { Link } from "react-router-dom";
const Search = () => {
  const searchValue = useRef();
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listMusic, setListMusic] = useState([]);
  const [listArtist, setListArtist] = useState([]);
  const [queryMusic, setQueryMusic] = useState([]);
  const [queryArtist, setQueryArtist] = useState([]);
  const [search, setSearch] = useState("");

  const searchResult = useRef(null);
  const hanldeChangeValueSearch = (e) => {
    setSearch(e.target.value);
    setIsSearch(true);
    searchResult.current.classList.add("is-show");
    searchResult.current.classList.remove("is-hide");
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
    if (listMusic && listMusic.length > 0 && searchValue.current.value) {
      const listQueryMusicResult = listMusic.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
      setQueryMusic(listQueryMusicResult.slice(-3));
    } else if (listMusic && listMusic.length > 0 && !searchValue.current.value) {
      handleCloseSearch();
    }
    if (listArtist && listArtist.length > 0 && searchValue.current.value) {
      const listQueryArtistResult = listArtist.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
      setQueryArtist(listQueryArtistResult.slice(-3));
    } else if (listArtist && listArtist.length > 0 && !searchValue.current.value) {
      handleCloseSearch();
    }
    const countLoading = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => {
      clearTimeout(countLoading);
      setIsLoading(true);
    };
  }, [search]);
  const handleCloseSearch = () => {
    setQueryMusic([]);
    setQueryArtist([]);
    setSearch("");
    setIsSearch(false);
    searchResult.current.classList.add("is-hide");
    searchResult.current.classList.remove("is-show");
    searchRef.current.classList.remove("is-show");
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleCloseSearch();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const loadingSearch = useRef(null);
  useOutsideAlerter(wrapperRef);
  const handleClickMobileSearch = () => {
    searchRef.current.classList.add("is-show");
  };

  return (
    <>
      <div ref={wrapperRef}>
        <div className="search" ref={searchRef}>
          <div className="search__icon" onClick={() => handleClickMobileSearch()}>
            <AiOutlineSearch />
          </div>
          <div className="search__input">
            <input
              type="text"
              placeholder="Search"
              value={search}
              ref={searchValue}
              onChange={(e) => hanldeChangeValueSearch(e)}
            />
          </div>
          <div className="search__icon" style={isSearch ? {} : { display: "none" }}>
            <AiOutlineClose style={{ cursor: "pointer" }} onClick={() => handleCloseSearch()} />
          </div>
        </div>
        <div className="search-result is-hide" ref={searchResult}>
          <div className="search-result__header">
            <span className="header__text">Result for {search}</span>
          </div>
          <div className="search-result__container">
            <span className={isLoading ? "is-dpb" : "is-dpn"} ref={loadingSearch} style={{ alignSelf: "center" }}>
              <Oval style={{ width: "20px" }} stroke="black" />
            </span>

            <>
              <div className="container__wrapper">
                <div className="container__wrapper--header">
                  <span className="header-title">Musics</span>
                  <span className="header-more">
                    <Link to={`/search?q=${search}&tab=musics`} onClick={() => handleCloseSearch()}>
                      Xem thêm
                    </Link>
                  </span>
                </div>
                {!isLoading &&
                  queryMusic &&
                  queryMusic.length > 0 &&
                  queryMusic.map((item, i) => {
                    return (
                      <div className="container__wrapper--data" key={i}>
                        <img className="data__img" src={item.thumbnail} />
                        <span className="data__content">{item.name}</span>
                      </div>
                    );
                  })}
              </div>
              <div className="container__wrapper">
                <div className="container__wrapper--header">
                  <span className="header-title">Artists</span>
                  <span className="header-more">
                    <Link to={`/search?q=${search}&tab=artists`} onClick={() => handleCloseSearch()}>
                      Xem thêm
                    </Link>
                  </span>
                </div>
                {!isLoading &&
                  queryArtist &&
                  queryArtist.length > 0 &&
                  queryArtist.map((item, i) => {
                    return (
                      <div className="container__wrapper--data" key={i}>
                        <img className="data__img" src={item.thumbnail} />
                        <span className="data__content">{item.name}</span>
                      </div>
                    );
                  })}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};
export default Search;
