import { localCache } from './index';

const KEY = 'menuList';

export default function cache(menuList) {
  return menuList ? localCache.setItem(KEY, menuList) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};
