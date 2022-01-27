import "../styles/artists.scss";
import { useSelector, useDispatch } from "react-redux";
import { getArtists } from "../redux/actions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getPopular } from "../redux/actions";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
// Import Swiper styles
// import "swiper/swiper.scss";
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css";
// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

const Artists = () => {
  const data = useSelector((state) => state.getArtists.data);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    const response = await axios
      .get("https://random-musics.herokuapp.com/api/v1/artists")
      .catch((err) => console.log(err));
    if (response) {
      dispatch(getArtists(response.data.data.data));
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="box-artists-sliders"
      >
        {data &&
          data.length > 0 &&
          data.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="box-artists">
                  <div className="artists-info">
                    <span className="artists-info__name">{item.name}</span>
                    <span className="artists-info__desc">{item.desc}</span>
                    <div className="artists-info__btn">
                      <div className="artists-info__btn--play">Play</div>
                      <div className="artists-info__btn--follow">Follow</div>
                    </div>
                  </div>
                  <div className="artists-image">
                    <img src={item.thumbnail} />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};
export default Artists;
