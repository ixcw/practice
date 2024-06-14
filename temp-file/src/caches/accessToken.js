import { localCache } from './index';

const KEY = 'access_token';

export default function cache(accessToken, TIME) {
  return accessToken && TIME ? localCache.setItem(KEY, accessToken, TIME) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};
