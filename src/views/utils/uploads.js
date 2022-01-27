import axios from "axios";
const API_URL = "https://random-musics.herokuapp.com/api/v1/users";

const cloudinaryUpload = (fileToUpload) => {
  return axios
    .post(API_URL + "/upload-avatar", fileToUpload)
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

export default cloudinaryUpload;
