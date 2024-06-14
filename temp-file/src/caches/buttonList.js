import { localCache } from './index';

const KEY = 'buttonList';

export default function cache(buttonList) {
  return buttonList ? localCache.setItem(KEY, buttonList) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};
