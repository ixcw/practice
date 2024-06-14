import { localCache } from './index';

const KEY = 'loginInfo';

export default function cache(loginRemember) {
  return loginRemember ? localCache.setItem(KEY, loginRemember) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};
