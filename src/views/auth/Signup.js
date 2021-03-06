import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { btnSignup } from "../../redux/actions";
import { Modal, ModalHeader, ModalBody } from "../utils/Modal";
const Signup = () => {
  const isBtnSignup = useSelector((state) => state.btnSignup);
  const accountError = useRef(null);
  const accountInputError = useRef(null);
  const passwordError = useRef(null);
  const passwordInputError = useRef(null);
  const nameError = useRef(null);
  const nameInputError = useRef(null);
  const emailError = useRef(null);
  const emailInputError = useRef(null);
  const confirmPasswordError = useRef(null);
  const confirmPasswordInputError = useRef(null);
  const confirmPasswordEqualError = useRef(null);
  const Btn = useRef(null);
  let history = useHistory();
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [accountStatus, setAccountStatus] = useState(false);
  const [nameStatus, setNameStatus] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(false);
  const [emailStatus, setEmailStatus] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (currentUser) {
      history.replace("/");
    }
  }, [isBtnSignup]);
  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };
  const emailValidate = validator.isEmail(email);

  useEffect(() => {
    if (accountStatus === true && accountInputError.current && accountError.current) {
      if (account.length < 6) {
        accountInputError.current.style = InputErrorStyle();
        accountError.current.style.display = "block";
      } else {
        accountInputError.current.style = "";
        accountError.current.style.display = "none";
      }
    }
    if (nameStatus === true && nameInputError.current && nameError.current) {
      if (name.length < 2) {
        nameInputError.current.style = InputErrorStyle();
        nameError.current.style.display = "block";
      } else {
        nameError.current.style.display = "none";
        nameInputError.current.style = "";
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
    if (confirmPasswordStatus === true && confirmPasswordInputError.current && confirmPasswordError.current) {
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
    if (emailStatus === true && emailInputError.current && emailError.current) {
      if (!emailValidate) {
        emailInputError.current.style = InputErrorStyle();
        emailError.current.style.display = "block";
      } else {
        emailInputError.current.style = "";
        emailError.current.style.display = "none";
      }
    }
  }, [account, name, password, confirmPassword, email]);
  const fetchAPI = async () => {
    const loadingView = document.querySelector(".loading-opacity");
    if (account.length < 6) {
      accountError.current.style.display = "block";
      accountInputError.current.style = InputErrorStyle();
    }
    if (name.length < 2) {
      nameError.current.style.display = "block";
      nameInputError.current.style = InputErrorStyle();
    }
    if (password.length < 6) {
      passwordError.current.style.display = "block";
      passwordInputError.current.style = InputErrorStyle();
    }
    if (confirmPassword.length < 6) {
      confirmPasswordError.current.style.display = "block";
      confirmPasswordInputError.current.style = InputErrorStyle();
    }
    if (!emailValidate) {
      emailError.current.style.display = "block";
      emailInputError.current.style = InputErrorStyle();
    }
    if (password !== confirmPassword) {
      confirmPasswordEqualError.current.style.display = "block";
      confirmPasswordInputError.current.style = InputErrorStyle();
    }
    if (
      account.length >= 6 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      emailValidate &&
      password === confirmPassword
    ) {
      try {
        setIsClickBtn(true);
        if (loadingView) {
          loadingView.classList.remove("is-hide");
          loadingView.classList.add("is-show");
        }
        Btn.current.style = `opacity: 0.7; pointer-events: none;`;
        Btn.current.textContent = "Signing up...";
        const response = await axios.post("https://random-musics.herokuapp.com/api/v1/users/signup", {
          account,
          name,
          password,
          confirmPassword,
          email,
        });
        Btn.current.style = ``;
        Btn.current.textContent = "Signup";
        localStorage.removeItem("selectedMusic");
        localStorage.removeItem("musicTime");
        localStorage.setItem("accessAccount", true);
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("currentUser", JSON.stringify(response.data.data));
        toast.success("Signup success");
        setIsClickBtn(false);
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
        window.location.replace("/");
      } catch (err) {
        setIsClickBtn(false);
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
        Btn.current.textContent = "Signup";
        Btn.current.style = ``;
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
  const handleChangeName = (e) => {
    if (!isClickBtn) {
      setNameStatus(true);
      setName(e.target.value);
    }
  };
  const handleChangePassword = (e) => {
    if (!isClickBtn) {
      setPasswordStatus(true);
      setPassword(e.target.value);
    }
  };
  const handleChangeConfirmPassword = (e) => {
    if (!isClickBtn) {
      setConfirmPasswordStatus(true);
      setConfirmPassword(e.target.value);
    }
  };
  const handleChangeEmail = (e) => {
    if (!isClickBtn) {
      setEmailStatus(true);
      setEmail(e.target.value);
    }
  };
  const handleCloseModal = () => {
    dispatch(btnSignup(false));
    setAccount("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setEmail("");
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
  const handleHideShowConfirmPassword = () => {
    if (!isClickBtn) {
      if (!isShowConfirmPassword) {
        confirmPasswordInputError.current.type = "text";
      } else {
        confirmPasswordInputError.current.type = "password";
      }
      setIsShowConfirmPassword(!isShowConfirmPassword);
    }
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
          setConfirmPassword("");
          setName("");
          setEmail("");
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
      {isBtnSignup && (
        <Modal>
          <ModalHeader title="Sign up" handleCloseModal={handleCloseModal} />
          <ModalBody>
            <div className="modal__body--message">
              <span className="message--error" ref={accountError}>
                T??i kho???n ph???i t??? 6 k?? t??? tr??? l??n
              </span>
              <span className="message--error" ref={nameError}>
                T??n hi???n th??? ph???i t??? 2 k?? t??? tr??? l??n
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
              <span className="message--error" ref={emailError}>
                Vui l??ng nh???p Email h???p l???
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
                type="text"
                value={name}
                ref={nameInputError}
                placeholder="Name"
                onChange={(e) => handleChangeName(e)}
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
            <div className="modal__body--input">
              <input
                type="password"
                value={confirmPassword}
                ref={confirmPasswordInputError}
                placeholder="Confirm Password"
                onChange={(e) => handleChangeConfirmPassword(e)}
              />
              <label className="password-option" onClick={() => handleHideShowConfirmPassword()}>
                {isShowConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </label>
            </div>
            <div className="modal__body--input">
              <input
                type="text"
                value={email}
                ref={emailInputError}
                placeholder="Email"
                onChange={(e) => handleChangeEmail(e)}
              />
            </div>

            <div className="modal__body--button" ref={Btn} onClick={() => fetchAPI()}>
              Signup
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default Signup;
