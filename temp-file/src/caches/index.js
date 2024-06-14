import Storage from '@/utils/storage';

// export const localCache = new Storage('gougou-front', window.localStorage);
export const localCache = new Storage('gougou-front', window.sessionStorage);
export const sessionCache = new Storage('gougou-front', window.sessionStorage);
export const perpetualCache = new Storage('gougou-front', window.localStorage);//关闭标签 不清除缓存使用

export const MINUTES = 60000;
export const HOURS = 60 * MINUTES;
export const DAY = 24 * HOURS;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
