import { localCache } from './index';

const KEY = 'userInfo';

export default function cache(userInfo) {
  return userInfo ? localCache.setItem(KEY, userInfo) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};