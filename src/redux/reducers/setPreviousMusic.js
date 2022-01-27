const initialState = JSON.parse(
  localStorage.getItem("previousSelectedMusic")
) || {
  data: [],
};
const setPreviousSeletedMusic = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PREVIOUS_MUSIC":
      localStorage.setItem(
        "previousSelectedMusic",
        JSON.stringify({
          ...state,
          data: action.payload,
        })
      );
      return {
        ...state,
        data: action.payload,
      };
    case "REMOVE_PREVIOUS_MUSIC":
      return {};

    default:
      return state;
  }
};

export default setPreviousSeletedMusic;
