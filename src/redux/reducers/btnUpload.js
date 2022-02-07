const initialState = false;

const btnUpload = (state = initialState, action) => {
  switch (action.type) {
    case "BTN_UPLOAD":
      return action.payload;

    default:
      return state;
  }
};

export default btnUpload;
