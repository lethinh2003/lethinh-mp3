import "../styles/artists.scss";
import { useSelector, useDispatch } from "react-redux";
import { getArtists } from "../redux/actions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getPopular } from "../redux/actions";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import SkeletonMUI from "@mui/material/Skeleton";
SwiperCore.use([Pagination, Navigation]);

const Artists = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/artists");
      setIsLoading(false);
      setData(response.data.data.data.slice(-10));
      localStorage.setItem("AllArtists", JSON.stringify(response.data.data.data));
    } catch (err) {
      setIsLoading(false);
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
      <div className="box-new_music" style={{ marginTop: "0px" }}>
        <div className="box-header">
          <span className="box-title">Artists</span>
          <span className="box-more">Xem thêm</span>
        </div>

        <div className="new-music" style={{ display: "flex" }}>
          {isLoading &&
            Array.from({ length: 2 }).map((item, i) => {
              return (
                <div className="category-item" style={{ width: "unset" }} key={i}>
                  <div className="item-thumbnail">
                    <SkeletonMUI variant="rectangular" width={190} height={188} />
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
          {!isLoading && (
            <div className="artist__mobile">
              <div className="artist__mobile--wrapper">
                {data &&
                  data.length > 0 &&
                  data.map((item, i) => {
                    return (
                      <div className="artist-item__mobile" key={i}>
                        <div className="item-thumbnail">
                          <div className="item-thumbnail_hover"></div>
                          <div className="item-play_icon">
                            <i className="fa fa-heart"></i>
                            <div className="item-thumbnail__icon--play">
                              <Link to={"/artist/" + item._id}>
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
          )}
          {!isLoading && (
            <Swiper
              loop={false}
              loopFillGroupWithBlank={true}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                  slidesPerGroup: 1,
                },
                390: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                  slidesPerGroup: 2,
                },
                540: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                  slidesPerGroup: 3,
                },

                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                  slidesPerGroup: 4,
                },
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 10,
                  slidesPerGroup: 6,
                },
              }}
              className="new-music_slider"
            >
              {data &&
                data.length > 0 &&
                data.map((item, i) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="new-music-item">
                        <div className="item-thumbnail">
                          <div className="item-thumbnail_hover"></div>
                          <div className="item-play_icon">
                            <i className="fa fa-heart"></i>
                            <div className="item-thumbnail__icon--play">
                              <Link to={"/artist/" + item._id}>
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
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
};
export default Artists;
