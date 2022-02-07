
import "./getcategory.scss";
import APIMusic from "../../api/APIMusic";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
const GetCateGory = () => {
  const { category } = useParams();
  let history = useHistory();

  const { data, isLoading } = APIMusic("getMusicCategory", 1000, category);
  const { data: dataCategory, isLoading: loading2 } = APIMusic("getMusicCategoryDetail", 1000, category);

  const [dataCategoryMusic, setDataCategoryMusic] = useState([]);

  useEffect(() => {
    if (category) {
      setDataCategoryMusic(data);
      document.title = category + " Category";
    }
  });
  const handleBack = () => {
    history.push("/");
  };

  return (
    <div className="mainpage">
      <div className="category-container mg-20px">
        <div className="box-left">
          {loading2 && (
            <>
              <SkeletonTheme baseColor="#464646" highlightColor="#191420">
                <div className="left-images">
                  <Skeleton height={300} />
                </div>
                <div className="left-desc">
                  <span className="desc-title">
                    <Skeleton />
                  </span>
                  <span className="desc-author">
                    <Skeleton />
                  </span>
                </div>
              </SkeletonTheme>
            </>
          )}
          {dataCategory &&
            dataCategory.length > 0 &&
            dataCategory.map((item, i) => {
              return (
                <>
                  <div key={i}>
                    <div className="left-images">
                      <img src={item.image} />
                    </div>
                    <div className="left-desc">
                      <span className="desc-title">{item.title}</span>
                      <span className="desc-author">{item.desc}</span>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="box-right">
          <span className="icon-back" onClick={() => handleBack()}>
            <TiArrowBackOutline />
          </span>
          <span className="right-title">Bạn đang xem PlayList {category}</span>
          <div className="box-right_data mg-bt-20px">
            {isLoading && (
              <>
                <SkeletonTheme baseColor="#464646" highlightColor="#191420">
                  <div className="right-list_item">
                    <div className="list-item_left">
                      <Skeleton height={50} />
                    </div>
                    <div className="list-item_right">
                      <span className="item-right_name">
                        <Skeleton />
                      </span>
                      <span className="item-right_author">
                        <Skeleton />
                      </span>
                    </div>
                  </div>
                </SkeletonTheme>
                <SkeletonTheme baseColor="#464646" highlightColor="#191420">
                  <div className="right-list_item">
                    <div className="list-item_left">
                      <Skeleton height={50} />
                    </div>
                    <div className="list-item_right">
                      <span className="item-right_name">
                        <Skeleton />
                      </span>
                      <span className="item-right_author">
                        <Skeleton />
                      </span>
                    </div>
                  </div>
                </SkeletonTheme>
                <SkeletonTheme baseColor="#464646" highlightColor="#191420">
                  <div className="right-list_item">
                    <div className="list-item_left">
                      <Skeleton height={50} />
                    </div>
                    <div className="list-item_right">
                      <span className="item-right_name">
                        <Skeleton />
                      </span>
                      <span className="item-right_author">
                        <Skeleton />
                      </span>
                    </div>
                  </div>
                </SkeletonTheme>
              </>
            )}
            {!isLoading && dataCategoryMusic.length === 0 && (
              <span style={{ color: "red" }}>Không tìm thấy kết quả!</span>
            )}
            {dataCategoryMusic &&
              dataCategoryMusic.length > 0 &&
              dataCategoryMusic.map((item, i) => {
                return (
                  <div className="right-list_item" key={i}>
                    <div className="list-item_left">
                      <img src={item.image} />
                    </div>
                    <div className="list-item_right">
                      <span className="item-right_name">{item.name}</span>
                      <span className="item-right_author">{item.author}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GetCateGory;
