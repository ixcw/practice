/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/6/18
 *@Modified By:
 */
import Model from 'dva-model';
import {PenManage as namespace} from '@/utils/namespace';
import {
  insertOrUpdatePenInformation,//单个新增修改点阵笔信息
  findPenList,//点阵笔信息列表查询
  deletePenInformationById,//根据Id逻辑删除笔信息
  batchPenInformation,//批量导入点阵笔信息
  getConnectionCard,//下载通用答题卡
  findRoomInfo,//教室列表查询
  insertOrUpdateRoomInfo,//新增修改教室
} from '@/services/penManage'
import {getLocationObj} from "@/utils/utils";


export default Model({
    namespace,
    state: {},
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(location => {
          const {pathname, query} = getLocationObj(location);
          if (pathname === namespace) {
            //请求教室
            dispatch({
              type: 'findRoomInfo'
            })
            if (query.id){
              dispatch({
                type: 'findPenList',
                payload: {
                  roomId:query.id||undefined,
                  page: query.p || 1,
                  size: 10
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
    insertOrUpdatePenInformation,
    findPenList,
    deletePenInformationById,
    batchPenInformation,
    getConnectionCard,
    findRoomInfo,
    insertOrUpdateRoomInfo,//新增修改教室
  }
)

