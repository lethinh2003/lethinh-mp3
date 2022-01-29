const initialState = JSON.parse(localStorage.getItem("MyListHearts")) || [];
const getMyListHearts = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MY_LIST_HEARTS":
      localStorage.setItem("MyListHearts", JSON.stringify([...state, action.payload]));

      return [...state, action.payload];

    default:
      return state;
  }
};

export default getMyListHearts;
