const initialState = JSON.parse(localStorage.getItem("MyPlayListMusic")) || [];
const TokenAccount = localStorage.getItem("jwt");

const addMyPlaylist = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MYPLAYLIST_MUSIC":
      localStorage.setItem(
        "MyPlayListMusic",
        JSON.stringify([...state, action.payload])
      );

      return [...state, action.payload];

    case "REMOVE_MYPLAYLIST_MUSIC":
      const data = localStorage.getItem("MyPlayListMusic");
      if (data) {
        return JSON.parse(data);
      }

    default:
      return state;
  }
};

export default addMyPlaylist;
