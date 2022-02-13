import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsCloudUpload } from "react-icons/bs";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserLogin, btnProfile, btnChangePassword } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import errorAuth from "../utils/errorAuth";
import { Modal, ModalHeader, ModalBody } from "../utils/Modal";
import { isImage } from "../utils/checkFileType";
const Profile = () => {
  const dataUser = useSelector((state) => state.getUserLogin);
  const isBtnProfile = useSelector((state) => state.btnProfile);
  const accessAccount = useSelector((state) => state.accessAccount);
  const dispatch = useDispatch();
  const nameError = useRef(null);
  const profileBtn = useRef(null);
  const nameInput = useRef(null);
  const accountInput = useRef(null);
  const avatarInput = useRef(null);
  const fileName = useRef(null);
  const [isClickBtn, setIsClickBtn] = useState(false);
  let history = useHistory();
  if (!accessAccount) {
    window.location.replace("/");
  }
  const [name, setName] = useState(dataUser ? dataUser.name : "");
  const [nameStatus, setNameStatus] = useState(false);
  const [isEditClick, setIsEditClick] = useState(false);

  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };
  useEffect(() => {
    if (isBtnProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }, [isBtnProfile]);
  useEffect(() => {
    if (accessAccount && accountInput.current && nameInput.current && avatarInput.current) {
      if (!isEditClick) {
        accountInput.current.classList.add("disabled");
        nameInput.current.classList.add("disabled");
        avatarInput.current.parentElement.style.display = "none";
      } else {
        nameInput.current.disabled = false;
        nameInput.current.classList.remove("disabled");
        avatarInput.current.parentElement.style.display = "block";
        profileBtn.current.textContent = "Save";
      }
    }
  }, [isEditClick]);
  useEffect(() => {
    if (avatarInput.current) {
      if (isClickBtn) {
        avatarInput.current.disabled = true;
      } else {
        avatarInput.current.disabled = false;
      }
    }
  }, [isClickBtn]);

  useEffect(() => {
    if (accessAccount) {
      if (nameStatus === true && nameError.current && nameInput.current) {
        if (name.length < 2) {
          nameError.current.style.display = "block";
          nameInput.current.style = InputErrorStyle();
        } else {
          nameError.current.style.display = "none";
          nameInput.current.style = "";
        }
      }
    }
  }, [name]);

  const handleClickEdit = () => {
    const loadingView = document.querySelector(".loading-opacity");
    if (!accessAccount) {
      return window.location.replace("/");
    }

    if (isEditClick) {
      if (name.length < 2 && nameError.current && nameInput.current) {
        nameError.current.style.display = "block";
        nameInput.current.style = InputErrorStyle();
        nameInput.current.focus();
      } else if (name.length >= 2 && nameError.current && nameInput.current) {
        const handleUploadAvatar = async () => {
          const checkFile = avatarInput.current.files[0];
          console.log(isImage(checkFile));
          try {
            if (loadingView) {
              loadingView.classList.remove("is-hide");
              loadingView.classList.add("is-show");
            }
            setIsClickBtn(true);
            nameInput.current.classList.add("disabled");
            nameInput.current.disabled = true;
            profileBtn.current.style = `opacity: 0.7; pointer-events: none;`;
            profileBtn.current.textContent = "Updating...";
            if (checkFile && isImage(checkFile)) {
              const uploadData = new FormData();
              uploadData.append("file", avatarInput.current.files[0], "file");

              const response = await axios({
                method: "post",
                url: "https://random-musics.herokuapp.com/api/v1/users/upload-avatar",
                data: uploadData,
                headers: {
                  "Content-Type": `multipart/form-data;`,
                },
              });
              const path = response.data.data;
              const updateUser = await axios.post("https://random-musics.herokuapp.com/api/v1/users/update", {
                name: name,
                avatar: path,
              });
              localStorage.setItem("currentUser", JSON.stringify(updateUser.data.data));
              dispatch(getUserLogin(updateUser.data.data));
            } else {
              const path = dataUser.avatar;
              const updateUser = await axios.post("https://random-musics.herokuapp.com/api/v1/users/update", {
                name: name,
                avatar: path,
              });
              localStorage.setItem("currentUser", JSON.stringify(updateUser.data.data));
              dispatch(getUserLogin(updateUser.data.data));
            }
            nameInput.current.classList.remove("disabled");
            nameInput.current.disabled = false;
            setIsClickBtn(false);
            if (loadingView) {
              loadingView.classList.add("is-hide");
              loadingView.classList.remove("is-show");
            }

            toast.success("Updated!!");
            profileBtn.current.style = ``;
            profileBtn.current.textContent = "Edit";
            setIsEditClick(false);
            nameInput.current.disabled = true;
            avatarInput.current.value = null;
            fileName.current.textContent = "";
          } catch (err) {
            if (loadingView) {
              loadingView.classList.add("is-hide");
              loadingView.classList.remove("is-show");
            }
            if (err.response) {
              toast.error(err.response.data.message);
              errorAuth(err);
            }
            setIsClickBtn(false);
            nameInput.current.classList.remove("disabled");
            nameInput.current.disabled = false;
            profileBtn.current.style = ``;
            profileBtn.current.textContent = "Edit";
          }
        };
        handleUploadAvatar();
      }
    }
    setIsEditClick(true);
  };

  const handleChangeName = (e) => {
    if (accessAccount) {
      setNameStatus(true);
      setName(e.target.value);
    }
  };
  const handleChangeFileUpload = (e) => {
    if (e.target.files.length > 0 && fileName.current) {
      fileName.current.textContent = e.target.files[0].name;
    } else {
      fileName.current.textContent = "";
    }
  };
  const handleCloseModal = () => {
    dispatch(btnProfile(false));
    setIsClickBtn(false);
    setIsEditClick(false);
    setName(dataUser.name);
  };
  const handleClickChangePassword = () => {
    dispatch(btnChangePassword(true));
  };

  return (
    <>
      {isBtnProfile && (
        <Modal maxHeight="400px">
          <ModalHeader title="Profile" handleCloseModal={handleCloseModal} />
          <ModalBody>
            <div className="modal__body--info">
              <div className="info--avatar">
                <img src={dataUser.avatar} />
              </div>

              <div className="input-file" style={{ display: "none" }}>
                <input
                  type="file"
                  name="file"
                  ref={avatarInput}
                  id="file"
                  onChange={(e) => handleChangeFileUpload(e)}
                />
                <label htmlFor="file" className="input-label">
                  <BsCloudUpload />
                </label>
                <label className="file_name" ref={fileName}></label>
              </div>
              <div className="modal__body--message">
                <span className="message--error" ref={nameError}>
                  Tên phải từ 2 kí tự trở lên
                </span>
              </div>
              <div className="modal__body--input">
                <input type="text" className="disabled" ref={accountInput} value={dataUser.account} disabled />
              </div>
              <div className="modal__body--input">
                <input
                  type="text"
                  className="disabled"
                  ref={nameInput}
                  value={name}
                  name="name"
                  onChange={(e) => handleChangeName(e)}
                  disabled
                />
              </div>
            </div>

            <div className="modal__body--button" ref={profileBtn} onClick={() => handleClickEdit()}>
              Edit
            </div>
            <div className="modal__body--message">
              <span className="message--info" style={{ cursor: "pointer" }} onClick={() => handleClickChangePassword()}>
                Change password
              </span>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default Profile;
