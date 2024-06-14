import { localCache } from './index';

const KEY = 'StudyAndSubjectsList';

export default function cache(StudyAndSubjectsList) {
  return StudyAndSubjectsList ? localCache.setItem(KEY, StudyAndSubjectsList) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};