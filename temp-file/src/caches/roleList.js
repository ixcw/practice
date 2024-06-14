import { localCache } from './index';

const KEY = 'roleList';

export default function cache(roleList) {
  return roleList ? localCache.setItem(KEY, roleList) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};
