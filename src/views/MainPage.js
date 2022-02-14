import "../styles/mainpage.scss";
import UserInfo from "./UserInfo";
import Category from "./Category";
import NewMusic from "./NewMusic";
import Search from "./Search";
import Popular from "./Popular";
import Playlists from "./Playlists";
import Artists from "./Artists";
import HotArtists from "./HotArtists";
import Heart from "./Heart";
import Layout from "./Layout";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Upload from "./auth/Upload";
import CreateArtists from "./auth/CreateArtists";
import CreateGenres from "./auth/CreateGenres";
import TopPopular from "./TopPopular";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const MainPage = () => {
  return (
    <>
      {/* MAINPAGE */}

      <div className="ms-mainpage">
        <HotArtists />
        <NewMusic />
        <div className="box-two-col">
          <Popular />
          <Playlists />
        </div>
        <Artists />
      </div>
    </>
  );
};
export default MainPage;
