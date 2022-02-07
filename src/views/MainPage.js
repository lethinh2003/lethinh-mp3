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
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Upload from "./auth/Upload";
import CreateArtists from "./auth/CreateArtists";
import CreateGenres from "./auth/CreateGenres";

const MainPage = () => {
  return (
    <>
      <Heart />
      <Login />
      <Signup />
      <Upload />
      <CreateGenres />
      <CreateArtists />
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
