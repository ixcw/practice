/**
 * 支付中心models
 * @author:张江
 * @date:2021年01月22日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import { routerRedux } from 'dva/router';
import { PayCenter as namespace } from '@/utils/namespace';
import {
  getStudyListInGoods,//会员中心获取学段列表
  getGoodsList,//会员中心获取会员商品的列表
  weixinPaySign,//微信预支付
  aliPaySign,//支付宝预支付
  getOrderInfoStatus,//微信支付查单接口,同步订单状态
  isBuyGoods,//是否购买商品
  getUserMemberInfo,//我的会员
  getOrderStatus,//获取订单状态
} from '@/services/payCenter'
import effect from 'dva-model/effect';


export default Model({
  namespace,
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {

      });
    },
  },
  effects: {},

  reducers: {
    /*赋值 state里的值 区分 方便各个组件使用*/
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },

    //会员中心获取学段列表
    getStudyListInGoodsSuccess(state, action) {
      return { ...state, studyList: action.result, loading: true };
    },

    //会员中心获取学段列表
    getGoodsListSuccess(state, action) {
      return { ...state, goodsList: action.result, goodsLoading: true };
    },

    // 支付宝预支付
    aliPaySignSuccess(state, action) {
      const formIdString = 'gg-alipay-form';
      // 1,返回表单的情况
      // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
      let havedDivForm = document.getElementById(formIdString);
      if (havedDivForm) {
        document.body.removeChild(havedDivForm)
      }

      // const divFormBox = document.createElement('div');
      // divFormBox.innerHTML = action.result; // result就是接口返回的form 表单字符串
      // divFormBox.style.display = "none";
      // document.body.appendChild(divFormBox);
      // divFormBox.setAttribute('id', formIdString) // 给表单盒子添加唯一id 方便移除
      // document.forms[0].setAttribute('target', '_blank') // 新开窗口跳转
      // document.forms[0].submit();

      // `https://openapi.alipay.com/gateway.do?${action.result}`;
      // https://excashier.alipay.com/standard/auth.htm?payOrderId=8efc88b2adad4e88b985af045a6ac64d.50

      // 2,返回链接的情况
      const tempForm = document.createElement("form");
      tempForm.action = `${action.result}`;
      tempForm.method = "post";
      tempForm.setAttribute('id', formIdString) // 给表单添加唯一id 方便移除
      tempForm.setAttribute('target', '_blank') // 新开窗口跳转
      tempForm.style.display = "none";
      document.body.appendChild(tempForm);
      tempForm.submit();

      return { ...state, startPayLoading: false };
    },

    // 微信预支付
    weixinPaySignSuccess(state, action) {
      return { ...state, startPayLoading: false };
    },
    //我的会员
    getUserMemberInfoSuccess(state, action) {
      return { ...state, userMemberList: action.result, };
    },
  }
}, {
  getStudyListInGoods,//会员中心获取学段列表
  getGoodsList,//会员中心获取会员商品的列表
  weixinPaySign,//微信预支付
  aliPaySign,//支付宝预支付
  getOrderInfoStatus,//微信支付查单接口,同步订单状态，
  isBuyGoods,//是否购买商品
  getUserMemberInfo,//我的会员
  getOrderStatus,//获取订单状态
}
)

