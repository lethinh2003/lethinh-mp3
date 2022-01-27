const initialState = JSON.parse(localStorage.getItem("selectedMusic")) || {
  data: [],
};
const selectedMusic = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_MUSIC":
      localStorage.setItem(
        "selectedMusic",
        JSON.stringify({
          ...state,
          data: action.payload,
        })
      );
      return {
        ...state,
        data: action.payload,
      };

    case "REMOVE_SELECTED_MUSIC":
      return {};

    default:
      return state;
  }
};

export default selectedMusic;
