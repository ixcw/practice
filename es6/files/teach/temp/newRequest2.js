/**
 * 新网络请求封装2
 * 1. 修改了成功状态的返回判断
 * 2. 封装了新的token认证
 */
import fetch from 'dva/fetch';
import QueryString from 'qs';
import { routerRedux } from 'dva/router';
import { Modal } from 'antd';
import store from '@/entries/index';
import newAccessTokenCache from '@/caches/newAccessToken';
import CryptoUtils from "./CryptoUtils";

// import { Auth as namespace } from '@/utils/namespace';

function checkHttpStatus(response) {
  
  if (response.status >= 200 && response.status < 300 || response.status === 500) { // 警告，勿删
    return response;
  }
  if (response.status == 401) { //未登录 或token已过期
    response.code = response.status;
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  error.code = response.status;
  throw error;
}

function getResult(json) {
  const { dispatch, getState } = store;
  // console.log('store====', store)
  // console.log('getState====', getState()[namespace]['menu'])

  if (CryptoUtils.isEncryption) {//返回参数解密
    json.data = JSON.parse(CryptoUtils.aesDe(json.data))
  }

  if (json.success === true) { // 请求成功
    return { result: json }
  } else if (json.errCode === 1001500) { // 处理后端特殊封装
    return { result: json }
  } else if (json.access_token) { // 处理新平台token
    return { result: json }
  } else if (json.code === 412) { //后台进入逻辑层异常判断处理返回 前端也进入逻辑层判断提示 全局不做异常处理
    const messageTip = json.message || json.msg || '错误编码：' + json.code;
    Modal.warning({
      title: '提示信息',
      content: messageTip,
    });
    return { result: json };
  } else if (json.code === 602 || json.code === 401) { //未登录 或token已过期
    clearInterval(window.weixinPayTimer);//清除微信支付定时器
    dispatch(routerRedux.push('/login'));
    const error = new Error(json.message || json.msg || '无权限访问！');
    error.code = json.code;
    error.data = json;
    throw error;
  } else if (json.code === 600) {//无权限访问接口或页面！
    dispatch(routerRedux.push('/403'));
    const error = new Error(json.message || json.msg || '无权限访问！');
    error.code = json.code;
    error.data = json;
    throw error;
  } else if (json.code === 601) {
    const messageTip = json.message || json.msg || '错误编码：' + json.code;
    Modal.warning({
      title: '提示信息',
      content: messageTip,
    });
    const error = new Error(json.code);
    error.code = json.code;
    error.data = json;
    throw error;
  } else if (json.repCode) {//自定义滑动滑块验证
    return { ...json };
  } else {
    const error = new Error(json.message || json.msg || '数据加载错误！');
    error.code = json.errCode;
    error.data = json;
    throw error;
  }
}


function newRequest2(url = '', options = {}, cache) {
  const isProEnv = !(window.location.hostname.includes('test') || window.location.hostname.includes('daily'))
  if (isProEnv) {
    // url = `/pro${url}`
  }
  let data;
  let contentType;
  if (typeof cache === 'function') {
    data = cache();
    if (data) {
      return Promise.resolve(data);
    }
  }
  data = options.data;
  delete options.data;
  contentType = options.contentType;
  delete options.contentType;
  const opts = {
    method: 'POST',
    ...options
  };
  opts.headers = {
    ...opts.headers,
  };
  
  // 新平台登录
  if (url.includes('/auth/oauth2/token')) {
    if (isProEnv) {
      opts.headers.Authorization = 'Basic YnVyZWF1X3NjaG9vbF93ZWJfY2xpZW50OndWcHI3QmMqa2pzajlBTHZsMXE=';
    } else {
      opts.headers.Authorization = 'Basic YnVyZWF1X3NjaG9vbF93ZWJfY2xpZW50Ok0uZCQyKj5kQyZkKkI4MjBM';
    }
  } else {
    const access_token = newAccessTokenCache() || '';
    opts.headers.Authorization = access_token;
  }

  if (opts.method === 'GET') {
    url = url.split('?');
    url = url[0] + '?' + QueryString.stringify(url[1] ? { ...QueryString.parse(url[1]), ...data } : data);
    opts.headers['content-type'] = contentType ? contentType : 'application/x-www-form-urlencoded'; //
  } else {
    opts.headers['content-type'] = contentType ? contentType : 'application/x-www-form-urlencoded'; //
    // opts.body = contentType === 'application/json' ? JSON.stringify(data) : serialize(data);

    if (CryptoUtils.isEncryption) {//加密传输
      opts.body = contentType === 'application/json' ? CryptoUtils.aesEn(JSON.stringify(data)) : CryptoUtils.aesEn(serialize(data));
    } else {
      opts.body = contentType === 'application/json' ? JSON.stringify(data) : serialize(data);
    }

  }

  // 支持处理缓存
  const handleCache = data => {
    typeof cache === 'function' && cache(data.result);
    return data;
  };

  // 调用渲染服务的接口-桌面端下载导出pdf 2021年10月12日 张江 start
  if (url.includes('/renderserver/qGroupRender/questions2pdfOut')) { //直接下载文件流
    return fetch(url, opts)
      .then(checkHttpStatus)
      .then(res => res.blob())
      .then((blob) => { return { result: blob }; })
      .then(handleCache)
      .catch(err => ({ err }));
  }
  // 调用渲染服务的接口-桌面端下载导出pdf 2021年10月12日 张江 end

  return fetch(url, opts)
    .then(checkHttpStatus)
    .then(res => res.json())
    .then(getResult)
    .then(handleCache)
    .catch(err => ({ err }));
}

export default newRequest2;


export function serialize(obj, prefix) {
  if (obj) {
    var str = []; // eslint-disable-next-line
    Object.keys(obj).map(p => {
      let v = obj[p];
      if (p && typeof v !== 'undefined') {
        let k = prefix ? prefix + "." + p : p;
        if (typeof v === 'object') {
          v = serialize(v, k);
          if (v) {
            str.push(v);
          }
        } else {
          str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }
    });
    let res = str.length ? str.join("&") : '';
    return res;
  }
  return '';
}
