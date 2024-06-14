import { localCache } from './index';

const KEY = 'singleTaskInfo';

export default function cache(singleTaskInfo) {
  return singleTaskInfo ? localCache.setItem(KEY, singleTaskInfo) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};