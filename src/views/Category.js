import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCategory } from "../redux/actions";

const Category = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dataCategoryMusic = useSelector((state) => state.categoryMusic.data);
  const dispatch = useDispatch();
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8000/api/music/category").catch((err) => console.log(err));
    if (response) {
      dispatch(getCategory(response.data.data.slice(-4)));
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <div className="box-category">
        <h3 className="title">Category</h3>
        <div className="category">
          {isLoading && (
            <>
              <SkeletonTheme baseColor="#464646" highlightColor="#191420">
                <div className="category-item">
                  <div className="item-thumbnail">
                    <Skeleton height={178} />
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
                <div className="category-item">
                  <div className="item-thumbnail">
                    <Skeleton height={178} />
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
                <div className="category-item">
                  <div className="item-thumbnail">
                    <Skeleton height={178} />
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
                <div className="category-item">
                  <div className="item-thumbnail">
                    <Skeleton height={178} />
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
                <div className="category-item">
                  <div className="item-thumbnail">
                    <Skeleton height={178} />
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
            </>
          )}

          {dataCategoryMusic &&
            dataCategoryMusic.length > 0 &&
            dataCategoryMusic.map((item) => {
              return (
                <>
                  <Link to={"/category/" + item.category} exact>
                    <div className="category-item" key={item.id}>
                      <div className="item-thumbnail">
                        <div className="item-thumbnail_hover"></div>
                        <div className="item-play_icon">
                          <i className="fa fa-play" aria-hidden="true"></i>
                        </div>
                        <img src={item.image} alt="" />
                      </div>
                      <div className="item-desc">
                        <span className="item-name">{item.title}</span>
                        <span className="item_desc">{item.desc}</span>
                      </div>
                    </div>
                  </Link>
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};
export default Category;
