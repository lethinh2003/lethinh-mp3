const initialState = {
  data: [],
};
const categoryMusic = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CATEGORY_MUSIC":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default categoryMusic;
