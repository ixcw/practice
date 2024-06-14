import { localCache } from './index';

const KEY = 'questionBankParam';

export default function cache(questionBankParam) {
  return questionBankParam ? localCache.setItem(KEY, questionBankParam) : localCache.getItem(KEY);
}
cache.clear = function () {
  localCache.removeItem(KEY);
};