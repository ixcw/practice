/**
* 自动组题models
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* */
import Model from 'dva-model'
import {AutomaticCombination as namespace, ManualCombination} from '@/utils/namespace'
import {getPageQuery, queryParamIsChange} from "@/utils/utils";
import userCache from "@/caches/userInfo";
import {genAutomaticQuestion} from '@/services/combination/automaticCombination'

let lastQuery = {}
export default Model({
  namespace,
  subscriptions: {
    setup({dispatch, history}) {

      history.listen(location => {
        const {pathname, search} = location
        //如果进入当前页面
        if (pathname.match(namespace)) {
          let roleInfo = userCache()
          let query = getPageQuery()
          let subjectId = query.subjectId || roleInfo.subjectId
          if (subjectId) {
            dispatch({
              type: ManualCombination + '/getGroupCenterConditions',
              payload: {
                subjectId
              }
            })
          }
          lastQuery = query
        }
      })
    },
  },
  reducers: {}
}, {genAutomaticQuestion})
