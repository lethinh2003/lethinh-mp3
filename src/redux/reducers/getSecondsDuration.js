const initialState = JSON.parse(localStorage.getItem("musicDuration")) || {
  secondsDuration: 0,
};
const getSecondsDuration = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SECONDSDURATION_MUSIC":
      return {
        ...state,
        secondsDuration: action.payload,
      };

    default:
      return state;
  }
};

export default getSecondsDuration;
