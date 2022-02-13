export const getListMusic = (data) => ({
  type: "GET_LIST_MUSIC",
  payload: data,
});
export const getCategory = (data) => ({
  type: "GET_CATEGORY_MUSIC",
  payload: data,
});
export const getPopular = (data) => ({
  type: "GET_POPULAR_MUSIC",
  payload: data,
});
export const getArtists = (data) => ({
  type: "GET_ARTISTS_MUSIC",
  payload: data,
});
export const addMyPlaylist = (data) => ({
  type: "ADD_MYPLAYLIST_MUSIC",
  payload: data,
});
export const addMyPlaylistUser = (data) => ({
  type: "ADD_MYPLAYLIST_MUSIC_USER",
  payload: data,
});
export const removeMyPlaylistUser = () => ({
  type: "REMOVE_MYPLAYLIST_MUSIC_USER",
});
export const removeMyPlaylist = () => ({
  type: "REMOVE_MYPLAYLIST_MUSIC",
});
export const setSelectedMusic = (data) => ({
  type: "SET_SELECTED_MUSIC",
  payload: data,
});
export const setNextSelectedMusic = (data) => ({
  type: "SET_NEXT_MUSIC",
  payload: data,
});
export const removeNextSelectedMusic = () => ({
  type: "REMOVE_NEXT_MUSIC",
});
export const removePreviousSelectedMusic = () => ({
  type: "REMOVE_PREVIOUS_MUSIC",
});
export const setPreviousSelectedMusic = (data) => ({
  type: "SET_PREVIOUS_MUSIC",
  payload: data,
});
export const removeSelectedMusic = () => ({
  type: "REMOVE_SELECTED_MUSIC",
});
export const getStatusSelectedMusic = (data) => ({
  type: "GET_STATUS_SELECTED_MUSIC",
  payload: data,
});
export const getDuration = (data) => ({
  type: "GET_DURATION_MUSIC",
  payload: data,
});
export const getUserLogin = (data) => ({
  type: "GET_USER_LOGIN",
  payload: data,
});
export const removeUserLogin = () => ({
  type: "REMOVE_USER_LOGIN",
});
export const accessAccount = (data) => ({
  type: "GET_ACCESS_ACCOUNT",
  payload: data,
});
export const setIsPlayingPlaylist = (data) => ({
  type: "SET_IS_PLAYING_PLAYLIST",
  payload: data,
});
export const getMyListHearts = (data) => ({
  type: "ADD_MY_LIST_HEARTS",
  payload: data,
});
export const removeMyListHearts = (data) => ({
  type: "REMOVE_MY_LIST_HEARTS",
  payload: data,
});
export const btnLogin = (data) => ({
  type: "BTN_LOGIN",
  payload: data,
});
export const btnProfile = (data) => ({
  type: "BTN_PROFILE",
  payload: data,
});
export const btnChangePassword = (data) => ({
  type: "BTN_CHANGEPASSWORD",
  payload: data,
});
export const btnSignup = (data) => ({
  type: "BTN_SIGNUP",
  payload: data,
});
export const btnUpload = (data) => ({
  type: "BTN_UPLOAD",
  payload: data,
});
export const btnCreateArtist = (data) => ({
  type: "BTN_CREATE_ARTIST",
  payload: data,
});
export const btnCreateGenres = (data) => ({
  type: "BTN_CREATE_GENRES",
  payload: data,
});
