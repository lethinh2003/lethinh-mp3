import "../styles/popular.scss";
import { useSelector, useDispatch } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getPopular, addMyPlaylist } from "../redux/actions";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import errorAuth from "./utils/errorAuth";

const Popular = () => {
  let history = useHistory();
  const dataMusic = useSelector((state) => state.popularMusic.data);
  const currentMusic = useSelector((state) => state.selectedMusic.data);
  const dataMyPlaylist = useSelector((state) => state.addMyPlaylist);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    const response = await axios
      .get("https://random-musics.herokuapp.com/api/v1/musics/top-views-day")
      .catch((err) => console.log(err));
    if (response) {
      dispatch(getPopular(response.data.data.data));
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);
  const handleClickHeart = async (data) => {
    try {
      const updateHeart = await axios.post(`https://random-musics.herokuapp.com/api/v1/musics/${data._id}/hearts`);
      const heartContainer = document.querySelector(".heart-opacity");
      if (heartContainer) {
        fetchAPI();
        heartContainer.style.opacity = 1;
        heartContainer.style.visibility = "visible";
        setTimeout(() => {
          heartContainer.style.opacity = 0;
          heartContainer.style.visibility = "hidden";
        }, 500);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
        errorAuth(err);
      }
    }
  };
  const handleClickAddMusic = async (data) => {
    let check = true;
    if (dataMyPlaylist && dataMyPlaylist.length > 0) {
      await dataMyPlaylist.forEach((item) => {
        if (item.id === data.id) {
          check = false;
        }
      });
    }
    if (check) {
      dispatch(addMyPlaylist(data));
    }
  };
  return (
    <>
      <div className="box-popular">
        <span className="box-title">Popular</span>
        <div className="box-popular__scroll">
          {dataMusic &&
            dataMusic.length === 0 &&
            Array.from({ length: 4 }).map((item, i) => {
              return (
                <SkeletonTheme baseColor="#464646" highlightColor="#191420" key={i}>
                  <div className="popular-item">
                    <div className="popular-item__image">
                      <Skeleton height={40} width={40} />
                    </div>
                    <div className="popular-item__desc">
                      <span className="popular-item__desc--name">
                        <Skeleton />
                      </span>
                      <span className="popular-item__desc--author">
                        <Skeleton />
                      </span>
                    </div>
                    <div className="popular-item__icon">
                      <Skeleton />
                    </div>
                  </div>
                </SkeletonTheme>
              );
            })}

          {dataMusic &&
            dataMusic.length > 0 &&
            dataMusic.map((item, i) => {
              return (
                <div
                  className="popular-item"
                  key={i}
                  style={currentMusic.id === item.id ? { backgroundColor: "rgb(80 76 78)" } : {}}
                >
                  <div className={i + 1 <= 3 ? `popular-item__number top${i + 1}` : "popular-item__number"}>
                    {i + 1}
                  </div>
                  <div className="popular-item__image">
                    <div
                      className="popular-item__image--active"
                      style={currentMusic.id === item.id ? { opacity: "1" } : {}}
                    ></div>
                    <div
                      className="item-play_icon"
                      style={currentMusic.id === item.id ? { opacity: "1", border: "unset" } : {}}
                    >
                      <i className="fa fa-play" aria-hidden="true" style={{ fontSize: "20px" }}></i>
                    </div>
                    <img src={item.info[0].thumbnail} alt="" />
                  </div>
                  <div className="popular-item__desc">
                    <span className="popular-item__desc--name">{item.info[0].name}</span>
                    <span className="popular-item__desc--author">{item.artist[0].name}</span>
                  </div>
                  <div className="popular-item__icon">
                    <i className="fa fa-heart heart-icon" onClick={() => handleClickHeart(item)}>
                      <div className="heart-icon__value">
                        <span>{item.info[0].hearts}</span>
                      </div>
                    </i>
                    <AiOutlinePlus onClick={() => handleClickAddMusic(item)} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
export default Popular;
