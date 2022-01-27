import "../styles/login.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loading-icons";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount } from "../redux/actions";

const Login = () => {
  const dispatch = useDispatch();
  const accountError = useRef(null);
  const accountInputError = useRef(null);
  const passwordError = useRef(null);
  const passwordInputError = useRef(null);
  const loginBtn = useRef(null);
  let history = useHistory();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [accountStatus, setAccountStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    history.replace("/");
  }
  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };

  useEffect(() => {
    if (accountStatus === true) {
      if (account.length < 6) {
        accountError.current.style.display = "block";
        accountInputError.current.style = InputErrorStyle();
      } else {
        accountError.current.style.display = "none";
        accountInputError.current.style = "";
      }
    }
    if (passwordStatus === true) {
      if (password.length < 6) {
        passwordError.current.style.display = "block";
        passwordInputError.current.style = InputErrorStyle();
      } else {
        passwordError.current.style.display = "none";
        passwordInputError.current.style = "";
      }
    }
  }, [account, password]);
  const fetchAPI = async () => {
    if (account.length < 6) {
      accountError.current.style.display = "block";
      accountInputError.current.style = InputErrorStyle();
    }
    if (password.length < 6) {
      passwordError.current.style.display = "block";
      passwordInputError.current.style = InputErrorStyle();
    }
    if (account.length >= 6 && password.length >= 6) {
      try {
        loginBtn.current.style = `opacity: 0.7; pointer-events: none;`;
        loginBtn.current.textContent = "Logging...";

        const response = await axios.post(
          "https://random-musics.herokuapp.com/api/v1/users/login",
          {
            account,
            password,
          }
        );

        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("accessAccount", true);
        localStorage.setItem("currentUser", JSON.stringify(response.data.data));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        const getPlayList = await axios.get(
          `https://random-musics.herokuapp.com/api/v1/playlists/${response.data.data._id}/`,
          {}
        );
        const dataStorage = [];
        const data = getPlayList.data.data.data.map((item) => {
          dataStorage.push(item.music[0]);
        });
        localStorage.setItem(
          "MyPlayListMusicFromDB",
          JSON.stringify(dataStorage)
        );
        localStorage.removeItem("selectedMusic");
        loginBtn.current.style = ``;
        loginBtn.current.textContent = "Login";
        toast.success("Login success");
        dispatch(accessAccount(true));
        dispatch(getUserLogin(response.data.data));
        // history.replace("/");
        window.location.reload("/");
      } catch (err) {
        loginBtn.current.textContent = "Login";
        loginBtn.current.style = ``;
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };

  const handleChangeAccount = (e) => {
    setAccountStatus(true);
    setAccount(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPasswordStatus(true);
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="login-opacity">
        <div className="box-login">
          <div className="login__header">
            <div className="login__header--title">Login</div>
            <Link to="/">
              <div className="login__header--icon">X</div>
            </Link>
          </div>
          <div className="login__body">
            <div className="login__body--message">
              <span className="message--error" ref={accountError}>
                Tài khoản phải từ 6 kí tự trở lên
              </span>
              <span className="message--error" ref={passwordError}>
                Mật khẩu phải từ 6 kí tự trở lên
              </span>
            </div>
            <div className="login__body--input">
              <input
                type="text"
                value={account}
                ref={accountInputError}
                placeholder="Account"
                onChange={(e) => handleChangeAccount(e)}
              />
            </div>
            <div className="login__body--input">
              <input
                type="password"
                value={password}
                ref={passwordInputError}
                placeholder="Password"
                onChange={(e) => handleChangePassword(e)}
              />
            </div>
            <div
              className="login__body--button"
              ref={loginBtn}
              onClick={() => fetchAPI()}
            >
              Login
            </div>
            <div className="login__body--message">
              <span className="message--info">
                No account? <Link to="/signup">Sign up</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
