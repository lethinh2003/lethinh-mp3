import "../styles/search.scss";
import { CgSearch, CgTrending } from "react-icons/cg";
import { useEffect, useState } from "react";
import APIMusic from "../api/APIMusic";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getListMusic, setSelectedMusic, removeSelectedMusic } from "../redux/actions";

const Search = () => {
  let history = useHistory();
  const TokenAccount = localStorage.getItem("jwt");
  const { data: dataMusic, isLoading } = APIMusic("getMusicList", 1000);
  const [keyword, setKeyword] = useState("");
  const [listMusic, setListMusic] = useState(dataMusic);
  const dispatch = useDispatch();
  useEffect(() => {
    if (dataMusic && listMusic) {
      const listSearch = dataMusic.filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase()));
      setListMusic(listSearch);
    }
  }, [keyword]);

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };
  const handleChangeSelectedMusic = (data) => {
    dispatch(removeSelectedMusic());
    dispatch(setSelectedMusic(data));
  };

  return (
    <div className="header">
      <div className="header-logo">
        <Link to="/">
          <img src="https://i.imgur.com/v12Pe2O.png" />
        </Link>
      </div>
      <div
        className="search-box"
        style={
          keyword !== ""
            ? {
                backgroundColor: "#432275",
              }
            : {
                backgroundColor: "#2f2739",
              }
        }
      >
        <div className="search-form">
          <div className="search-icon">
            <CgSearch />
          </div>
          <div className="search-input">
            <input type="text" value={keyword} onChange={(e) => handleChangeKeyword(e)} placeholder="Nhập bài hát" />
          </div>
        </div>
        <div
          className="search-list"
          style={
            keyword !== ""
              ? {
                  display: "block",
                }
              : {
                  display: "none",
                }
          }
        >
          <div className="list-data">
            <div className="title-search">Kết quả tìm kiếm</div>
            {listMusic &&
              listMusic.length > 0 &&
              listMusic.map((item) => {
                return (
                  <>
                    <div className="list-item" key={item.id}>
                      <div className="item-icon">
                        <CgTrending />
                      </div>
                      <div className="item-title" onClick={() => handleChangeSelectedMusic(item)}>
                        {item.name}
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>

      {/* Login user */}

      <div className="user-control">
        {TokenAccount && (
          <Link to="/logout" exact>
            <span className="user-control__title">Logout</span>
          </Link>
        )}
        {!TokenAccount && (
          <Link to="/auth/login" exact>
            <span className="user-control__title">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Search;
