const initialState = false;

const btnProfile = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_PROFILE":
      return action.payload;

    default:
      return state;
  }
};

export default btnProfile;
