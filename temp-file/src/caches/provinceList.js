/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/5/13
 *@Modified By:
 */
import { sessionCache } from './index';

const KEY = 'provinceList';

export default function cache(provinceList) {
  return provinceList ? sessionCache.setItem(KEY, provinceList) : sessionCache.getItem(KEY);
}
cache.clear = function () {
  sessionCache.removeItem(KEY);
};
