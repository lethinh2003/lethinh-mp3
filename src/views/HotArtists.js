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

SwiperCore.use([Autoplay, Pagination, Navigation]);

const HotArtists = () => {
  const settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const introduceBanner = [
    {
      title: "Nghe nhạc online",
      desc: "LT-MP3, hệ thống nghe nhạc online với đủ thể loại bài hát mà bạn có thể muốn nghe!",
      thumbnail: "https://i.imgur.com/zBA3DHQ.png",
    },
    {
      title: "Hoàn toàn miễn phí",
      desc: "Tại LT-MP3, hệ thống nghe nhạc online hoàn toàn miễn phí!",
      thumbnail: "https://i.imgur.com/7PKIX7q.png",
    },
    {
      title: "Thoả thích đăng tải",
      desc: "Tại LT-MP3, hệ thống nghe nhạc online với chức năng tự upload bài hát của bạn!",
      thumbnail: "https://i.imgur.com/4bkzr9H.png",
    },
  ];
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/artists");

      setData(response.data.data.data.slice(-3));
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  useEffect(() => {
    // fetchAPI();
    setData(introduceBanner);
  }, []);
  const genrerateLinearBG = (i) => {
    console.log(i);
    let style = "";
    if (i == 0) {
      style = "box-1";
    } else if (i == 1) {
      style = "box-2";
    } else if (i == 2) {
      style = "box-3";
    } else {
      style = "box-n";
    }
    return style;
  };
  return (
    <>
      <div className="box-introduce-sliders">
        <Slider {...settings}>
          {data &&
            data.length > 0 &&
            data.map((item, i) => {
              return (
                <div className={"box-introduce " + genrerateLinearBG(i)} style={{ display: "flex" }} key={i}>
                  <div className="box-introduce__detail">
                    <div className="introduce-info">
                      <span className="introduce-info__title">{item.title}</span>
                      <span className="introduce-info__desc">{item.desc}</span>
                      {/* <div className="introduce-info__btn">
                        <div className="introduce-info__btn--play">Play</div>
                        <div className="introduce-info__btn--follow">Follow</div>
                      </div> */}
                    </div>
                    <div className="introduce-image">
                      <img src={item.thumbnail} />
                    </div>
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
