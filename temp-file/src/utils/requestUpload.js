/**
 * 上传文件-图片,word等网络请求封装
 * @author:张江
 * @date:2019年11月23日
 * @version:v1.0.0
 * @description:表单上传文件-表单定义放到页面中
 * */

import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import accessTokenCache from '@/caches/accessToken';
import store from '@/entries/index';

function checkHttpStatus(response) {

    if (response.status >= 200 && response.status < 300) {
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
    const { dispatch } = store;
    if (json.code === 200) {
        return { result: json.data };
    } else if (json.code === 602 || json.code === 401) { //未登录 或token已过期
        dispatch(routerRedux.push('/login'));
        const error = new Error(json.message || json.msg || '无权限访问！');
        error.code = json.code;
        error.data = json;
        throw error;
    } 
    else {
        const error = new Error(json.message || json.msg || '数据加载错误！');
        error.code = json.code;
        error.data = json;
        throw error;
    }
}


function requestUpload(url = '', options = {}, cache) {
    let data;
    if (typeof cache === 'function') {
        data = cache();
        if (data) {
            return Promise.resolve(data);
        }
    }
    data = options.data;
    delete options.data;
    delete options.contentType;
    const opts = {
        method: 'POST',
        ...options
    };
    opts.headers = {
        ...opts.headers,
    };
    if (!url.includes('/login/loginWebUser')) {// '/auth/api/v1/login/loginWebUser'
        const access_token = accessTokenCache() || '';
        opts.headers.Authorization = access_token;
    }

    opts.body = data.formData;//表单上传图片
    return fetch(url, opts)
        .then(checkHttpStatus)
        .then(res => res.json())
        .then(getResult)
        .catch(err => ({ err }));
}

export default requestUpload;
