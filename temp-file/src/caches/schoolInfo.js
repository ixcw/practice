import { localCache } from './index';

const KEY = 'schoolInfo';

export default function cache(schoolInfo) {
  return schoolInfo ? localCache.setItem(KEY, schoolInfo) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};