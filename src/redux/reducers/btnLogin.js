const initialState = false;

const btnLogin = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_LOGIN":
      return action.payload;

    default:
      return state;
  }
};

export default btnLogin;
