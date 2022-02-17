import "../styles/artists.scss";
import { useSelector, useDispatch } from "react-redux";
import { getArtists } from "../redux/actions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getPopular } from "../redux/actions";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
SwiperCore.use([Autoplay, Pagination, Navigation]);

const HotArtists = () => {
  const settings = {
    autoplay: true,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/artists");

      setData(response.data.data.data.slice(0, 3));
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
      <div className="box-artists-sliders">
        <Slider {...settings}>
          {data &&
            data.length > 0 &&
            data.map((item, i) => {
              return (
                <div className="box-artists" style={{ display: "flex" }} key={i}>
                  {/* <div className="artists-info">
                    <span className="artists-info__name">{item.name}</span>
                    <span className="artists-info__desc">{item.desc}</span>
                    <div className="artists-info__btn">
                      <div className="artists-info__btn--play">Play</div>
                      <div className="artists-info__btn--follow">Follow</div>
                    </div>
                  </div> */}
                  <div className="artists-image">
                    <img src={item.thumbnail} />
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    </>
  );
};
export default HotArtists;
