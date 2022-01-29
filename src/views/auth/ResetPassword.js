import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { Link, useHistory, Redirect, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loading-icons";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount } from "../../redux/actions";
import validator from "validator";

const ResetPassword = () => {
  let { token } = useParams();

  const dispatch = useDispatch();

  const passwordError = useRef(null);
  const passwordInputError = useRef(null);
  const Btn = useRef(null);
  let history = useHistory();
  const confirmPasswordError = useRef(null);
  const confirmPasswordInputError = useRef(null);
  const confirmPasswordEqualError = useRef(null);

  const [status, setStatus] = useState(500);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(false);

  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    history.replace("/");
  }
  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };

  const checkTokenValid = async () => {
    try {
      const response = await axios.get("https://random-musics.herokuapp.com/api/v1/users/resetPassword/" + token);
      setStatus(response.status);
    } catch (err) {
      history.replace("/");
      console.log(err);
    }
  };
  useEffect(() => {
    checkTokenValid();
  }, []);
  useEffect(() => {
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
  }, [password, confirmPassword]);

  const fetchAPI = async () => {
    console.log(status);
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
    if (password.length >= 6 && confirmPassword.length >= 6 && password === confirmPassword && status === 200) {
      try {
        Btn.current.style = `opacity: 0.7; pointer-events: none;`;
        Btn.current.textContent = "Sending...";

        const response = await axios.post("https://random-musics.herokuapp.com/api/v1/users/resetPassword/" + token, {
          password,
          confirmPassword,
        });
        toast.success(response.data.message);
        Btn.current.style = ``;
        Btn.current.textContent = "Send";
        setTimeout(() => {
          history.replace("/");
        }, 3000);
      } catch (err) {
        Btn.current.textContent = "Send";
        Btn.current.style = ``;
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };

  const handleChangePassword = (e) => {
    setPasswordStatus(true);
    setPassword(e.target.value);
  };
  const handleChangeConfirmPassword = (e) => {
    setConfirmPasswordStatus(true);
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      {status === 200 && (
        <div className="modal-opacity">
          <div className="box-modal" style={{ maxHeight: "400px" }}>
            <div className="modal__header">
              <div className="modal__header--title">Reset Password</div>
              <Link to="/">
                <div className="modal__header--icon">X</div>
              </Link>
            </div>
            <div className="modal__body">
              <div className="modal__body--message">
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
                  value={password}
                  ref={passwordInputError}
                  placeholder="New Password"
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

              <div className="modal__body--button" ref={Btn} onClick={() => fetchAPI()}>
                Send
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ResetPassword;
