const initialState =
  JSON.parse(localStorage.getItem("isPlayingPlaylist")) || false;

const isPlayingPlaylist = (state = initialState, action) => {
  switch (action.type) {
    case "SET_IS_PLAYING_PLAYLIST":
      localStorage.setItem("isPlayingPlaylist", JSON.stringify(action.payload));
      return action.payload;

    default:
      return state;
  }
};

export default isPlayingPlaylist;
