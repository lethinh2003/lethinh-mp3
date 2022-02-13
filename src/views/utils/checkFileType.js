export const isImage = (file) => {
  if (file) {
    return !!file.type.match("image.*");
  } else {
    return false;
  }
};
export const isAudio = (file) => {
  if (file) {
    return !!file.type.match("audio.*");
  } else {
    return false;
  }
};
