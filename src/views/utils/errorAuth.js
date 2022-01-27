import { toast } from "react-toastify";
const errorAuth = (err) => {
  if (err.response.data.message.name === "TokenExpiredError") {
    localStorage.setItem("accessAccount", false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("MyPlayListMusicFromDB");
    window.location.replace("/logout");
    return toast.error(err.response.data.message.message);
  }
};
export default errorAuth;
