const initialState = false;

const btnChangePassword = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_CHANGEPASSWORD":
      return action.payload;

    default:
      return state;
  }
};

export default btnChangePassword;
