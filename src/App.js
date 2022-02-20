import "./styles/body.scss";
import "./styles/modal.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navigation from "./views/Navigation";
import MusicPlayer from "./views/MusicPlayer";
import MainPage from "./views/MainPage";
import TopPopular from "./views/TopPopular";
import SearchDetail from "./views/SearchDetail";
// AUTH
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import Signup from "./views/auth/Signup";
import Upload from "./views/auth/Upload";
import Profile from "./views/auth/Profile";
import ForgotPassword from "./views/auth/ForgotPassword";
import ResetPassword from "./views/auth/ResetPassword";
import ProfilePassword from "./views/auth/ProfilePassword";
import CreateArtists from "./views/auth/CreateArtists";
import CreateGenres from "./views/auth/CreateGenres";
import User from "./views/User";
import ArtistDetail from "./views/ArtistDetail";
import Overlay from "./views/Overlay";
import Footer from "./views/Footer";
import Layout from "./views/Layout";
import GetCateGory from "./views/category/GetCategory";
import Heart from "./views/Heart";
import Loading from "./views/Loading";
import "./styles/loading.scss";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import ScrollToTop from "./views/utils/ScrollToTop";
import useQuery from "./views/utils/useQuery";
import Musics from "./views/Musics";
import AllArtists from "./views/AllArtists";

function App() {
  ////CONFIG DEFAULT AXIOS
  const AuthToken = localStorage.getItem("jwt");
  if (AuthToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${AuthToken}`;
  } else {
    axios.defaults.headers.common["Authorization"] = null;
  }
  // axios.defaults.headers.post["Content-Type"] = "application/json";

  // SET DEFAULT ACCESS ACCOUNT
  const AccessAccount = localStorage.getItem("accessAccount");
  if (!AccessAccount) {
    localStorage.setItem("accessAccount", false);
  }
  const currentUser = useSelector((state) => state.getUserLogin);

  let query = useQuery();
  return (
    <>
      <Overlay />
      <div className="ms-layout">
        <Navigation />
        {!currentUser && <Login />}
        {!currentUser && <Signup />}
        {currentUser && <Upload />}
        {currentUser && <CreateGenres />}
        {currentUser && <CreateArtists />}
        {currentUser && <Profile />}
        {currentUser && <ProfilePassword />}
        <Loading />
        <Heart />

        <Switch>
          <Route path="/" exact={true}>
            <MainPage />
          </Route>
          <Route path="/search/">
            <SearchDetail q={query.get("q")} tab={query.get("tab")} />
          </Route>
          <Route path="/category/:category" exact={true}>
            <GetCateGory />
          </Route>
          <Route path="/bang-xep-hang/">
            <TopPopular />
          </Route>

          <Route path="/auth/logout" exact={true}>
            <Logout />
          </Route>

          <Route path="/musics/">
            <Musics />
          </Route>
          <Route path="/artists/" exact={true}>
            <AllArtists />
          </Route>
          <Route path="/users/:id">
            <User />
          </Route>
          <Route path="/artists/:id">
            <ArtistDetail />
          </Route>

          <Route path="/auth/forgot-password" exact={true}>
            <ForgotPassword />
          </Route>
          <Route path="/auth/reset-password/:token" exact={true}>
            <ResetPassword />
          </Route>
        </Switch>
        <Footer />
        <ScrollToTop />
        <MusicPlayer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </div>
    </>
  );
}

export default App;
