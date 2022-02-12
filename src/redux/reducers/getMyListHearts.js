const initialState = JSON.parse(localStorage.getItem("MyListHearts")) || [];
const getMyListHearts = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MY_LIST_HEARTS":
      localStorage.setItem("MyListHearts", JSON.stringify([...state, action.payload]));

      return [...state, action.payload];
    case "REMOVE_MY_LIST_HEARTS":
      const currentData = JSON.parse(localStorage.getItem("MyListHearts")) || [];
      const newData = currentData.filter((id) => id !== action.payload);
      localStorage.setItem("MyListHearts", JSON.stringify(newData));
      console.log(newData);

      return newData;

    default:
      return state;
  }
};

export default getMyListHearts;
