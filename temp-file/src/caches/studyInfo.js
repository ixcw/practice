import { localCache } from './index';

const KEY = 'studyInfo';

export default function cache(studyInfo) {
  return studyInfo ? localCache.setItem(KEY, studyInfo) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};