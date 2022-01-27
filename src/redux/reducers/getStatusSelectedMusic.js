const initialState = {
  data: { status: false },
};
const getStatusSelectedMusic = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STATUS_SELECTED_MUSIC":
      return {
        ...state,
        data: { status: action.payload },
      };
    default:
      return state;
  }
};

export default getStatusSelectedMusic;
