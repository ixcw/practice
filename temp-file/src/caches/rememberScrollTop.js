import { localCache } from './index';

const KEY = 'rememberScrollTop';

export default function cache(rememberScrollTop) {
  return rememberScrollTop ? localCache.setItem(KEY, rememberScrollTop) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};
