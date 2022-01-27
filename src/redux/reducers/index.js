import { combineReducers } from "redux";
import listMusic from "./listMusic";
import categoryMusic from "./category";
import selectedMusic from "./selectedMusic";
import getStatusSelectedMusic from "./getStatusSelectedMusic";
import setNextSelectedMusic from "./setNextMusic";
import setPreviousSelectedMusic from "./setPreviousMusic";
import popularMusic from "./popularMusic";
import getArtists from "./getArtists";
import addMyPlaylist from "./addMyPlaylist";
import addMyPlaylistUser from "./addMyPlaylistUser";
import getDuration from "./getMusicDuration";
import getUserLogin from "./getUserLogin";
import accessAccount from "./accessAccount";
import isPlayingPlaylist from "./isPlayingPlaylist";

export default combineReducers({
  listMusic,
  categoryMusic,
  selectedMusic,
  getStatusSelectedMusic,
  setPreviousSelectedMusic,
  setNextSelectedMusic,
  popularMusic,
  getArtists,
  addMyPlaylist,
  addMyPlaylistUser,
  getDuration,
  getUserLogin,
  accessAccount,
  isPlayingPlaylist,
});
