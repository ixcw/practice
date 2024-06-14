import dva from 'dva'
import { notification } from 'antd'
import './index.less'
import PowerUtils from '@/utils/PowerUtils'
import { HandleAbnormalStateConfig } from '@/utils/utils'

window.$PowerUtils = PowerUtils
window.$HandleAbnormalStateConfig = HandleAbnormalStateConfig//处理异常提示
window.$emptyDescInfo = '暂无数据'
window.$systemTitleName = '盘州市教育大数据平台——校平台'

const key = 'gougou-updatable'

// 1. Initialize
const app = dva()

app.use({
  onError: function (error, action) {
    if (error.message == 601) {
      return
    }
    // message.error(error.message || '失败', 5);
    // error.message == 'Internal Server Error' && error.code == 500
    const description = error.message ?
      ((error.message == 'Failed to fetch') ?
        '当前网络异常，请检查网络后，刷新重试！' : Number(error.code) >= 500 && Number(error.code) < 600 ? '服务响应异常，请稍候重试！' : error.message)
      : '服务响应异常，请稍候重试！'
    notification.error({
      key,
      message: '提示信息',
      description: description,//(error.message || '失败'),
    })
  }
})

// 3. Model
app.model(require('@/models/auth').default)
app.model(require('@/models/public/public').default)
app.model(require('@/models/homeIndex').default)//首页
app.model(require('@/models/questionBank').default)
app.model(require('@/models/assignTask').default)//布置任务
app.model(require('@/models/MonthlyReport').default)//月报分销
app.model(require('@/models/PersonalCenter').default)//月报分销
app.model(require('@/models/topicManage').default)//报告
app.model(require('@/models/studnetPersonReport').default)//学生个人报告
app.model(require('@/models/mistakeTopicReport').default)//错题报告
app.model(require('@/models/gradeReport').default)//年级报告
// app.model(require('@/models/topicManageModal').default);//报告Modal
app.model(require('@/models/taskCorrect').default);//批改任务
app.model(require('@/models/classAndTeacherManage').default);//班级和教师管理
app.model(require('@/models/videoPlayer').default);//视频播放中心
app.model(require('@/models/dataEmbody').default);//数据入库
app.model(require('@/models/penManage').default);//点阵笔管理
app.model(require('@/models/resource').default);//资源token相关

app.model(require('../models/EmployeeInformation').default);//数据中心-职工数据
app.model(require('../models/teacherInformation').default);//数据中心-老师数据
app.model(require('../models/SchooIinformation').default)//数据中心-学校数据
app.model(require('../models/parentInformation').default)//数据中心-家长数据
app.model(require('@/models/studentInformation').default) //数据中心-学生数据

app.model(require('@/models/attendanceManage').default) //考勤管理

app.model(require('@/models/achievement').default) //成果管理首页
app.model(require('@/models/achievementSubmenu').default) //成果管理数据

app.model(require('@/models/Subsidizelist').default) //资助管理

app.model(require('@/models/combinationPaperCenter/manualCombination').default)//手动组题
app.model(require('@/models/combinationPaperCenter/AutomaticCombination').default)//自动组题
app.model(require('@/models/combinationPaperCenter/paperBoard').default)//试题板
app.model(require('@/models/combinationPaperCenter/myQuestionGroup').default)//我的题组
app.model(require('@/models/combinationPaperCenter/previewExport').default)//题组批阅
app.model(require('@/models/taskAllot').default)//任务分配

app.model(require('@/models/studentManage').default)//组织机构-学生管理

app.model(require('@/models/commissionerSetParam').default)//题库专员-设参
app.model(require('@/models/setQuestionSetParam').default)//套题设参
app.model(require('@/models/payCenter').default)//支付中心
app.model(require('@/models/agentDetail').default)//代理明细
app.model(require('@/models/DMonthlyReport').default)//分销月报
app.model(require('@/models/smallClassList').default)//微课列表
app.model(require('@/models/businessManagement/liveManage').default)//直播管理
app.model(require('@/models/schoolNotice').default)//通知中心
// 4. Router
app.router(require('@/routes/router').default)

// 5. Start
app.start('#root')

export default app._store // eslint-disable-line
