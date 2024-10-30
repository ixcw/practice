import { getProduct } from "../services/example"

export default {
  namespace: 'product',
  state: {
    productList: [
      {
        name: '豆子'
      },
      {
        name: '玉米'
      },
    ]
  },
  reducers: {
    updateList(state, action) {
      const { productList } = state
      productList.push(action.payload)
      return { productList }
    }
  },
  effects: {
    *updateListAsync({ payload }, {call, put}) {
      yield put({
        type: 'updateList',
        payload
      })
    },
    *updateListApi({payload}, { call, put }) {
      const result = yield call(getProduct, payload)
      if(result) {
        yield put({
          type: 'updateList',
          payload: result.data
        })
      }
    }
  }
}