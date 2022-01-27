const TokenAccount = localStorage.getItem("jwt");
const initialState =
  JSON.parse(localStorage.getItem("MyPlayListMusicFromDB")) || [];

const addMyPlaylistUser = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MYPLAYLIST_MUSIC_USER":
      localStorage.setItem(
        "MyPlayListMusicFromDB",
        JSON.stringify([...state, action.payload])
      );

      return [...state, action.payload];

    case "REMOVE_MYPLAYLIST_MUSIC_USER":
      const data = localStorage.getItem("MyPlayListMusicFromDB");
      if (data) {
        return JSON.parse(data);
      }

    default:
      return state;
  }
};

export default addMyPlaylistUser;
