const initialState = {
  data: [],
};
const popularMusic = (state = initialState, action) => {
  switch (action.type) {
    case "GET_POPULAR_MUSIC":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default popularMusic;
