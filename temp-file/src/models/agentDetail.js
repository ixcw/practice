/**
 * 代理明细
 * @author:熊伟
 * @date:2021年07月8日
 * @version:v1.0.0
 * */

import Model from 'dva-model';
import {AgentDetail as namespace} from '@/utils/namespace';
import {
    countNumber,//统计
    findAgentUser,//代理明细
    findAgentUserByParentId,//区县代理
    findAgentUserByInviteCode,//推荐代理
    findSchoolByCityId,//代理的学校或机构
//-------------------------------修改后接口
    agentStatistics,//统计
    directUserList,//直接用户
    agentUsersByParentId,//二级代理
    schoolByUserIdList,//学校或机构
} from '@/services/agentDetail'
import queryString from 'query-string';
export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const {pathname, search} = location;
          const query = queryString.parse(search);
          const {areaCode = []} = query || {};
          const areaL = areaCode.length;
          if (pathname === namespace) {
            // dispatch({
            //     type:'findAgentUser',
            //     payload:{
            //         agentId:query.agentId||1,
            //         agentUserName:query.agentUserName||null,
            //         page:query.p||1,
            //         size:query.s||10
            //     }
            // })
            
          }
        });
      },
    },
    effects: {},

    reducers: {
      /*赋值 state里的值 区分 方便各个组件使用*/
      saveState(state, {payload}) {
        return {...state, ...payload};
      },

      //代理明细
      findAgentUserSuccess(state, action) {
        return {...state, findAgentUser: action.result, findAgentUserLoading: false};
      },
      //区县代理
      findAgentUserByParentIdSuccess(state, action) {
        return {...state, findAgentUserByParentId: action.result, findAgentUserByParentIdLoading: false};
      },

    }
  }, {
    countNumber,//统计
    findAgentUser,//代理明细
    findAgentUserByParentId,//区县代理
    findAgentUserByInviteCode,//推荐代理
    findSchoolByCityId,//代理的学校或机构
    //-------------------------------修改后接口
    agentStatistics,//统计
    directUserList,//直接用户
    agentUsersByParentId,//二级代理
    schoolByUserIdList,//学校或机构
  }
)