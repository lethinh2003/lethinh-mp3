import "../styles/signup.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
const Login = () => {
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
  const signupBtn = useRef(null);
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
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    history.replace("/");
  }
  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };
  const emailValidate = validator.isEmail(email);

  useEffect(() => {
    if (accountStatus === true) {
      if (account.length < 6) {
        accountInputError.current.style = InputErrorStyle();
        accountError.current.style.display = "block";
      } else {
        accountInputError.current.style = "";
        accountError.current.style.display = "none";
      }
    }
    if (nameStatus === true) {
      if (name.length < 2) {
        nameInputError.current.style = InputErrorStyle();
        nameError.current.style.display = "block";
      } else {
        nameError.current.style.display = "none";
        nameInputError.current.style = "";
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
    if (emailStatus === true) {
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
        signupBtn.current.style = `opacity: 0.7; pointer-events: none;`;
        signupBtn.current.textContent = "Signing up...";
        const response = await axios.post(
          "https://random-musics.herokuapp.com/api/v1/users/signup",
          {
            account,
            name,
            password,
            confirmPassword,
            email,
          }
        );
        signupBtn.current.style = ``;
        signupBtn.current.textContent = "Signup";

        localStorage.setItem("accessAccount", true);
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("currentUser", JSON.stringify(response.data.data));
        toast.success("Signup success");
        window.location.reload();
      } catch (err) {
        signupBtn.current.textContent = "Signup";
        signupBtn.current.style = ``;
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
  const handleChangeName = (e) => {
    setNameStatus(true);
    setName(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPasswordStatus(true);
    setPassword(e.target.value);
  };
  const handleChangeConfirmPassword = (e) => {
    setConfirmPasswordStatus(true);
    setConfirmPassword(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmailStatus(true);
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="signup-opacity">
        <div className="box-signup">
          <div className="signup__header">
            <div className="signup__header--title">Signup</div>
            <Link to="/">
              <div className="signup__header--icon">X</div>
            </Link>
          </div>
          <div className="signup__body">
            <div className="signup__body--message">
              <span className="message--error" ref={accountError}>
                Tài khoản phải từ 6 kí tự trở lên
              </span>
              <span className="message--error" ref={nameError}>
                Tên hiển thị phải từ 2 kí tự trở lên
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
              <span className="message--error" ref={emailError}>
                Vui lòng nhập Email hợp lệ
              </span>
            </div>
            <div className="signup__body--input">
              <input
                type="text"
                value={account}
                ref={accountInputError}
                placeholder="Account"
                onChange={(e) => handleChangeAccount(e)}
              />
            </div>
            <div className="signup__body--input">
              <input
                type="text"
                value={name}
                ref={nameInputError}
                placeholder="Name"
                onChange={(e) => handleChangeName(e)}
              />
            </div>
            <div className="signup__body--input">
              <input
                type="password"
                value={password}
                ref={passwordInputError}
                placeholder="Password"
                onChange={(e) => handleChangePassword(e)}
              />
            </div>
            <div className="signup__body--input">
              <input
                type="password"
                value={confirmPassword}
                ref={confirmPasswordInputError}
                placeholder="Confirm Password"
                onChange={(e) => handleChangeConfirmPassword(e)}
              />
            </div>
            <div className="signup__body--input">
              <input
                type="text"
                value={email}
                ref={emailInputError}
                placeholder="Email"
                onChange={(e) => handleChangeEmail(e)}
              />
            </div>
            <div
              className="signup__body--button"
              ref={signupBtn}
              onClick={() => fetchAPI()}
            >
              Signup
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
