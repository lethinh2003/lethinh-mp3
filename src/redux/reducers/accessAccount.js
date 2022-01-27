const initialState = JSON.parse(localStorage.getItem("accessAccount")) || false;

const accessAccount = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ACCESS_ACCOUNT":
      localStorage.setItem("accessAccount", JSON.stringify(action.payload));
      return action.payload;

    default:
      return state;
  }
};

export default accessAccount;
