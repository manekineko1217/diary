'use strict';

/**
 * 動画ファイルを読み取り内容を返す
 * @param {Object} file File object
 * @return {HTMLElement} HTMLVideoElement
 */
function handleVideoFile(file) {
  const video = document.createElement('video');
  video.className = 'video-file';
  video.dataset.fileName = file.name;
  video.dataset.fileType = file.type;
  video.contentEditable = false;
  video.controlsList = 'nodownload';
  video.disablePictureInPicture = true;
  video.controls = true;
  video.autoplay = true;
  video.loop = true;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    video.src = url;
  }

  return video;
}

/**
 * 音声ファイルを読み取り内容を返す
 * @param {Object} file File object
 * @return {HTMLElement} HTMLAudioElement
 */
function handleAudioFile(file) {
  const audio = document.createElement('audio');
  audio.className = 'audio-file';
  audio.dataset.fileName = file.name;
  audio.dataset.fileType = file.type;
  audio.contentEditable = false;
  audio.controls = true;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    audio.src = url;
  }

  return audio;
}

/**
 * 画像ファイルを読み取り内容を返す
 * @param {Object} file File object
 * @return {HTMLElement} HTMLImageElement
 */
function handleImageFile(file) {
  const image = document.createElement('img');
  image.className = 'image-file';
  image.dataset.fileName = file.name;
  image.dataset.fileType = file.type;
  image.contentEditable = false;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    image.src = url;
  }

  return image;
}

/**
 * テキストファイルを読み取り内容を返す
 * @param {Object} file File object
 * @return {HTMLElement} HTMLTextAreaElement
 */
function handleTextFile(file) {
  const textarea = document.createElement('textarea');
  textarea.className = 'text-file';
  textarea.dataset.fileName = file.name;
  textarea.dataset.fileType = file.type;
  textarea.contentEditable = false;
  textarea.readOnly = true;

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = event => {
    const text = event.target.result;
    textarea.innerText = text;
  }

  return textarea;
}

export {
  handleVideoFile as video,
  handleAudioFile as audio,
  handleImageFile as image,
  handleTextFile as text
};
