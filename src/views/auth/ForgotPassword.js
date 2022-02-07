import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loading-icons";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount } from "../../redux/actions";
import validator from "validator";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const accountError = useRef(null);
  const accountInputError = useRef(null);
  const passwordError = useRef(null);
  const passwordInputError = useRef(null);
  const Btn = useRef(null);
  let history = useHistory();
  const emailError = useRef(null);
  const emailInputError = useRef(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    history.replace("/");
  }
  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };
  const emailValidate = validator.isEmail(email);

  useEffect(() => {
    if (emailStatus === true) {
      if (!emailValidate) {
        emailInputError.current.style = InputErrorStyle();
        emailError.current.style.display = "block";
      } else {
        emailInputError.current.style = "";
        emailError.current.style.display = "none";
      }
    }
  }, [email]);
  const fetchAPI = async () => {
    const loadingView = document.querySelector(".loading-opacity");
    if (!emailValidate) {
      emailError.current.style.display = "block";
      emailInputError.current.style = InputErrorStyle();
      emailInputError.current.focus();
    }
    if (emailValidate) {
      try {
        if (loadingView) {
          loadingView.classList.remove("is-hide");
          loadingView.classList.add("is-show");
        }
        setIsClickBtn(true);
        Btn.current.style = `opacity: 0.7; pointer-events: none;`;
        Btn.current.textContent = "Sending...";
        emailInputError.current.classList.add("disabled");
        emailInputError.current.disabled = true;

        const response = await axios.post("https://random-musics.herokuapp.com/api/v1/users/forgotPassword", {
          email,
        });
        toast.success(response.data.message);
        Btn.current.style = ``;
        Btn.current.textContent = "Send";
        setIsClickBtn(false);
        emailInputError.current.classList.remove("disabled");
        emailInputError.current.disabled = false;
        emailInputError.current.value = "";
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
      } catch (err) {
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
        Btn.current.textContent = "Send";
        Btn.current.style = ``;
        emailInputError.current.classList.remove("disabled");
        emailInputError.current.disabled = false;
        setIsClickBtn(false);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };

  const handleChangeEmail = (e) => {
    if (!isClickBtn) {
      setEmailStatus(true);
      setEmail(e.target.value);
    }
  };

  return (
    <>
      <div className="modal-opacity">
        <div className="box-modal" style={{ maxHeight: "400px" }}>
          <div className="modal__header">
            <div className="modal__header--title">Forgot Password</div>
            <Link to="/">
              <div className="modal__header--icon">X</div>
            </Link>
          </div>
          <div className="modal__body">
            <div className="modal__body--message">
              <span className="message--error" ref={emailError}>
                Vui lòng nhập Email hợp lệ
              </span>
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
              Send
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
