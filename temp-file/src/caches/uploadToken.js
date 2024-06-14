import {localCache} from './index';

const FILE_UPLOAD_TOKEN_KEY = 'file_upload_token_key';
const VIDEO_UPLOAD_TOKEN_KEY = 'video_upload_token_key';

function setOrGet(token, key) {
  let currentTime = new Date().getTime();
  let isSet = token && token.token && token.expireAt && token.expireAt > currentTime;
  let duration = token && token.expireAt ? (token.expireAt - currentTime) : 0;
  return isSet && duration > 0 ? localCache.setItem(key, token, duration) : localCache.getItem(key);

}

export function fileUploadTokenCache(token) {
  return setOrGet(token, FILE_UPLOAD_TOKEN_KEY);
}

export function videoUploadTokenCache(token) {
  return setOrGet(token, VIDEO_UPLOAD_TOKEN_KEY);
}

export function clearFileUploadToken() {
  localCache.removeItem(FILE_UPLOAD_TOKEN_KEY);
};

export function clearVideoUploadToken() {
  localCache.removeItem(VIDEO_UPLOAD_TOKEN_KEY);
};
