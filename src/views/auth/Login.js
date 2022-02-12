import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, accessAccount, btnLogin, btnSignup } from "../../redux/actions";
import { Modal, ModalHeader, ModalBody } from "../utils/Modal";
const Login = () => {
  const isBtnLogin = useSelector((state) => state.btnLogin);
  const dispatch = useDispatch();
  const accountError = useRef(null);
  const accountInputError = useRef(null);
  const passwordError = useRef(null);
  const passwordInputError = useRef(null);
  const Btn = useRef(null);
  let history = useHistory();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [accountStatus, setAccountStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);

  const currentUser = localStorage.getItem("currentUser");
  useEffect(() => {
    if (currentUser) {
      history.replace("/");
    }
  }, [isBtnLogin]);
  useEffect(() => {
    if (isBtnLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }, [isBtnLogin]);
  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };

  useEffect(() => {
    if (accountStatus === true && accountError.current && accountInputError.current) {
      if (account.length < 6) {
        accountError.current.style.display = "block";
        accountInputError.current.style = InputErrorStyle();
      } else {
        accountError.current.style.display = "none";
        accountInputError.current.style = "";
      }
    }
    if (passwordStatus === true && passwordError.current && passwordInputError.current) {
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
    const loadingView = document.querySelector(".loading-opacity");
    if (account.length < 6) {
      accountError.current.style.display = "block";
      accountInputError.current.style = InputErrorStyle();
      accountInputError.current.focus();
    }
    if (password.length < 6) {
      passwordError.current.style.display = "block";
      passwordInputError.current.style = InputErrorStyle();
      passwordInputError.current.focus();
    }
    if (account.length >= 6 && password.length >= 6) {
      try {
        if (loadingView) {
          loadingView.classList.remove("is-hide");
          loadingView.classList.add("is-show");
        }
        setIsClickBtn(true);
        accountInputError.current.classList.add("disabled");
        accountInputError.current.disabled = true;
        passwordInputError.current.classList.add("disabled");
        passwordInputError.current.disabled = true;
        Btn.current.style = `opacity: 0.7; pointer-events: none;`;
        Btn.current.textContent = "Logging...";
        const response = await axios.post("https://random-musics.herokuapp.com/api/v1/users/login", {
          account,
          password,
        });

        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("accessAccount", true);
        localStorage.setItem("currentUser", JSON.stringify(response.data.data));
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        const getPlayList = await axios.get(
          `https://random-musics.herokuapp.com/api/v1/playlists/${response.data.data._id}/`,
          {}
        );
        const dataStorage = [];
        const data = getPlayList.data.data.data.map((item) => {
          dataStorage.push(item.music[0]);
        });
        localStorage.setItem("MyPlayListMusicFromDB", JSON.stringify(dataStorage));
        localStorage.removeItem("selectedMusic");
        Btn.current.style = ``;
        Btn.current.textContent = "Login";
        accountInputError.current.classList.remove("disabled");
        accountInputError.current.disabled = false;
        passwordInputError.current.classList.remove("disabled");
        passwordInputError.current.disabled = false;
        setIsClickBtn(false);
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }

        toast.success("Login success");
        dispatch(accessAccount(true));
        dispatch(getUserLogin(response.data.data));
        // history.replace("/");
        window.location.replace("/");
      } catch (err) {
        Btn.current.textContent = "Login";
        Btn.current.style = ``;

        accountInputError.current.classList.remove("disabled");
        accountInputError.current.disabled = false;
        passwordInputError.current.classList.remove("disabled");
        passwordInputError.current.disabled = false;
        setIsClickBtn(false);

        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };

  const handleChangeAccount = (e) => {
    if (!isClickBtn) {
      setAccountStatus(true);
      setAccount(e.target.value);
    }
  };
  const handleChangePassword = (e) => {
    if (!isClickBtn) {
      setPasswordStatus(true);
      setPassword(e.target.value);
    }
  };
  const handleHideShowPassword = () => {
    if (!isClickBtn) {
      if (!isShowPassword) {
        passwordInputError.current.type = "text";
      } else {
        passwordInputError.current.type = "password";
      }
      setIsShowPassword(!isShowPassword);
    }
  };
  const handleCloseModal = () => {
    dispatch(btnLogin(false));
    setAccount("");
    setPassword("");
  };
  const handleClickSignup = () => {
    dispatch(btnSignup(true));
    // handleCloseModal();
  };
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        const loadingView = document.querySelector(".loading-opacity");
        const checkIsLoading = loadingView.classList.contains("is-show");
        if (ref.current && !ref.current.contains(event.target) && !checkIsLoading) {
          setAccount("");
          setPassword("");
          handleCloseModal();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  // useOutsideAlerter(wrapperRef);
  return (
    <>
      {isBtnLogin && (
        <Modal maxHeight="400px">
          <ModalHeader title="Login" handleCloseModal={handleCloseModal} />
          <ModalBody>
            <div className="modal__body--message">
              <span className="message--error" ref={accountError}>
                Tài khoản phải từ 6 kí tự trở lên
              </span>
              <span className="message--error" ref={passwordError}>
                Mật khẩu phải từ 6 kí tự trở lên
              </span>
            </div>
            <div className="modal__body--input">
              <input
                type="text"
                value={account}
                ref={accountInputError}
                placeholder="Account"
                onChange={(e) => handleChangeAccount(e)}
              />
            </div>
            <div className="modal__body--input">
              <input
                type="password"
                value={password}
                ref={passwordInputError}
                placeholder="Password"
                onChange={(e) => handleChangePassword(e)}
              />
              <label className="password-option" onClick={() => handleHideShowPassword()}>
                {isShowPassword ? <FiEye /> : <FiEyeOff />}
              </label>
            </div>
            <div className="modal__body--button" ref={Btn} onClick={() => fetchAPI()}>
              Login
            </div>
            <div className="modal__body--message">
              <span className="message--info">
                No account?{" "}
                <span style={{ cursor: "pointer" }} onClick={() => handleClickSignup()}>
                  Sign up
                </span>
              </span>
              <span className="message--info">
                <Link to="/auth/forgot-password">Forgot password</Link>
              </span>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default Login;
