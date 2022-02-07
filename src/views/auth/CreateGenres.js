import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount, btnCreateGenres } from "../../redux/actions";
const CreateGenres = () => {
  const isBtnCreateGenres = useSelector((state) => state.btnCreateGenres);
  const dataUser = useSelector((state) => state.getUserLogin);
  const thumbnail = useRef(null);
  const thumbnailError = useRef(null);
  const thumbnailInput = useRef(null);
  const nameError = useRef(null);
  const nameInputError = useRef(null);
  const Btn = useRef(null);
  const messageGenres = useRef(null);
  let history = useHistory();

  const [name, setName] = useState("");

  const [thumbnailStatus, setThumbnailStatus] = useState(false);
  const [nameStatus, setNameStatus] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!currentUser) {
      history.replace("/");
    }
  }, [isClickBtn]);

  const InputErrorStyle = () => {
    return "color: red; border-color: rgb(253 5 37);";
  };

  useEffect(() => {
    if (nameStatus === true && nameInputError.current && nameError.current) {
      if (name.length < 2) {
        nameInputError.current.style = InputErrorStyle();
        nameError.current.style.display = "block";
      } else {
        nameInputError.current.style = "";
        nameError.current.style.display = "none";
      }
    }
    if (thumbnailStatus && thumbnailError.current) {
      const checkThumbnail = thumbnailInput.current.files[0];
      if (!checkThumbnail) {
        thumbnailError.current.style.display = "block";
      } else {
        thumbnailError.current.style.display = "none";
      }
    }
  }, [name]);
  const fetchAPI = async () => {
    const loadingView = document.querySelector(".loading-opacity");
    const checkThumbnail = thumbnailInput.current.files[0];

    if (name.length < 2) {
      nameError.current.style.display = "block";
      nameInputError.current.style = InputErrorStyle();
    } else {
      nameInputError.current.style = "";
      nameError.current.style.display = "none";
    }
    if (!checkThumbnail || !isImage(checkThumbnail)) {
      thumbnailError.current.style.display = "block";
    } else {
      thumbnailError.current.style.display = "none";
    }

    if (name.length >= 2 && nameStatus && thumbnailStatus && checkThumbnail && isImage(checkThumbnail)) {
      try {
        setIsClickBtn(true);
        if (loadingView) {
          loadingView.classList.remove("is-hide");
          loadingView.classList.add("is-show");
        }
        Btn.current.style = `opacity: 0.7; pointer-events: none;`;
        Btn.current.textContent = "Creating...";
        const uploadThumbnailData = new FormData();
        uploadThumbnailData.append("file", thumbnailInput.current.files[0], "file");

        const uploadThumbnail = await axios({
          method: "post",
          url: "https://random-musics.herokuapp.com/api/v1/musics/upload-thumbnail",
          data: uploadThumbnailData,
          headers: {
            "Content-Type": `multipart/form-data;`,
          },
        });
        const pathThumbnail = uploadThumbnail.data.data;
        const createMusic = await axios.post("https://random-musics.herokuapp.com/api/v1/genres", {
          name,
          thumbnail: pathThumbnail,
        });
        setName("");
        setThumbnailStatus(false);
        setNameStatus(false);

        thumbnail.current.textContent = "";
        thumbnailInput.current.value = "";
        createSuccess(name);
        Btn.current.style = ``;
        Btn.current.textContent = "Create";
        toast.success("Create success");
        setIsClickBtn(false);
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
      } catch (err) {
        setIsClickBtn(false);
        if (loadingView) {
          loadingView.classList.add("is-hide");
          loadingView.classList.remove("is-show");
        }
        Btn.current.textContent = "Create";
        Btn.current.style = ``;
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };
  const isImage = (file) => {
    if (file) {
      return !!file.type.match("image.*");
    } else {
      return false;
    }
  };

  const handleChangeThumbnail = (e) => {
    if (!isClickBtn) {
      setThumbnailStatus(true);
      if (e.target.files.length > 0) {
        thumbnail.current.textContent = e.target.files[0].name;
      } else {
        thumbnail.current.textContent = "";
      }
    }
  };

  const handleChangeName = (e) => {
    if (!isClickBtn) {
      setNameStatus(true);
      setName(e.target.value);
    }
  };

  const handleCloseModal = () => {
    dispatch(btnCreateGenres(false));
    setName("");
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        const loadingView = document.querySelector(".loading-opacity");
        const checkIsLoading = loadingView.classList.contains("is-show");
        if (ref.current && !ref.current.contains(event.target) && !checkIsLoading) {
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
  //   useOutsideAlerter(wrapperRef);
  const styleH6 = () => {
    return {
      paddingTop: "10px",
      color: "black",
      width: "100%",
    };
  };
  const createSuccess = (name) => {
    const spanClass = document.createElement("span");
    spanClass.classList.add("message--info");
    const textnode = document.createTextNode(`Tạo thành công ${name}`);
    spanClass.appendChild(textnode);
    messageGenres.current.appendChild(spanClass);
    setTimeout(() => {
      removeSuccess();
    }, 1500);
  };
  const removeSuccess = () => {
    messageGenres.current.removeChild(messageGenres.current.childNodes[2]);
  };
  return (
    <>
      {isBtnCreateGenres && (
        <div className="modal-opacity">
          <div className="box-modal" ref={wrapperRef} style={{ height: "350px" }}>
            <div className="modal__header">
              <div className="modal__header--title">Create Genres</div>

              <div className="modal__header--icon" onClick={() => handleCloseModal()}>
                <AiOutlineCloseSquare />
              </div>
            </div>
            <div className="modal__body">
              <div className="modal__body--message" ref={messageGenres}>
                <span className="message--error" ref={nameError}>
                  Tên thể loại phải từ 2 kí tự trở lên
                </span>
                <span className="message--error" ref={thumbnailError}>
                  Vui lòng chọn ảnh thumbnail
                </span>
              </div>
              <h6 style={styleH6()}>
                Thể loại (Genres) <span style={{ color: "red" }}>*</span>
              </h6>
              <div className="modal__body--input">
                <input
                  type="text"
                  value={name}
                  ref={nameInputError}
                  placeholder="Name"
                  onChange={(e) => handleChangeName(e)}
                />
              </div>

              <h6 style={styleH6()}>
                Thumbnail <span style={{ color: "red" }}>*</span>
              </h6>
              <div className="input-file">
                <input
                  type="file"
                  name="file"
                  ref={thumbnailInput}
                  id="fileThumbnailGenres"
                  onChange={(e) => handleChangeThumbnail(e)}
                />
                <label htmlFor="fileThumbnailGenres" className="input-label">
                  <BsCloudUpload />
                </label>
                <label className="file_name" ref={thumbnail}></label>
              </div>

              <div className="modal__body--button" ref={Btn} onClick={() => fetchAPI()}>
                Create
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CreateGenres;
