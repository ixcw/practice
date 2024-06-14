import { localCache } from './index';

const KEY = 'tabButtonActiveKeyPage';

export default function cache(tabButtonActiveKeyPage) {
  return tabButtonActiveKeyPage ? localCache.setItem(KEY, tabButtonActiveKeyPage) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};