/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/1
 *@Modified By:
 */
import React from 'react'
import {connect} from 'dva'
import styles from './studentReport.less'
import {Public, QuestionBank, TopicManage as namespace} from "@/utils/namespace";
import {routerRedux} from "dva/router";
import queryString from 'query-string'
import {DatePicker, Select, Empty, Pagination} from 'antd'
import {existObj, existArr, replaceSearch} from '@/utils/utils'
import moment from "moment";
import ReportList from "./component/reportList";
import paginationConfig from "@/utils/pagination";
import userInfoCache from '@/caches/userInfo';
import Page from "@/components/Pages/page";

const {Option} = Select;
const {RangePicker} = DatePicker;
@connect(state => ({
  getGradeList: state[QuestionBank].gradeList,//获取年级
  getSubjectInfo: state[namespace].getSubjectInfo,//获取科目
  getWorkListsByUserId: state[namespace].getWorkListsByUserId,//任务列表
  loading: state[namespace].loading
}))
export default class StudentReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const {dispatch, location} = this.props
    const {search} = location;
    const query = existObj(queryString.parse(search)) ? {...queryString.parse(search)} : {};
    //初始化年级
    dispatch({
      type: QuestionBank + '/getGradeList'
    });
    if (!query.testType) {
      dispatch(routerRedux.push({
        pathname: '/studentReport',
        search: queryString.stringify({id: userInfoCache().userId, testType: '1,2,3', gradeId: userInfoCache().gradeId})
      }));
    }
    // this.props.dispatch({
    //   type: Public + '/getStudyList',
    //   payload: {}
    // })

  }

  render() {
    const {dispatch, location, getSubjectInfo, getGradeList, getWorkListsByUserId, loading} = this.props;
    const {search} = location;
    const query = existObj(queryString.parse(search)) ? queryString.parse(search) : {};
    const _authSubjectList = existArr(getSubjectInfo) ? [...getSubjectInfo] : [];
    const _getGradeList = existArr(getGradeList) ? [...getGradeList] : [];
    const {data = [], total = 0} = existObj(getWorkListsByUserId) ? {...getWorkListsByUserId} : {};
    const title = '学生个人报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );
    /**
     * 选择日期处理时间
     * @param date
     * @param dateString
     */
    const selectDate = (date, dateString) => {
      let newDateString = [...dateString];
      //如果日期都为空，则让日期为空
      if (!(newDateString[0] && newDateString[1])) {
        newDateString = undefined
      }
      dispatch(routerRedux.push({
        pathname: '/studentReport',
        search: queryString.stringify({...query, dateArray: newDateString})
      }));
    };

    /**
     * 切换年级或学级
     * @param e
     * @param str
     */
    const handleGradeSpoceId = (e, str) => {
      const {dispatch, location} = this.props;
      const {search} = location;
      let query = queryString.parse(search);
      query[str] = e;
      replaceSearch(dispatch, location, query);
    };

    //列表分页、排序、筛选变化时触发
    const handleTableChange = (page) => {
      let query = queryString.parse(search);
      query = {...query, p: page};
      //修改地址栏最新的请求参数
      dispatch(routerRedux.push({
        pathname: '/studentReport',
        search: queryString.stringify(query),
      }));
    };

    return (
      <Page header={header} loading={!!loading}>
        <div className={styles['studentReport']}>
          <div className={styles['header']}>
            <div className={styles['leftFilter']}>
              <div className={styles['gradeSubject']}>
                <span>年级筛选：</span>
                <Select value={query.gradeId} style={{width: 120}} onChange={(e) => handleGradeSpoceId(e, 'gradeId')}>
                  {
                    _getGradeList.map(re => <Option key={re.id}>{re.name}</Option>)
                  }
                </Select>
              </div>
              <div className={styles['gradeSubject']}>
                <span>科目筛选：</span>
                <Select allowClear={true} placeholder="请选择科目" style={{width: 120}} onChange={(e) => handleGradeSpoceId(e, 'subjectId')}>
                  {
                    _authSubjectList.map(re => <Option key={re.id}>{re.name}</Option>)
                  }
                </Select>
              </div>
            </div>
            <div className={styles['middleFilter']}>
              {
                [{name: '全部', key: '1,2,3'}, {name: '作业报告', key: '1'}, {name: '测验报告', key: '2'}, {
                  name: '考试报告',
                  key: '3'
                }].map(re => (
                  <div className={`${re.key == query.testType ? styles['check'] : ''}`} key={re.key}
                       onClick={() => handleGradeSpoceId(re.key, 'testType')}>{re.name}</div>
                ))
              }
            </div>
            <div className={styles['rightFilter']}>
              <RangePicker
                value={
                  query && query.dateArray && query.dateArray.length > 0 ?
                    [moment(query.dateArray[0], 'YYYY-MM-DD'), moment(query.dateArray[1], 'YYYY-MM-DD')] : null
                }
                format='YYYY-MM-DD'
                onChange={selectDate}
              />
            </div>
          </div>
          <div className={styles['content']}>
            <ReportList location={location} data={data}/>
          </div>
          <div className={styles['pagination']}>
            {
              total && parseInt(total, 10) > 10 ?
                <Pagination
                  {...paginationConfig(query, total)}
                  onChange={handleTableChange}/> : ''
            }
          </div>
        </div>
      </Page>
    )
  }

}
