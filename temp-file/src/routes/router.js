import React from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from '@/components/App/App';
import Flex from '@/components/Header/index';
import WrongPage from '@/pages/WrongPage';//错误页面
import WrongPage403 from '@/pages/WrongPage/403/index';//错误页面
import LookingForward from '@/pages/WrongPage/LookingForward/index';//错误页面
import Login from '@/pages/Login';//登录页面
import PenManage from '@/pages/PenManage'//点阵笔管理
import Home from '@/pages/Homes';// 首页
import SetPassword from '@/pages/setPassword';// 设置密码
import Register from '@/pages/register';// 注册
import PersonalCenter from '@/pages/personalCenter';//个人中心
import VideoPlayer from '@/pages/videoPlayer';//视频播放
// import MonthlyReport from '@/pages/MonthlyReport';//分销月报
import AssignTask from '@/pages/assignTask';
// import PaperCompositionCenter from '@/pages/paperCompositionCenter';//组题中心

// 题库管理
import QuestionBankList from '@/pages/QuestionBank';// 题库管理列表
// 题列表
import QuestionList from '@/pages/QuestionBank/Question';// 题列表
// 题库管理审核
import QuestionAudit from '@/pages/QuestionBank/QuestionAudit';// 题库管理审核
import VersionQuestion from '@/pages/QuestionBank/Version';//版本题库列表

//报告及批阅
import TaskCorrect from '@/pages/taskCorrect'//批阅列表
import TestReport from "@/pages/testReport";//试题报告
import StudentPersonReports from "@/pages/studentsReport/studentPersonReport";
import StudentReport from '@/pages/testReport/studentReport'//学生学习报告
import StudentPersonReport from '@/pages/studentPersonReport'//学生学习报告
import GradeReport from '@/pages/gradeReport'//年级报告
import TeacherReport from '@/pages/testReport/teacherReport'//教师学习报告
import MistakeTopicReport from "@/pages/mistakeTopicReport"; //错题报告
import CorrectJob from '@/pages/taskCorrect/components/correctJob'//批阅

//组题中心
import CombinationPaperCenterIndex from "@/pages/CombinationPaperCenter/index";//
import PaperBoard from "@/pages/CombinationPaperCenter/PaperBoard";//试题板
import MyQuestionGroup from "@/pages/CombinationPaperCenter/MyQuestionGroup";//我的题组
import PreviewExport from "@/pages/CombinationPaperCenter/PreviewExport";//导出预览试卷
import PreviewExportSheet from "@/pages/CombinationPaperCenter/PreviewExportSheet";//导出预览答题卡
import MatchingQuestion from "@/pages/CombinationPaperCenter/Matching";//匹配相似题
import PreviewAnswerAnalysis from "@/pages/CombinationPaperCenter/PreviewAnswerAnalysis";//导出预览答案解析

import AgentDetail from '@/pages/AgentDetail'//代理明细
import DMonthlyReport from '@/pages/DMonthlyReport'//分销月报
// 组织机构
//教师管理
import TeacherManage from '@/pages/orgManage/teacherManage'
//通知中心
import SchoolNotice from '@/pages/schoolNotice'
//学校历史通知
import SchoolNoticeHistory from '@/pages/schoolNoticeHistory'
//班级管理
import ClassManage from '@/pages/orgManage/classManage'
import StudentInfo from '@/pages/orgManage/studentInfo/index'
import TaskAllot from "@/pages/taskAllot";
//学生信息

import CommissionerSetParam from '@/pages/CommissionerSetParam/question/index';//前台专员(组员,组长)设参(四要素)
import SetQuestionList from '@/pages/CommissionerSetParam/SetQuestionList/index';//套题设参
import QuestionListSetParam from '@/pages/CommissionerSetParam/SetQuestionList/QuestionList';//套题设参-题目列表
import QuestionDetail from '@/pages/QuestionDetail/index';
import RecordingPage from '@/pages/RecordingPage/index'; //录制页面
import SmallClassList from '@/pages/smallClassList/index'; //微课中心

// 支付
import DataEmbody from "@/pages/dataEmbody";
//支付中心
import PayCenter from '@/pages/PayCenter/index';//支付中心
// 校本题库
import SchoolBasedQuestionBank from '@/pages/CombinationPaperCenter/SchoolBasedQuestionBank/index';
//校本题库

import LinkCard from '@/pages/adminRender/LinkCard/index'; //链接卡
import AnswerSheet from '@/pages/adminRender/AnswerSheet/index'; //答题卡
import LiveManage from "@/pages/BusinessManagement/LiveManage";//直播管理
import WatchLive from "@/pages/WatchLive";//观看直播
import TestPushLive from "@/pages/BusinessManagement/TestPushLive";//调试直播推流

import EmployeeData from '@/pages/EmployeeData/index'; //职工数据
import TeacherData from '@/pages/TeacherData/TeacherData' //老师数据
import School from '@/pages/School/School'//学校首页数据
import ParenTs from "@/pages/ParenTs/parents"//家长数据
import Student from '@/pages/Student/student'//学生数据

//成果管理
import Achievement from '@/pages/achievement'
import AchievementSubmenu from '@/pages/achievement/submenu'
// 考勤管理
import AttendanceManage from '@/pages/attendanceManage'
//资助管理图表
import FundingManagement from '@/pages/fundingManagement'
//资助管理数据列表
import Subsidizelist from '../pages/Subsidizelist'

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {

  //组题中心
  const CombinationPaperCenters = ({ match }) => (
    <div>
      <Route exact path={`${match.url}/:tab`} component={CombinationPaperCenterIndex} />
      <Route exact path={match.url} component={CombinationPaperCenterIndex} />
    </div>
  );

  //我的组题
  const MyQuestionGroups = ({ match }) => (
    <div>
      <Route exact path={`${match.url}`} component={MyQuestionGroup} description={'我的题组'} />
      <Route exact path={`${match.url}/paper-board`} component={PaperBoard} description={'试题板'} />
      <Route exact path={`${match.url}/preview-export`} component={PreviewExport} description="预览导出" />
      <Route exact path={`${match.url}/preview-export-sheet`} component={PreviewExportSheet} description="答题卡预览导出" />
      <Route exact path={`${match.url}/matching`} component={MatchingQuestion} description="相似题匹配" />
      <Route exact path={`${match.url}/answer-analysis`} component={PreviewAnswerAnalysis} description="答案解析" />
    </div>
  )

  return (
		<ConnectedRouter history={history}>
			<ConfigProvider locale={zhCN}>
				{/* <Redirect from={"/"} to={'/home'} /> */}
				<Switch>
					<Route path='/login' component={Login} />
					<Route path='/setPassword' component={SetPassword} />
					<Route path='/register' component={Register} />
					<Route path='/recording-page' exact component={RecordingPage} description='题目详情' />
					<Route path='/link-card' exact component={LinkCard} description='链接卡' />
					<Route path='/answer-sheet' exact component={AnswerSheet} description='答题卡' />
					{/* 录制页面 */}
					<App>
						<Flex>
							<Switch>
								<Route path='/' exact component={Home} description='首页' />
								<Route path='/home' exact component={Home} description='首页' />
								<Route path='/personalCenter' component={PersonalCenter} description='个人中心' />
								<Route path='/video' component={VideoPlayer} description='播放器' />
								{/* <Route path="/monthly-report" component={MonthlyReport} description="分销月报" /> */}
								{/* 题库 */}
								<Route path='/assignTask' component={AssignTask} description='布置任务' />
								<Route path='/taskCorrect' component={TaskCorrect} description='作业批改' />
								<Route path='/correctJob' component={CorrectJob} description='批改' />
								{/* 报告相关 */}
								<Route path='/testReport' component={TestReport} description='试题报告' />
								<Route path='/studentPersonReports' component={StudentPersonReports} description='学生报告' />
								<Route path='/studentPersonReport' component={StudentPersonReport} description='学生报告' />
								<Route path='/studentReport' component={StudentReport} description='学习报告' />
								<Route path='/teacherReport' component={TeacherReport} description='班级报告' />
								<Route path='/gradeReport' component={GradeReport} description='年级报告' />
								<Route path='/mistakeTopicReport' component={MistakeTopicReport} description='错题报告' />
								{/* 题库管理 */}
								<Route path='/question-task-list' exact component={QuestionBankList} description='题库管理列表' />
								<Route path='/question-list' exact component={QuestionList} description='题列表' />
								<Route path='/question-audit-list' exact component={QuestionAudit} description='题库管理审核' />
								{/* 版本题库列表 */}
								<Route path='/version-question-list' exact component={VersionQuestion} description='版本题库列表' />
								{/* 题组相关 */}
								<Route path='/question-center' component={CombinationPaperCenters} description={'组题中心'} />
								<Route path='/my-question-group' component={MyQuestionGroups} description={'我的题组'} />
								{/* 组织机构 */}
								<Route path='/teacherManage' component={TeacherManage} description='教师管理' />
								<Route path='/classManage' component={ClassManage} description='班级管理' />
								<Route path='/student-info' exact component={StudentInfo} description='学生管理' />
								<Route path='/schoolNoticeNew' exact component={SchoolNotice} description='通知中心' />
								<Route path='/schoolNoticeHistory' exact component={SchoolNoticeHistory} description='历史通知' />
								<Route path='/taskAllot' exact component={TaskAllot} description='分配任务' />

								<Route path='/commissioner-setParam' exact component={CommissionerSetParam} description='前台专员(组员,组长)设参(四要素)' />
								<Route path='/question-detail' exact component={QuestionDetail} description='题目详情' />
								<Route path='/set-question-list' exact component={SetQuestionList} description='套题设参' />
								<Route path='/set-question-list/set-param' component={QuestionListSetParam} description='套题设参' />

								<Route path='/agentDetail' exact component={AgentDetail} description='代理明细' />

								<Route path='/DMonthlyReport' exact component={DMonthlyReport} description='分销月报' />
								<Route path='/smallClassList' exact component={SmallClassList} description='微课中心' />

								{/*数据入库*/}
								<Route path='/dataEmbody' exact component={DataEmbody} description='数据入库' />
								<Route path='/penManage' exact component={PenManage} description='点阵笔管理' />
								<Route path='/pay-center' exact component={PayCenter} description='支付中心' />
								<Route path='/school-based_question-bank' exact component={SchoolBasedQuestionBank} description='校本题库' />

								{/*直播管理*/}
								<Route path='/mylive-manage' exact component={LiveManage} description='直播管理' />
								<Route path='/watch-live' exact component={WatchLive} description='观看直播' />
								<Route path='/test-push-live' exact component={TestPushLive} description='调试直播推流' />
								{/* 教职工数据 */}
								<Route path='/employeeData' exact component={EmployeeData} description='职工数据' />
								<Route path='/teacherData' exact component={TeacherData} description='老师数据' />
								{/* 学校家长班主任学生数据 */}
								<Route path='/SchoolData' exact component={School} description='学校数据' />
								<Route path='/ParentsData' exact component={ParenTs} description='家长数据' />
								<Route path='/StudentData' exact component={Student} description='学生数据' />
								{/* 成果管理 */}
								<Route path='/Achievement' exact component={Achievement} description='成果管理' />
								<Route path='/AchievementSubmenu' exact component={AchievementSubmenu} description='查看数据' />
								{/* 考勤管理 */}
								<Route path='/AttendanceManage' exact component={AttendanceManage} description='考勤管理' />
								{/* 资助管理 */}
								<Route path='/FundingManagement' exact component={FundingManagement} description='资助图表' />
								<Route path='/Subsidizelist' exact component={Subsidizelist} description='资助列表' />

								{/* 错误页面 */}
								<Route path='/looking-forward' exact component={LookingForward} description='敬请期待页面' />
								<Route path='/403' exact component={WrongPage403} description='错误页面403等页面' />
								<Route component={WrongPage} description='错误页面 404 500等页面' />
							</Switch>
						</Flex>
					</App>
				</Switch>
			</ConfigProvider>
		</ConnectedRouter>
	)
}

export default RouterConfig;
