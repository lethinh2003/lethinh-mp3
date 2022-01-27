const initialState = {
  data: [],
};
const listMusic = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LIST_MUSIC":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default listMusic;
