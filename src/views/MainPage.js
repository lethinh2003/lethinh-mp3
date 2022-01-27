import "../styles/mainpage.scss";
import UserInfo from "./UserInfo";
import Category from "./Category";
import NewMusic from "./NewMusic";
import Search from "./Search";
import Popular from "./Popular";
import Playlists from "./Playlists";
import Artists from "./Artists";
import Heart from "./Heart";
import Layout from "./Layout";

const MainPage = () => {
  return (
    <>
      <Heart />

      {/* MAINPAGE */}
      <div className="ms-mainpage">
        <Artists />
        <NewMusic />
        <div className="box-two-col">
          <Popular />
          <Playlists />
        </div>
      </div>
    </>
  );
};
export default MainPage;
