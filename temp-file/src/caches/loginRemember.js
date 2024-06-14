import { perpetualCache, WEEK } from './index';

const KEY = 'loginRemember';

export default function cache(loginRemember) {
  return loginRemember ? perpetualCache.setItem(KEY, loginRemember, WEEK) : perpetualCache.getItem(KEY);
}
cache.clear = function () {
  perpetualCache.removeItem(KEY);
};
