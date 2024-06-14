/**
* 自定义key通用缓存
* @author:张江
* @date:2021年07月23日
* @version:v1.0.0
* @description 自定义通用缓存方法
* */
import { localCache } from './index';
/**
 * 缓存
 *@customKey :自定义key
 *@isCollect :cacheInfo缓存的信息
 */
export default function cache(customKey, cacheInfo) {
  return cacheInfo ? localCache.setItem(customKey, cacheInfo) : localCache.getItem(customKey);
}
cache.clear = function (customKey) {
  localCache.removeItem(customKey);
};