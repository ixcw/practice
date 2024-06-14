/**
 *@Author:ChaiLong
 *@Description:数据入库
 *@Date:Created in  2021/5/12
 *@Modified By:
 */
import Model from 'dva-model';
import {DataEmbody as namespace, QuestionBank} from '@/utils/namespace';
import {getLocationObj, dealTimestamp, doHandleYear} from '@/utils/utils'
import userInfoCache from '@/caches/userInfo';
import {
  addExamJob,//添加考试任务
  findMakingSystemData,//班级学生各题得分明细
} from '@/services/dataEmbody'


export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const {pathname, query} = getLocationObj(location);
          if (pathname === namespace) {
            const yearCache= doHandleYear();
            const user = userInfoCache();
            const schoolId = user.code === 'GG_QUESTIONBANKADMIN' ? query.schoolId || '' : user.schoolId;
            dispatch({
              type: 'findMakingSystemData',
              payload: {
                schoolId,
                gradeId: query.gradeId || '',
                yearId: query.year === 'null' ? "" : (query.year || yearCache),
                subjectId: query.subjectId || '',
                page: query.p || 1,
                size: 10
              }
            })

            if (query.gradeId) {
              dispatch({
                type: QuestionBank + '/getSubjectList',
                payload: {
                  gradeId: query.gradeId || ''
                }
              })
            }
          }
        });
      },
    },
    effects: {},

    reducers: {}
  }, {
    addExamJob,
    findMakingSystemData
  }
)
