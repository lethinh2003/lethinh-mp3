export const filterListHeartsDetail = (id) => {
  const myListHearts = localStorage.getItem("AllMusics") ? JSON.parse(localStorage.getItem("AllMusics")) : null;
  let filterListHearts;
  if (myListHearts) {
    filterListHearts = myListHearts.filter((data) => data._id === id);
  }
  return filterListHearts;
};
export const checkMusicHearted = (id, myListHearts) => {
  let hasHeart = false;

  myListHearts.map((item) => {
    if (item === id) {
      hasHeart = true;
    }
  });

  return hasHeart;
};
