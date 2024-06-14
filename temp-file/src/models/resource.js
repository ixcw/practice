import Model from 'dva-model';
import {
  getUploadToken,
  getVideoUploadToken
} from '@/services/resource';
import {Resource as namespace} from "@/utils/namespace";
export default Model({
  namespace,
  state: {

  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {

      });
    },

  },
  reducers: {}
},{
  getUploadToken,
  getVideoUploadToken
})
