import { useState, useEffect, useRef } from "react";
import { AiOutlineConsoleSql, AiOutlineSearch } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { Oval } from "react-loading-icons";
const Search = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchResult = useRef(null);
  const hanldeChangeValueSearch = (e) => {
    setSearch(e.target.value);
    setIsSearch(true);
    searchResult.current.classList.add("is-show");
    searchResult.current.classList.remove("is-hide");
  };
  useEffect(() => {
    console.log("search-changed");
    const countLoading = setTimeout(() => {
      if (loadingSearch.current) {
        loadingSearch.current.classList.add("is-dpb");
        loadingSearch.current.classList.remove("is-dpn");
      }
      setIsLoading(true);
    }, 500);
    return () => {
      clearTimeout(countLoading);
      setIsLoading(false);
      if (loadingSearch.current) {
        loadingSearch.current.classList.remove("is-dpb");
        loadingSearch.current.classList.add("is-dpn");
      }
    };
  }, [search]);
  const handleCloseSearch = () => {
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
            <input type="text" placeholder="Search" value={search} onChange={(e) => hanldeChangeValueSearch(e)} />
          </div>
          <div className="search__icon" style={isSearch ? {} : { display: "none" }}>
            <AiOutlineClose onClick={() => handleCloseSearch()} />
          </div>
        </div>
        <div className="search-result is-hide" ref={searchResult}>
          <div className="search-result__header">
            <span className="header__text">Result for {search}</span>
          </div>
          <div className="search-result__container">
            <span className="is-dpn" ref={loadingSearch} style={{ alignSelf: "center" }}>
              <Oval style={{ width: "20px" }} />
            </span>

            <>
              <div className="container__wrapper">
                <div className="container__wrapper--header">Musics</div>
                <div className="container__wrapper--data">
                  <img className="data__img" src="https://i.imgur.com/3B2eBcK.jpg" />
                  <span className="data__content">Em cua ngay hom qua</span>
                </div>
                <div className="container__wrapper--data">
                  <img className="data__img" src="https://i.imgur.com/uJxbqaC.jpg" />
                  <span className="data__content">Toi cua ngay hom nay</span>
                </div>
              </div>
              <div className="container__wrapper">
                <div className="container__wrapper--header">Artist</div>
                <div className="container__wrapper--data">
                  <img className="data__img" src="https://i.imgur.com/3B2eBcK.jpg" />
                  <span className="data__content">Em cua ngay hom qua</span>
                </div>
                <div className="container__wrapper--data">
                  <img className="data__img" src="https://i.imgur.com/uJxbqaC.jpg" />
                  <span className="data__content">Toi cua ngay hom nay</span>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};
export default Search;
