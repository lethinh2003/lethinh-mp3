import "./styles/body.scss";
import Navigation from "./views/Navigation";
import MusicPlayer from "./views/MusicPlayer";
import MainPage from "./views/MainPage";
import Login from "./views/Login";
import Logout from "./views/Logout";
import Signup from "./views/Signup";
import Profile from "./views/Profile";
import ProfilePassword from "./views/ProfilePassword";
import GetCateGory from "./views/category/GetCategory";
import "./styles/loading.scss";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
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
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact={true}>
            <MainPage />
          </Route>
          <Route path="/category/:category" exact={true}>
            <GetCateGory />
          </Route>
          <Route path="/login" exact={true}>
            <Login />
          </Route>
          <Route path="/logout" exact={true}>
            <Logout />
          </Route>
          <Route path="/signup" exact={true}>
            <Signup />
          </Route>
          <Route path="/me" exact={true}>
            <Profile />
          </Route>
          <Route path="/me/password" exact={true}>
            <ProfilePassword />
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
    </>
  );
}

export default App;
