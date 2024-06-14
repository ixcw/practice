/**
 * 权限登录models
 * @author:张江
 * @date:2020年08月15日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { Auth as namespace } from '@/utils/namespace';
import { urlToList } from '@/utils/utils';

import {
  loginWeb,
  getUserInfo,
  getMenuList,
  getButtonList,
  getVerificationCode,//获取验证码
  verificationCode,//验证码校验
  setNewPassword,//设置新密码
  saveRegisterUserInfo,//注册
  actionVerify,//行为验证
  saveStudentGrade,//完善注册信息
  userAccessToken,//完善注册信息后刷新token
  listRoles,//获取角色列表(前台后台通用)
  switchRole,//切换角色(前台后台通用)
} from '@/services/auth'
import effect from 'dva-model/effect';

import { localCache, sessionCache } from '@/caches/index';
import loginInfoCache from '@/caches/loginInfo';//登录信息
import userInfoCache from '@/caches/userInfo';//登录用户的信息
import roleListCache from '@/caches/roleList';//登录用户角色列表
import accessTokenCache from '@/caches/accessToken';//用户token
import buttonListCache from '@/caches/buttonList';//按钮
import KSelectedParamCache from "@/caches/KSelectedParam";//知识点选择条件存储
import menuListCache from "@/caches/menuList";//菜单缓存
import tabButtonActiveKeyPageCache from "@/caches/tabButtonActiveKeyPage";//首页记录缓存
import isToDesktopCache from "@/caches/isToDesktop";//是否是桌面端记录缓存

let tempPathname = '';
let tempPathname2 = '';
export default Model({
  namespace,
  state: {
    access_token: accessTokenCache(),
    userInfo: userInfoCache()
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        let pathnameUrl2 = location.pathname;
        let pathnameUrl = location.pathname;

        /** ********************************************************* 桌面端使用报告判断 start author:张江 date:2021年05月12日 *************************************************************************/
        const { search } = location;
        const query = queryString.parse(search);
        const isHaveToken = query && query.gbdpw;
        const isShowMenu = query && (query.isShowMenu == 'show' || !query.isShowMenu);

        if (isHaveToken) {
          let isGougouDesktop = window.isGougouDesktop();
          isToDesktopCache(isGougouDesktop)
          accessTokenCache('bearer ' + query.gbdpw, 6 * 60 * 60 * 1000)
          dispatch({
            type: 'zmGetUserInfo',
            payload: {
              pathname: pathnameUrl,
              isShowMenu
            }
          });
          //  @ts-ignore
          if (window._czc && isGougouDesktop) {
            //  @ts-ignore
            window._czc.push(['_trackEvent', `${window.$systemTitleName}-桌面端`, '查看']);
          }
        }
        /** ********************************************************* 桌面端使用报告判断 end author:张江 date:2021年05月17日 *************************************************************************/

        if (tempPathname2 != pathnameUrl2) {
          tempPathname2 = pathnameUrl2;
          const access_token = accessTokenCache();
          if (!(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/setPassword' || location.pathname === '/link-card' || location.pathname === '/answer-sheet')) {
            dispatch({
              type: 'getMenuListInfo',
              payload: {
                platformId: 3,
                queryType: access_token ? 1 : 2
              }
            });
          }
        }
        if (location.pathname === '/login') {
          dispatch({ type: 'logoutSuccess' });
        } else {
          if (!(location.pathname === '/home' || location.pathname === '/' || location.pathname === '/register' || location.pathname === '/setPassword' || location.pathname === '/link-card' || location.pathname === '/answer-sheet')) {
            /** ********************************************************* 桌面端使用报告判断 start author:张江 date:2021年05月12日 *************************************************************************/

            if (isHaveToken) {
              return;
            }
            /** ********************************************************* 桌面端使用报告判断 end author:张江 date:2021年05月07日 *************************************************************************/

            dispatch({//校验权限
              type: 'checkAuthenticate'
            });
          }
          if (location.pathname === '/register' || location.pathname === '/setPassword' || location.pathname === '/link-card' || location.pathname === '/answer-sheet' || isHaveToken) {//不需要获取菜单列表
            return;
          }
        }
        const access_token = accessTokenCache();
        // if (!location.pathname || location.pathname === '/') {
        //   dispatch({//重置路由到首页
        //     type: 'resetPage'
        //   });
        //   return;
        // }
        if (access_token) {
          // dispatch({
          //   type: 'getMenuList',
          //   payload: {
          //     platformId: 3,
          //   }
          // });
          // if (!location.pathname || location.pathname === '/') {
          //   dispatch({//重置路由到首页
          //     type: 'resetPage'
          //   });
          //   return;
          // }
          if (pathnameUrl.includes('/question-center')) {
            pathnameUrl = '/question-center/manual'
          }
          if (pathnameUrl == '/my-question-group') {//我的题组里面已调用
            tempPathname = pathnameUrl;
            return;
          }
          if (tempPathname != pathnameUrl) {
            dispatch({
              type: 'getButtonList',
              payload: {
                url: pathnameUrl,
              }
            });
            tempPathname = pathnameUrl;
          }
        }
        // }
      });
    },
  },
  effects: {
    * checkAuthenticate(action, saga) {
      const access_token = accessTokenCache();
      if (!access_token) {
        yield saga.put(routerRedux.replace('/login'));
      }
    },

    * resetPage(action, saga) {
      yield saga.put(routerRedux.replace('/'));
    },
    * login(action, saga) {
      yield saga.put({ type: 'logoutSuccess' });//确认缓存已经清除
      const data = yield saga.call(effect(loginWeb, 'loginWebSuccess', loginInfoCache), action, saga)
      if (data && data.access_token) {
        const access_token = data.token_type + ' ' + data.access_token;
        const timeCache = Number(data.expires_in) * 1000;
        accessTokenCache(access_token, timeCache);//秒变毫秒 token有效时间
        action.payload = {}; //置空登录参数信息
        const userInfo = yield saga.call(effect(getUserInfo, 'getUserInfoSuccess', userInfoCache), action, saga);
        roleListCache.clear();
        yield saga.call(effect(listRoles, 'listRolesSuccess',roleListCache), action, saga);
          //  @ts-ignore
          if (window._czc) {
            //  @ts-ignore
            window._czc.push(['_trackEvent', `${window.$systemTitleName}-登录成功`, '登录']);
          }
        if (userInfo && userInfo.account && ((userInfo.classId && userInfo.gradeId) || userInfo.code != 'STUDENT' )) {
          notification.success({ message: '登录成功', description: '', duration: 1 });
          action.payload.platformId = 3;
          action.payload.queryType = 1
          yield saga.call(effect(getMenuList, 'getMenuListSuccess', menuListCache), action, saga);
          // yield saga.put(routerRedux.replace('/question-bank'));
          yield saga.put(routerRedux.replace('/'));
        }else{
          notification.warn({ message: '完善信息', 
          description: !userInfo.classId?'请先完善信息或加入班级后才能正常使用功能！':'请先完善信息', duration: 3 });
          // userInfo.areaId ? '请先完善所在城市' :
          // yield saga.put(routerRedux.replace('/personalCenter?myCollect=1&personalCenterItem=1'));
          yield saga.put(routerRedux.replace('/'));
        }
      }
    },

    * zmGetUserInfo(action, saga) {
      const pathname = action.payload.pathname;
      const isShowMenu = action.payload.isShowMenu;
      action.payload = {}; //置空登录参数信息
      const userInfo = yield saga.call(effect(getUserInfo, 'getUserInfoSuccess', userInfoCache), action, saga);
      roleListCache.clear();
      yield saga.call(effect(listRoles, 'listRolesSuccess', roleListCache), action, saga);
      if (userInfo && userInfo.account) {
        // notification.success({ message: '登录成功', description: '', duration: 1 });
        if (isShowMenu) {
          action.payload.platformId = 3;
          action.payload.queryType = 1
          yield saga.call(effect(getMenuList, 'getMenuListSuccess', menuListCache), action, saga);
          // yield saga.put(routerRedux.replace('/question-bank'));
          yield saga.put(routerRedux.replace(pathname));
          window.location.reload();
        }
      }
    },

    * logout(action, saga) {
      const state = yield saga.select(state => state);
      const nss = Object.keys(state);
      for (let i = 0, len = nss.length; i < len; i++) {
        if ((nss[i] !== namespace)) {
          yield saga.put({ type: nss[i] + '/clean' });
        }
      }
      yield saga.put({ type: 'logoutSuccess' });
      // yield saga.put(routerRedux.replace('/login'));
      const pathname = urlToList(window.location.hash);
      if (pathname == '/' || pathname == '/home') {
        window.location.reload();//如果是在首页 退出直接刷新
      } else {
        yield saga.put(routerRedux.replace('/home'));
      }
    },

    // 获取菜单列表 从缓存中
    * getMenuListInfo(action, saga) {
      const access_token = accessTokenCache();
      if (access_token){
        yield saga.call(effect(listRoles, 'listRolesSuccess', roleListCache), action, saga);
      }
      yield saga.call(effect(getMenuList, 'getMenuListSuccess', menuListCache), action, saga);
    },

    // 获取切换班级后的用户信息
    * getSwitchUserInfo(action, saga) {
      tabButtonActiveKeyPageCache.clear();
      yield saga.call(effect(getUserInfo, 'getUserInfoSuccess', userInfoCache), action, saga);
    },
  },

  reducers: {
    loginWebSuccess(state, action) {
      return { ...state, authenticate: action.result, loading: false };
    },
    // verificationCodeSuccess(state, action) {
    //   return { ...state, authenticate: action.result, loading: false };
    // },
    logoutSuccess(state) {
      loginInfoCache.clear();
      accessTokenCache.clear();
      userInfoCache.clear();
      KSelectedParamCache.clear();
      menuListCache.clear();
      tabButtonActiveKeyPageCache.clear();//首页记录缓存
      localCache.clear();
      sessionCache.clear();
      return {};
    },
    getUserInfoSuccess(state, action) {
      return { ...state, userInfo: action.result, loading: false };
    },

    getMenuListSuccess(state, action) {
      const result = action.result;
      return { ...state, menu: result, loading: false };
    },

    getButtonListSuccess(state, action) {
      const result = action.result;
      if (result) {
        buttonListCache.clear();
        buttonListCache(result);
        return { ...state, authButtonList: result, loading: false };
      } else {
        return { ...state, loading: false };
      }
    },

    listRolesSuccess(state, action) {
      const result = action.result;
      return { ...state, listRoles: result, loading: false };
    },
  }
}, {
  getUserInfo,
  getMenuList,
  getButtonList,
  getVerificationCode,//获取验证码
  verificationCode,//验证码校验
  setNewPassword,//设置新密码
  saveRegisterUserInfo,//注册
  actionVerify,//行为验证
  saveStudentGrade,//完善注册信息
  userAccessToken,//完善注册信息后刷新token
  listRoles,//获取角色列表(前台后台通用)
  switchRole,//切换角色(前台后台通用)
}
)
