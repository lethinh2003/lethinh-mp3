const initialState = false;

const btnCreateGenres = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_CREATE_GENRES":
      return action.payload;

    default:
      return state;
  }
};

export default btnCreateGenres;
