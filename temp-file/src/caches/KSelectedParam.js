import { localCache } from './index';

const KEY = 'KSelectedParam';

export default function cache(KSelectedParam) {
  return KSelectedParam ? localCache.setItem(KEY, KSelectedParam) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};