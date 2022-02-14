const initialState = JSON.parse(localStorage.getItem("MyListHeartsDetail")) || [];
const getMyListHeartsDetail = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MY_LIST_HEARTS_DETAIL":
      const currentData2 = JSON.parse(localStorage.getItem("MyListHeartsDetail")) || [];
      localStorage.setItem("MyListHeartsDetail", JSON.stringify([...currentData2, action.payload]));

      return [...state, action.payload];
    case "REMOVE_MY_LIST_HEARTS_DETAIL":
      const currentData = JSON.parse(localStorage.getItem("MyListHeartsDetail")) || [];
      const newData = currentData.filter((data) => data._id !== action.payload);
      localStorage.setItem("MyListHeartsDetail", JSON.stringify(newData));

      return newData;

    default:
      return state;
  }
};

export default getMyListHeartsDetail;
