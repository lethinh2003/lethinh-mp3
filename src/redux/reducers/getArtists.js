const initialState = {
  data: [],
};
const getArtists = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ARTISTS_MUSIC":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default getArtists;
