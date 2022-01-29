import { useState, useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getUserLogin, removeUserLogin, accessAccount } from "../redux/actions";
const Logout = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const TokenAccount = localStorage.getItem("jwt");
  const AccessAccount = localStorage.getItem("accessAccount");
  localStorage.removeItem("jwt");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedMusic");
  localStorage.removeItem("nextSelectedMusic");
  localStorage.removeItem("previousSelectedMusic");
  localStorage.removeItem("MyPlayListMusicFromDB");
  localStorage.removeItem("MyListHearts");
  localStorage.setItem("accessAccount", false);
  dispatch(accessAccount(false));
  // history.replace("/");

  window.location.replace("/");

  return (
    <>
      <div className="logout">Success</div>
    </>
  );
};
export default Logout;
