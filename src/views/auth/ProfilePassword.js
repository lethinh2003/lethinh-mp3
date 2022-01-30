import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loading-icons";
import cloudinaryUpload from "../utils/uploads";
import { getUserLogin, removeUserLogin, accessAccount } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import errorAuth from "../utils/errorAuth";

const ProfilePassword = () => {
  const dataUser = useSelector((state) => state.getUserLogin);
  const accessAccount = useSelector((state) => state.accessAccount);
  const dispatch = useDispatch();

  const ChangePasswordBtn = useRef(null);

  const passwordError = useRef(null);
  const currentPasswordError = useRef(null);
  const passwordInputError = useRef(null);
  const currentPasswordInputError = useRef(null);
  const confirmPasswordError = useRef(null);
  const confirmPasswordInputError = useRef(null);
  const confirmPasswordEqualError = useRef(null);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [currentPasswordStatus, setCurrentPasswordStatus] = useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(false);

  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isClickBtn, setIsClickBtn] = useState(false);
  let history = useHistory();
  const currentUser = localStorage.getItem("currentUser");
  const currentUserParse = JSON.parse(currentUser);
  if (!accessAccount) {
    window.location.replace("/");
  }

  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };
  useEffect(() => {
    if (accessAccount) {
      if (currentPasswordStatus === true) {
        if (currentPassword.length < 6) {
          currentPasswordInputError.current.style = InputErrorStyle();
          currentPasswordError.current.style.display = "block";
        } else {
          currentPasswordError.current.style.display = "none";
          currentPasswordInputError.current.style = "";
        }
      }
      if (passwordStatus === true) {
        if (password.length < 6) {
          passwordInputError.current.style = InputErrorStyle();
          passwordError.current.style.display = "block";
        } else {
          passwordError.current.style.display = "none";
          passwordInputError.current.style = "";
        }
      }
      if (confirmPasswordStatus === true) {
        if (confirmPassword.length < 6) {
          confirmPasswordInputError.current.style = InputErrorStyle();
          confirmPasswordError.current.style.display = "block";
        } else {
          confirmPasswordError.current.style.display = "none";
          confirmPasswordInputError.current.style = "";
        }
        if (password !== confirmPassword) {
          confirmPasswordInputError.current.style = InputErrorStyle();
          confirmPasswordEqualError.current.style.display = "block";
        } else {
          confirmPasswordEqualError.current.style.display = "none";
          confirmPasswordInputError.current.style = "";
        }
      }
    }
  }, [password, confirmPassword, currentPassword]);

  const handleClickEdit = () => {
    if (!accessAccount) {
      return window.location.replace("/");
    }
    if (currentPassword.length < 6) {
      currentPasswordError.current.style.display = "block";
      currentPasswordInputError.current.style = InputErrorStyle();
      currentPasswordInputError.current.focus();
    }
    if (password.length < 6) {
      passwordError.current.style.display = "block";
      passwordInputError.current.style = InputErrorStyle();
      passwordInputError.current.focus();
    }
    if (confirmPassword.length < 6) {
      confirmPasswordError.current.style.display = "block";
      confirmPasswordInputError.current.style = InputErrorStyle();
      confirmPasswordInputError.current.focus();
    }
    if (password !== confirmPassword) {
      confirmPasswordEqualError.current.style.display = "block";
      confirmPasswordInputError.current.style = InputErrorStyle();
      confirmPasswordInputError.current.focus();
    }
    if (
      currentPassword.length >= 6 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    ) {
      const handleUpdatePassword = async () => {
        const loadingView = document.querySelector(".loading-opacity");
        try {
          if (loadingView) {
            loadingView.style.display = "block";
          }
          setIsClickBtn(true);
          passwordInputError.current.classList.add("disabled");
          passwordInputError.current.disabled = true;
          currentPasswordInputError.current.classList.add("disabled");
          currentPasswordInputError.current.disabled = true;
          confirmPasswordInputError.current.classList.add("disabled");
          confirmPasswordInputError.current.disabled = true;

          ChangePasswordBtn.current.style = `opacity: 0.7; pointer-events: none;`;
          ChangePasswordBtn.current.textContent = "Changing...";
          const response = await axios.post("https://random-musics.herokuapp.com/api/v1/users/updatePassword", {
            currentPassword,
            password,
            confirmPassword,
          });
          localStorage.setItem("accessAccount", true);
          localStorage.setItem("jwt", response.data.token);

          // localStorage.setItem(
          //   "currentUser",
          //   JSON.stringify(updateUser.data.data)
          // );
          // dispatch(getUserLogin(updateUser.data.data));
          setIsClickBtn(false);
          if (loadingView) {
            loadingView.style.display = "none";
          }
          toast.success("Updated!!");
          ChangePasswordBtn.current.style = ``;
          ChangePasswordBtn.current.textContent = "Change";
          passwordInputError.current.classList.remove("disabled");
          passwordInputError.current.disabled = false;
          currentPasswordInputError.current.classList.remove("disabled");
          currentPasswordInputError.current.disabled = false;
          confirmPasswordInputError.current.classList.remove("disabled");
          confirmPasswordInputError.current.disabled = false;
          history.replace("/");
        } catch (err) {
          if (loadingView) {
            loadingView.style.display = "none";
          }
          setIsClickBtn(false);
          passwordInputError.current.classList.remove("disabled");
          passwordInputError.current.disabled = false;
          currentPasswordInputError.current.classList.remove("disabled");
          currentPasswordInputError.current.disabled = false;
          confirmPasswordInputError.current.classList.remove("disabled");
          confirmPasswordInputError.current.disabled = false;
          if (err.response) {
            toast.error(err.response.data.message);
            errorAuth(err);
          }
          ChangePasswordBtn.current.style = ``;
          ChangePasswordBtn.current.textContent = "Change";
        }
      };
      handleUpdatePassword();
    }
  };

  const handleChangeConfirmPassword = (e) => {
    if (accessAccount) {
      setConfirmPasswordStatus(true);
      setConfirmPassword(e.target.value);
    }
  };

  const handleChangePassword = (e) => {
    if (accessAccount) {
      setPasswordStatus(true);
      setPassword(e.target.value);
    }
  };
  const handleChangeCurrentPassword = (e) => {
    if (accessAccount) {
      setCurrentPasswordStatus(true);
      setCurrentPassword(e.target.value);
    }
  };

  return (
    <>
      {currentUser && (
        <div className="modal-opacity">
          <div className="box-modal" style={{ maxHeight: "400px" }}>
            <div className="modal__header">
              <div className="modal__header--title">Profile</div>
              <Link to="/">
                <div className="modal__header--icon">X</div>
              </Link>
            </div>
            <div className="modal__body">
              <div className="modal__body--info">
                <div className="info--avatar">
                  <img src={currentUserParse.avatar} />
                </div>
                <div className="modal__body--message">
                  <span className="message--error" ref={currentPasswordError}>
                    Mật khẩu hiện tại phải từ 6 kí tự trở lên
                  </span>
                  <span className="message--error" ref={passwordError}>
                    Mật khẩu phải từ 6 kí tự trở lên
                  </span>
                  <span className="message--error" ref={confirmPasswordError}>
                    Nhập lại mật khẩu phải từ 6 kí tự trở lên
                  </span>
                  <span className="message--error" ref={confirmPasswordEqualError}>
                    Vui lòng nhập đúng xác nhận mật khẩu
                  </span>
                </div>

                <div className="modal__body--input">
                  <input
                    type="password"
                    value={currentPassword}
                    ref={currentPasswordInputError}
                    placeholder="Current Password"
                    onChange={(e) => handleChangeCurrentPassword(e)}
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
                </div>
                <div className="modal__body--input">
                  <input
                    type="password"
                    value={confirmPassword}
                    ref={confirmPasswordInputError}
                    placeholder="Confirm Password"
                    onChange={(e) => handleChangeConfirmPassword(e)}
                  />
                </div>
              </div>

              <div className="modal__body--button" ref={ChangePasswordBtn} onClick={() => handleClickEdit()}>
                Change
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ProfilePassword;
