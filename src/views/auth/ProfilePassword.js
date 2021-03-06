import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserLogin, removeUserLogin, accessAccount, btnChangePassword } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import errorAuth from "../utils/errorAuth";
import { Modal, ModalHeader, ModalBody } from "../utils/Modal";

const ProfilePassword = () => {
  const isBtnChangePassword = useSelector((state) => state.btnChangePassword);
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

  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };
  useEffect(() => {
    if (isBtnChangePassword) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }, [isBtnChangePassword]);
  useEffect(() => {
    if (accessAccount) {
      if (currentPasswordStatus === true && currentPasswordInputError.current && currentPasswordError.current) {
        if (currentPassword.length < 6) {
          currentPasswordInputError.current.style = InputErrorStyle();
          currentPasswordError.current.style.display = "block";
        } else {
          currentPasswordError.current.style.display = "none";
          currentPasswordInputError.current.style = "";
        }
      }
      if (passwordStatus === true && passwordInputError.current && passwordError.current) {
        if (password.length < 6) {
          passwordInputError.current.style = InputErrorStyle();
          passwordError.current.style.display = "block";
        } else {
          passwordError.current.style.display = "none";
          passwordInputError.current.style = "";
        }
      }
      if (
        confirmPasswordStatus === true &&
        confirmPasswordInputError.current &&
        confirmPasswordError.current &&
        confirmPasswordEqualError.current
      ) {
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
    if (currentPassword.length < 6 && currentPasswordError.current && currentPasswordInputError.current) {
      currentPasswordError.current.style.display = "block";
      currentPasswordInputError.current.style = InputErrorStyle();
      currentPasswordInputError.current.focus();
    }
    if (password.length < 6 && passwordError.current && passwordInputError.current) {
      passwordError.current.style.display = "block";
      passwordInputError.current.style = InputErrorStyle();
      passwordInputError.current.focus();
    }
    if (confirmPassword.length < 6 && confirmPasswordError.current && confirmPasswordInputError.current) {
      confirmPasswordError.current.style.display = "block";
      confirmPasswordInputError.current.style = InputErrorStyle();
      confirmPasswordInputError.current.focus();
    }
    if (password !== confirmPassword && confirmPasswordEqualError.current && confirmPasswordInputError.current) {
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
            loadingView.classList.remove("is-hide");
            loadingView.classList.add("is-show");
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
          setIsClickBtn(false);
          if (loadingView) {
            loadingView.classList.add("is-hide");
            loadingView.classList.remove("is-show");
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
            loadingView.classList.add("is-hide");
            loadingView.classList.remove("is-show");
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
  const handleCloseModal = () => {
    dispatch(btnChangePassword(false));
    setIsClickBtn(false);
    setPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setPasswordStatus(false);
    setConfirmPasswordStatus(false);
    setCurrentPasswordStatus(false);
  };
  return (
    <>
      {isBtnChangePassword && (
        <Modal maxHeight="400px">
          <ModalHeader title="Change Password" handleCloseModal={handleCloseModal} />
          <ModalBody>
            <div className="modal__body--info">
              <div className="modal__body--message">
                <span className="message--error" ref={currentPasswordError}>
                  M???t kh???u hi???n t???i ph???i t??? 6 k?? t??? tr??? l??n
                </span>
                <span className="message--error" ref={passwordError}>
                  M???t kh???u ph???i t??? 6 k?? t??? tr??? l??n
                </span>
                <span className="message--error" ref={confirmPasswordError}>
                  Nh???p l???i m???t kh???u ph???i t??? 6 k?? t??? tr??? l??n
                </span>
                <span className="message--error" ref={confirmPasswordEqualError}>
                  Vui l??ng nh???p ????ng x??c nh???n m???t kh???u
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
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default ProfilePassword;
