import { sessionCache } from './index';

const KEY = 'pageRecord';

export default function cache(pageRecord) {
  return pageRecord ? sessionCache.setItem(KEY, pageRecord) : sessionCache.getItem(KEY);
}
cache.clear = function () {
  sessionCache.removeItem(KEY);
};
