/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/1
 *@Modified By:
 */
import React from 'react';
import styles from './reviewReport.module.less'
import Page from '@/components/Pages/page';
import {connect} from 'dva'
import {Input} from 'antd';
import queryString from 'query-string';
import {routerRedux} from 'dva/router';
import ReviewReportTable from '@/components/ReviewReport/reviewReportTable'//批阅及报告列表
import {TopicManage as namespace} from '@/utils/namespace'
import BackBtns from "@/components/BackBtns/BackBtns";


const {Search} = Input;
@connect(state => ({
  getStudentLists: state[namespace].getStudentLists,//学生列表
  loading: state[namespace].loading
}))
export default class ReviewReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      getStudentListsState:[]
    };
  };

  UNSAFE_componentWillUpdate(nextProps, nextState, nextContext) {
    if(JSON.stringify(nextProps.getStudentLists)!==JSON.stringify(this.props.getStudentLists)){
      this.setState({getStudentListsState:nextProps.getStudentLists})
    }
  }


  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type:namespace+'/set',
      payload:{
        getStudentLists:[]
      }
    })
  }

  // 点击用户列表选择用户所对应的作业列表
  handleUser = (obj) => () => {
    const {dispatch, location} = this.props;
    const {pathname, search} = location;
    const query = queryString.parse(search);
    query.id = obj.id;
    dispatch(routerRedux.replace({
      pathname,
      search: queryString.stringify(query),
    }));
  };


  render() {
    const title = '教师个人报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );
    const {location, loading,getStudentLists} = this.props;
    const {getStudentListsState} =this.state;
    const {search} = location;
    const query = queryString.parse(search);


    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['reviewReport']}>
          <div className={styles['reviewReportLeft']}>
            <div className={styles['listName']}>学生列表</div>
            <div className={styles['search']}>
              <Search
                placeholder="搜索学生"
                onSearch={value => {
                  let searchStudents=getStudentLists.filter(re=>re.userName&&(re.userName).indexOf(value)!==-1);
                  this.setState({getStudentListsState:searchStudents})
                }}
                style={{width: 200}}
              />
            </div>
            <div className={styles['userLists']}>
              {getStudentListsState && getStudentListsState.length > 0 && getStudentListsState.map(re => {
                return (
                  <div className={`${styles.userList} ${styles[re.id === parseInt(query.id, 10) ? 'bcg' : '']}`}
                       key={re.id} onClick={this.handleUser(re)}>
                    <div className={styles['userListR']}>
                      <div className={styles['name']}>{re.userName ? re.userName : '未知'}</div>
                    </div>
                  </div>
                )
              })
              }
            </div>
          </div>
          <div className={styles['reviewReportRight']}>
            <ReviewReportTable location={location}/>
          </div>
        </div>
      </Page>)
  }
}
