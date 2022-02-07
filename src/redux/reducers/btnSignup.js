const initialState = false;

const btnSignup = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_SIGNUP":
      return action.payload;

    default:
      return state;
  }
};

export default btnSignup;
