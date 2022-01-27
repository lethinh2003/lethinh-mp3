const initialState = JSON.parse(localStorage.getItem("nextSelectedMusic")) || {
  data: [],
};
const setNextSelectedMusic = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NEXT_MUSIC":
      localStorage.setItem(
        "nextSelectedMusic",
        JSON.stringify({
          ...state,
          data: action.payload,
        })
      );
      return {
        ...state,
        data: action.payload,
      };
    case "REMOVE_NEXT_MUSIC":
      return {};

    default:
      return state;
  }
};

export default setNextSelectedMusic;
