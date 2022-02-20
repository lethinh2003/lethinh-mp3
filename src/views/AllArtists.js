import { useState, useEffect, useRef } from "react";
import "../styles/newmusic.scss";
import { Audio } from "react-loading-icons";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { findNextMusic, findPreviousMusic } from "./utils/FindIndexMusic";
import errorAuth from "./utils/errorAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { Link, useHistory } from "react-router-dom";
import { filterListHeartsDetail, checkMusicHearted } from "./utils/hearts";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import SkeletonMUI from "@mui/material/Skeleton";
SwiperCore.use([Pagination, Navigation]);
const AllArtists = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/artists/");
      setData(response.data.data.data);
      setIsLoading(false);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <div className="ms-mainpage">
        <div className="box-all_artist" style={{ marginTop: "80px" }}>
          <div className="box-header">
            <span className="box-title" style={{ fontSize: "30px" }}>
              # Artists
            </span>
          </div>

          <div className="all-artist">
            {isLoading &&
              Array.from({ length: 20 }).map((item, i) => {
                return (
                  <div className="all-artist-item" key={i}>
                    <div className="item-thumbnail">
                      <SkeletonMUI variant="rectangular" width={"inherit"} height={188} />
                    </div>
                    <div className="item-desc">
                      <span className="item-name">
                        <SkeletonMUI variant="text" />
                      </span>
                      <span className="item_desc">
                        <SkeletonMUI variant="text" />
                      </span>
                    </div>
                  </div>
                );
              })}

            {!isLoading &&
              data &&
              data.length > 0 &&
              data.map((item, i) => {
                return (
                  <div className="all-artist-item" key={i}>
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
    </>
  );
};
export default AllArtists;
