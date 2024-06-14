import { localCache } from './index';

const KEY = 'gradeList';

export default function cache(gradeList) {
  return gradeList ? localCache.setItem(KEY, gradeList) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};