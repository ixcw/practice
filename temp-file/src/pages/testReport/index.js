/**
 *@Author:ChaiLong
 *@Description: 试题报告
 *@Date:Created in  2020/8/28
 *@Modified By:
 */
import React from 'react'
import Page from '@/components/Pages/page';
import styles from './index.less'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import AssignTaskChart from '@/components/AssignTask/AssignTaskChart'
import {TopicManage as namespace} from '@/utils/namespace'
import BackBtns from "@/components/BackBtns/BackBtns";
import ReportPay from "@/components/ReportPay/reportPay";
import { getLocationObj } from "@/utils/utils";

@connect(state => ({
  loading: state[namespace].loading,
  checkIsBuy:state[namespace].checkIsBuy,
}))
export default class TestReport extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {}
  }

  // getBack = () => {
  //   const {dispatch} = this.props;
  //   // const {search,pathname} = location;
  //   // const query = queryString.parse(search);
  //   dispatch(routerRedux.push({
  //     pathname: '/assignTask',
  //     // search:  queryString.stringify({ id:query.id }),
  //   }));
  // };

  render() {
    const {location,checkIsBuy}=this.props;
    const title = '试题管理-布置任务-查看报告';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );
    
    const {loading} = this.props;
    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['testReport']}>
          <div className={styles['RosePieCharts']}>
            {/* {
              checkIsBuy ? */}
              <AssignTaskChart location={location}/>
              {/* :
              <ReportPay location={location}/>
              } */}
          </div>
          <div className='no-print'>
            <BackBtns tipText={"返回"}/>
          </div>
        </div>
      </Page>
    )
  }
}
