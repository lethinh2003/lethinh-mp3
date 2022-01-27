import { toast } from "react-toastify";
const TokenAccount = localStorage.getItem("jwt");
export const findNextMusic = (data, dataMusicUser, dataMusic) => {
  let indexNextMusic;
  if (TokenAccount) {
    if (dataMusicUser && dataMusicUser.length >= 2) {
      const findIndexCurrentMusic = dataMusicUser.findIndex((item) => item._id === data._id);
      if (findIndexCurrentMusic === dataMusicUser.length - 1) {
        indexNextMusic = 0;
      } else if (findIndexCurrentMusic === -1) {
        // toast.error("No found music");
      } else {
        indexNextMusic = findIndexCurrentMusic + 1;
      }
    }
  } else {
    if (dataMusic && dataMusic.length >= 2) {
      const findIndexCurrentMusic = dataMusic.findIndex((item) => item._id === data._id);
      if (findIndexCurrentMusic === dataMusic.length - 1) {
        indexNextMusic = 0;
      } else if (findIndexCurrentMusic === -1) {
        // toast.error("No found music");
      } else {
        indexNextMusic = findIndexCurrentMusic + 1;
      }
    }
  }
  return indexNextMusic;
};
export const findPreviousMusic = (data, dataMusicUser, dataMusic) => {
  let indexPreviousMusic;
  if (TokenAccount) {
    if (dataMusicUser && dataMusicUser.length >= 2) {
      const findIndexCurrentMusic = dataMusicUser.findIndex((item) => item._id === data._id);
      if (findIndexCurrentMusic === 0) {
        indexPreviousMusic = dataMusicUser.length - 1;
      } else if (findIndexCurrentMusic === -1) {
        // toast.error("No found music");
      } else {
        indexPreviousMusic = findIndexCurrentMusic - 1;
      }
    }
  } else {
    if (dataMusic && dataMusic.length >= 2) {
      const findIndexCurrentMusic = dataMusic.findIndex((item) => item._id === data._id);
      if (findIndexCurrentMusic === 0) {
        indexPreviousMusic = dataMusic.length - 1;
      } else if (findIndexCurrentMusic === -1) {
        // toast.error("No found music");
      } else {
        indexPreviousMusic = findIndexCurrentMusic - 1;
      }
    }
  }
  return indexPreviousMusic;
};
