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

import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";

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
        </div>

        <div className="new-music">
          {isLoading &&
            Array.from({ length: 5 }).map((item, i) => {
              return (
                <SkeletonTheme baseColor="#464646" highlightColor="#191420" key={i}>
                  <div className="category-item" style={{ width: "unset" }}>
                    <div className="item-thumbnail">
                      <Skeleton height={178} width={188} />
                    </div>
                    <div className="item-desc">
                      <span className="item-name">
                        <Skeleton />
                      </span>
                      <span className="item_desc">
                        <Skeleton />
                      </span>
                    </div>
                  </div>
                </SkeletonTheme>
              );
            })}
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
