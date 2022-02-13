import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsCloudUpload } from "react-icons/bs";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector, useDispatch } from "react-redux";
import { btnUpload, btnCreateArtist, btnCreateGenres } from "../../redux/actions";
import { Modal, ModalHeader, ModalBody } from "../utils/Modal";
import { isImage, isAudio } from "../utils/checkFileType";
const Upload = () => {
  const isBtnUpload = useSelector((state) => state.btnUpload);
  const isBtnCreateArtist = useSelector((state) => state.btnCreateArtist);
  const isBtnCreateGenres = useSelector((state) => state.btnCreateGenres);
  const dataUser = useSelector((state) => state.getUserLogin);
  const thumbnail = useRef(null);
  const thumbnailError = useRef(null);
  const thumbnailInput = useRef(null);
  const link = useRef(null);
  const linkError = useRef(null);
  const linkInput = useRef(null);
  const nameError = useRef(null);
  const nameInputError = useRef(null);
  const artistError = useRef(null);
  const artistInputError = useRef(null);
  const genresError = useRef(null);
  const genresInputError = useRef(null);
  const Btn = useRef(null);
  let history = useHistory();
  const [listArtists, setListArtists] = useState([]);
  const [listGenres, setListGenres] = useState([]);
  const [name, setName] = useState("");
  const [artist, setArtist] = useState([]);
  const [genres, setGenres] = useState([]);
  const [thumbnailStatus, setThumbnailStatus] = useState(false);
  const [nameStatus, setNameStatus] = useState(false);
  const [linkStatus, setLinkStatus] = useState(false);
  const [artistStatus, setArtistStatus] = useState(false);
  const [genresStatus, setGenresStatus] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [isLoadingArtists, setIsLoadingArtists] = useState(true);
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!currentUser) {
      history.replace("/");
    }
  }, [isClickBtn]);
  useEffect(() => {
    if (isBtnUpload) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }, [isBtnUpload]);
  const getListArtistsAndGenres = async () => {
    setIsLoadingGenres(true);
    setIsLoadingArtists(true);
    const getListArtists = axios.get("https://random-musics.herokuapp.com/api/v1/artists");
    const getListGenres = axios.get("https://random-musics.herokuapp.com/api/v1/genres");

    await Promise.all([getListArtists, getListGenres])
      .then((data) => {
        setIsLoadingGenres(false);
        setIsLoadingArtists(false);
        setListArtists(data[0].data.data.data);
        setListGenres(data[1].data.data.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingGenres(false);
        setIsLoadingArtists(false);
      });
  };
  useEffect(() => {
    getListArtistsAndGenres();
  }, [isBtnUpload, isBtnCreateArtist, isBtnCreateGenres]);
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
    if (linkStatus && linkError.current) {
      const checkLink = linkInput.current.files[0];
      if (!checkLink) {
        linkError.current.style.display = "block";
      } else {
        linkError.current.style.display = "none";
      }
    }
    if (genresStatus && genresError.current && genresInputError.current) {
      if (genres.length < 1) {
        genresError.current.style.display = "block";
        genresInputError.current.style = InputErrorStyle();
      } else {
        genresInputError.current.style = "";
        genresError.current.style.display = "none";
      }
    }
    if (artistStatus && artistError.current && artistInputError.current) {
      if (artist.length < 1 || artist[0] === "null") {
        artistError.current.style.display = "block";
        artistInputError.current.style = InputErrorStyle();
      } else {
        artistError.current.style.display = "none";
        artistInputError.current.style = "";
      }
    }
  }, [name, genres, artist]);
  const fetchAPI = async () => {
    const loadingView = document.querySelector(".loading-opacity");
    const checkThumbnail = thumbnailInput.current.files[0];
    const checkLink = linkInput.current.files[0];

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
    if (!checkLink || !isAudio(checkLink)) {
      linkError.current.style.display = "block";
    } else {
      linkError.current.style.display = "none";
    }
    if (genres.length < 1) {
      genresError.current.style.display = "block";
      genresInputError.current.style = InputErrorStyle();
    } else {
      genresError.current.style.display = "none";
      genresInputError.current.style = "";
    }
    if (artist.length < 1 || artist[0] === "null") {
      artistError.current.style.display = "block";
      artistInputError.current.style = InputErrorStyle();
    } else {
      artistInputError.current.style = "";
      artistError.current.style.display = "none";
    }

    if (
      name.length >= 2 &&
      checkThumbnail &&
      checkLink &&
      isAudio(checkLink) &&
      isImage(checkThumbnail) &&
      artist.length >= 1 &&
      genres.length >= 1
    ) {
      try {
        setIsClickBtn(true);
        if (loadingView) {
          loadingView.classList.remove("is-hide");
          loadingView.classList.add("is-show");
        }
        Btn.current.style = `opacity: 0.7; pointer-events: none;`;
        Btn.current.textContent = "Uploading...";
        const uploadThumbnailData = new FormData();
        uploadThumbnailData.append("file", thumbnailInput.current.files[0], "file");
        const uploadLinkData = new FormData();
        uploadLinkData.append("file", linkInput.current.files[0], "file");

        const uploadThumbnail = axios({
          method: "post",
          url: "https://random-musics.herokuapp.com/api/v1/musics/upload-thumbnail",
          data: uploadThumbnailData,
          headers: {
            "Content-Type": `multipart/form-data;`,
          },
        });
        const uploadLink = axios({
          method: "post",
          url: "https://random-musics.herokuapp.com/api/v1/musics/upload-link",
          data: uploadLinkData,
          headers: {
            "Content-Type": `multipart/form-data;`,
          },
        });
        await Promise.all([uploadThumbnail, uploadLink]).then(async (data) => {
          const pathThumbnail = data[0].data.data;
          const pathLink = data[1].data.data;
          if (pathThumbnail && pathLink) {
            const createMusic = await axios.post("https://random-musics.herokuapp.com/api/v1/musics", {
              name,
              thumbnail: pathThumbnail,
              link: pathLink,
              artist: artist,
              genres: genres,
              uploadBy: [dataUser._id],
            });
          }
        });

        Btn.current.style = ``;
        Btn.current.textContent = "Upload";

        toast.success("Upload success");
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
        Btn.current.textContent = "Upload";
        Btn.current.style = ``;
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
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
  const handleChangeLink = (e) => {
    if (!isClickBtn) {
      setLinkStatus(true);
      if (e.target.files.length > 0) {
        link.current.textContent = e.target.files[0].name;
      } else {
        link.current.textContent = "";
      }
    }
  };

  const handleChangeName = (e) => {
    if (!isClickBtn) {
      setNameStatus(true);
      setName(e.target.value);
    }
  };
  const handleChangeArtist = (e) => {
    if (!isClickBtn) {
      setArtistStatus(true);
      setArtist([e.target.value]);
    }
  };

  const checkExistGenres = (id) => {
    let check = false;
    if (genres && genres.length > 0) {
      genres.forEach((item) => {
        if (item === id) {
          check = true;
        }
      });
    }
    return check;
  };
  const handleAddGenres = (e) => {
    if (!isClickBtn) {
      setGenresStatus(true);
      if (!checkExistGenres(e)) {
        const data = [...genres];
        data.push(e);
        setGenres(data);
      } else {
        const data = [...genres];
        const newData = data.filter((item) => item !== e);
        setGenres(newData);
      }
    }
  };

  const handleCloseModal = () => {
    dispatch(btnUpload(false));
    setGenres([]);
    setArtist([]);
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
  // useOutsideAlerter(wrapperRef);
  const styleH6 = () => {
    return {
      paddingTop: "10px",
      color: "black",
      width: "100%",
    };
  };
  const handleClickCreateArtists = () => {
    dispatch(btnCreateArtist(true));
  };
  const handleClickCreateGenres = () => {
    dispatch(btnCreateGenres(true));
  };

  return (
    <>
      {isBtnUpload && (
        <Modal maxHeight="750px">
          <ModalHeader title="Upload MP3" handleCloseModal={handleCloseModal} />
          <ModalBody>
            <div className="modal__body--message">
              <span className="message--error" ref={nameError}>
                Tên bài hát phải từ 2 kí tự trở lên
              </span>
              <span className="message--error" ref={thumbnailError}>
                Vui lòng chọn ảnh thumbnail
              </span>
              <span className="message--error" ref={linkError}>
                Vui lòng chọn bài hát
              </span>
              <span className="message--error" ref={artistError}>
                Vui lòng chọn nghệ sĩ
              </span>
              <span className="message--error" ref={genresError}>
                Vui lòng chọn thể loại
              </span>
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
            <h6 style={styleH6()}>
              Nghệ sĩ (Artist) <span style={{ color: "red" }}>* </span>
              <span onClick={() => handleClickCreateArtists()} style={{ color: "#3765bb", cursor: "pointer" }}>
                Thêm
              </span>
            </h6>
            <div className="modal__body--input">
              {isLoadingArtists && (
                <SkeletonTheme baseColor="#c3c1c1" highlightColor="#aaa9ab">
                  <Skeleton height={40} width={"100%"} style={{ border: "unset" }} />
                </SkeletonTheme>
              )}
              {!isLoadingArtists && (
                <select onChange={(e) => handleChangeArtist(e)} ref={artistInputError}>
                  <option value="null">Nghệ sĩ (Artist)</option>
                  {listArtists &&
                    listArtists.length > 0 &&
                    listArtists.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <h6 style={styleH6()}>
              Thể loại (Genres) <span style={{ color: "red" }}>* </span>
              <span onClick={() => handleClickCreateGenres()} style={{ color: "#3765bb", cursor: "pointer" }}>
                Thêm
              </span>
            </h6>
            <div className="modal__body--input" style={{ height: "100px" }}>
              <div className="input-select" ref={genresInputError}>
                <div className="input-select__body">
                  {isLoadingGenres &&
                    Array.from({ length: 4 }).map((item, i) => {
                      return (
                        <SkeletonTheme baseColor="#c3c1c1" highlightColor="#aaa9ab" key={i}>
                          <Skeleton
                            className="input-select__body--tag"
                            height={20}
                            width={60}
                            style={{ border: "unset" }}
                          />
                        </SkeletonTheme>
                      );
                    })}
                  {!isLoadingGenres &&
                    listGenres &&
                    listGenres.length > 0 &&
                    listGenres.map((item, i) => (
                      <span
                        key={i}
                        onClick={() => handleAddGenres(item._id)}
                        className={
                          !checkExistGenres(item._id) ? "input-select__body--tag" : "input-select__body--tag selected"
                        }
                      >
                        {item.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <h6 style={styleH6()}>
              Thumbnail <span style={{ color: "red" }}>*</span>
            </h6>
            <div className="input-file">
              <input
                type="file"
                name="file"
                ref={thumbnailInput}
                id="fileThumbnailUpload"
                onChange={(e) => handleChangeThumbnail(e)}
              />
              <label htmlFor="fileThumbnailUpload" className="input-label">
                <BsCloudUpload />
              </label>
              <label className="file_name" ref={thumbnail}></label>
            </div>

            <h6 style={styleH6()}>
              Link <span style={{ color: "red" }}>*</span>
            </h6>
            <div className="input-file">
              <input
                type="file"
                name="file"
                ref={linkInput}
                id="fileLinkUpload"
                onChange={(e) => handleChangeLink(e)}
              />
              <label htmlFor="fileLinkUpload" className="input-label">
                <BsCloudUpload />
              </label>
              <label className="file_name" ref={link}></label>
            </div>

            <div className="modal__body--button" ref={Btn} onClick={() => fetchAPI()}>
              Upload
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default Upload;
