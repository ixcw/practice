/**
 *@Author:ChaiLong
 *@Description:【批阅及报告列表】
 *@Date:Created in  2019/12/23
 *@Modified By:
 */
import React from 'react';
import styles from './reviewReportTable.module.less'
import {DatePicker, Checkbox, Table, message, Button, Empty, Pagination} from 'antd';
import {connect} from 'dva'
import queryString from 'query-string';
import {routerRedux} from 'dva/router';
import moment from "moment";
import {TopicManage as namespace} from "@/utils/namespace";
import {dealTimestamp, pushNewPage, existObj, existArr, replaceSearch} from "@/utils/utils";
import paginationConfig from "@/utils/pagination";
import ReportList from "@/pages/testReport/component/reportList";

const {RangePicker} = DatePicker;

@connect(state => ({
  getStudentLists: state[namespace].getStudentLists,//学生列表
  getWorkListsByUserId: state[namespace].getWorkListsByUserId,//任务列表
}))
export default class reviewReportTable extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visible: false
    };
  };

  componentDidMount() {
    const {dispatch, location} = this.props;
    const {search} = location;
    const query = queryString.parse(search);
    //初始化页面，请求学生列表
    dispatch({
      type: namespace + '/getStudentLists',
      callback: (data) => {
        if (data && data.length > 0) {
          //默认选中作业类型
          if (!query.testType) {
            dispatch(routerRedux.push({
              pathname: '/teacherReport',
              search: queryString.stringify({id: data[0].id, testType: '1,2,3'})
            }));
          }
        }
      }
    });

  }


  //选择日期处理时间
  selectDate = (date, dateString) => {
    const {dispatch, location} = this.props;
    const {search} = location;
    const query = queryString.parse(search);
    let newDateString = [...dateString];
    //如果日期都为空，则让日期为空
    if (!(newDateString[0] && newDateString[1])) {
      newDateString = undefined
    }
    dispatch(routerRedux.push({
      pathname: '/teacherReport',
      search: queryString.stringify({...query, dateArray: newDateString})
    }));
  };

//类型多选框按钮触发事件
  checkboxOnChange = (checkedValues) => {
    //布置任务列表类型不能为空
    if (checkedValues.length === 0) {
      message.warning('类型不能为空');
      return
    }
    const {dispatch, location} = this.props;
    const {search} = location;
    const query = queryString.parse(search);
    let newCheckedValues = undefined;
    //判断数组是否为空
    if (!(Number(checkedValues) === 0)) {
      newCheckedValues = checkedValues.join(',')
    }
    //初始化页面，默认选中作业类型
    dispatch(routerRedux.push({
      pathname: '/teacherReport',
      search: queryString.stringify({...query, testType: newCheckedValues})
    }));
  };


  //列表分页、排序、筛选变化时触发
  handleTableChange = (page) => {
    const {dispatch, location} = this.props;
    const {search} = location;
    let query = queryString.parse(search);
    query = {...query, p: page};
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname: '/teacherReport',
      search: queryString.stringify(query),
    }));
  };


  render() {
    const {location, getWorkListsByUserId, dispatch} = this.props;
    const {search} = location;
    const query = queryString.parse(search);
    //多选框从地址栏获取当前选中值
    let checkValue = query && query.testType && query.testType.split(',') || [];
    const {data = [], total = 0} = existObj(getWorkListsByUserId) ? {...getWorkListsByUserId} : {};
    //多选框配置
    const options = [
      {label: '作业', value: '1'},
      {label: '测试', value: '2'},
      {label: '试卷', value: '3'},
    ];

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

    return (

      <div id={styles['reviewReportTable']}>
        <div className={styles['reviewReportBox']}>
          {/*头部区域*/}
          <div className={styles['reviewReportHeader']}>
            <div className={styles['leftHeader']}>
                {
                  [{name: '全部', key: '1,2,3'}, {name: '作业报告', key: '1'}, {name: '测验报告', key: '2'}, {
                    name: '考试报告',
                    key: '3'
                  }].map(re => (
                    <div className={`${re.key == query.testType ? styles['check'] : ''}`} key={re.key}
                         onClick={() => handleGradeSpoceId(re.key, 'testType')}>{re.name}</div>
                  ))
                }
              {/*<div className={styles['type']}>*/}
              {/*  <Checkbox.Group options={options} value={checkValue} onChange={this.checkboxOnChange}/>*/}
              {/*</div>*/}
            </div>
            <div className={styles['rightHeader']}>
              <RangePicker
                value={
                  query && query.dateArray && query.dateArray.length > 0 ?
                    [moment(query.dateArray[0], 'YYYY-MM-DD'), moment(query.dateArray[1], 'YYYY-MM-DD')] : null
                }
                format='YYYY-MM-DD'
                onChange={this.selectDate}
              />
            </div>
          </div>

          <div className={styles['reviewReportCenter']}>
            <div className={styles['report-list']}>
              <ReportList location={location} data={data}/>
            </div>
            <div className={styles['pagination']}>
              {
                total && parseInt(total, 10) > 10 ?
                  <Pagination
                    {...paginationConfig(query, total)}
                    onChange={this.handleTableChange}/> : ''
              }
            </div>
          </div>
        </div>
      </div>)
  }
}

