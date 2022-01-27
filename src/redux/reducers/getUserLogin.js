const initialState = JSON.parse(localStorage.getItem("currentUser")) || "";

const getUserLogin = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_LOGIN":
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      return action.payload;
    case "REMOVE_USER_LOGIN":
      localStorage.removeItem("jwt");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("selectedMusic");
      localStorage.removeItem("MyPlayListMusicFromDB");
      localStorage.setItem("accessAccount", false);
      return state;

    default:
      return state;
  }
};

export default getUserLogin;
