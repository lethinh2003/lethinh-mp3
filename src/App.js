import "./styles/body.scss";
import "./styles/modal.scss";

import Navigation from "./views/Navigation";
import MusicPlayer from "./views/MusicPlayer";
import MainPage from "./views/MainPage";

// AUTH
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import Signup from "./views/auth/Signup";
import Profile from "./views/auth/Profile";
import ForgotPassword from "./views/auth/ForgotPassword";
import ResetPassword from "./views/auth/ResetPassword";
import ProfilePassword from "./views/auth/ProfilePassword";

import Layout from "./views/Layout";
import GetCateGory from "./views/category/GetCategory";

import Loading from "./views/Loading";
import "./styles/loading.scss";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications";
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
  return (
    <>
      <div className="ms-layout">
        <Router>
          <Navigation />
          <Loading />

          <Switch>
            <Route path="/" exact={true}>
              <MainPage />
            </Route>
            <Route path="/category/:category" exact={true}>
              <GetCateGory />
            </Route>
            <Route path="/auth/login" exact={true}>
              <Login />
            </Route>
            <Route path="/auth/logout" exact={true}>
              <Logout />
            </Route>
            <Route path="/auth/signup" exact={true}>
              <Signup />
            </Route>
            <Route path="/auth/me" exact={true}>
              <Profile />
            </Route>
            <Route path="/auth/me/password" exact={true}>
              <ProfilePassword />
            </Route>
            <Route path="/auth/forgot-password" exact={true}>
              <ForgotPassword />
            </Route>
            <Route path="/auth/reset-password/:token" exact={true}>
              <ResetPassword />
            </Route>
          </Switch>

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
        </Router>
      </div>
    </>
  );
}

export default App;
