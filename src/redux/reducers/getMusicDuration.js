const initialState = {
  data: JSON.parse(localStorage.getItem("musicTime")),
} || {
  data: {
    minutesDuration: 0,
    secondsDuration: 0,
    minutesCurrent: 0,
    secondsCurrent: 0,
    valueCurrent: 0,
    musicVolume: 0,
    repeatMusic: false,
  },
};

const getDuration = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DURATION_MUSIC":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default getDuration;
