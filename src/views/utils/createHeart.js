const handleClickHeart = async (data) => {
  const loadingView = document.querySelector(".loading-opacity");
  const checkMusic = checkMusicHearted(data._id);
  if (!getUserLogin) {
    return toast.error("You must login to heart this music!!");
  } else if (getUserLogin && checkMusic === true) {
    return handleClickUnHeart(data);
  }
  try {
    if (loadingView) {
      loadingView.classList.remove("is-hide");
      loadingView.classList.add("is-show");
    }
    const updateHeart = await axios.post(`https://random-musics.herokuapp.com/api/v1/musics/${data._id}/hearts`);
    dispatch(getMyListHearts(data._id));

    if (loadingView) {
      loadingView.classList.add("is-hide");
      loadingView.classList.remove("is-show");
    }
    const heartContainer = document.querySelector(".heart-opacity");
    if (heartContainer) {
      fetchAPI();
      heartContainer.style.opacity = 1;
      heartContainer.style.visibility = "visible";
      setTimeout(() => {
        heartContainer.style.opacity = 0;
        heartContainer.style.visibility = "hidden";
      }, 500);
    }
  } catch (err) {
    if (loadingView) {
      loadingView.classList.add("is-hide");
      loadingView.classList.remove("is-show");
    }
    if (err.response) {
      toast.error(err.response.data.message);
      errorAuth(err);
    }
  }
};
export default createHeart;
