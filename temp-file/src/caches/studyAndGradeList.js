import { localCache } from './index';

const KEY = 'studyAndGradeList';

export default function cache(studyAndGradeList) {
  return studyAndGradeList ? localCache.setItem(KEY, studyAndGradeList) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};