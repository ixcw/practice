import { getInstructionPaperPreview } from "../../../services/combination/myQuestionGroup"
import { PreviewExport as namespace } from "../../../utils/namespace"

export default {
  namespace,
  state: {},
  reducers: {
    updateInstructionPaperPreview(state, { payload }) {
      console.log('payload ', payload);
      const data = payload.err.data.data
      return { ...data }
    }
  },
  effects: {
    *updateInstructionPaperPreviewApi({payload}, { call, put }) {
      const result = yield call(getInstructionPaperPreview, payload)
      if(result) {
        yield put({
          type: 'updateInstructionPaperPreview',
          payload: result
        })
      }
    }
  }
}