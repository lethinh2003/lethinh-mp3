import "../styles/playlists.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getCategory } from "../redux/actions";
import { useState, useEffect } from "react";
import axios from "axios";
const Playlists = () => {
  const dataCategoryMusic = useSelector((state) => state.categoryMusic.data);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    const response = await axios
      .get("https://random-musics.herokuapp.com/api/v1/genres")
      .catch((err) => console.log(err));
    if (response) {
      dispatch(getCategory(response.data.data.data));
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <>
      <div className="box-playlists">
        <span className="box-title">Playlists</span>
        <div className="box-playlists__scroll">
          <div className="box-playlists__items">
            {dataCategoryMusic &&
              dataCategoryMusic.length === 0 &&
              Array.from({ length: 4 }).map((item, i) => {
                return (
                  <SkeletonTheme
                    baseColor="#464646"
                    highlightColor="#191420"
                    key={i}
                  >
                    <div className="playlists-item">
                      <Skeleton height={115} width={290} />
                      <span className="playlists-item__title">
                        <Skeleton />
                      </span>
                    </div>
                  </SkeletonTheme>
                );
              })}
            {dataCategoryMusic &&
              dataCategoryMusic.length > 0 &&
              dataCategoryMusic.map((item, i) => {
                return (
                  <Link to={"/category/" + item.slug} exact="true" key={i}>
                    <div className="playlists-item">
                      <img src={item.thumbnail} />
                      <span className="playlists-item__title">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Playlists;
