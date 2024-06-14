import { perpetualCache } from './index';

const KEY = 'isToDesktop';

export default function cache(isToDesktop) {
  return isToDesktop ? perpetualCache.setItem(KEY, isToDesktop) : perpetualCache.getItem(KEY);
}
cache.clear = function () {
  perpetualCache.removeItem(KEY);
};