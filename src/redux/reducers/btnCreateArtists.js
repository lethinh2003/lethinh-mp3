const initialState = false;

const btnCreateArtist = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_CREATE_ARTIST":
      return action.payload;

    default:
      return state;
  }
};

export default btnCreateArtist;
