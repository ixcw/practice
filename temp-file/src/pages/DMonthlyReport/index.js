/**
 *@Author:xiongwei
 *@Description:分销月报
 *@Date:Created in  2021/7/8
 *@Modified By:
* @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年12月28日
 * @description 更新描述:根据新需求改版
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { Table, DatePicker } from 'antd';
import queryString from 'query-string'
import { existArr, dealTimestamp, encryptionPhone } from "@/utils/utils";
import { DMonthlyReport as namespace } from '@/utils/namespace';
import Page from "@/components/Pages/page";
import AgentBox from "@/components/Agent/AgentBox";
import moment from "moment";
import userInfoCache from '@/caches/userInfo';//登录用户的信息

const { RangePicker } = DatePicker;
@connect(state => ({
  loading: state[namespace].loading,
  getAgentShareOrders: state[namespace].getAgentShareOrders,//获取代理商直接用户的订单详情 （一二级代理商模式）
  getSubAgentReport: state[namespace].getSubAgentReport,//获取名下二级代理商分销月报统计 （一二级代理商模式）
  getAgentReportByUserId: state[namespace].getAgentReportByUserId,//获取指定代理商月报统计 （一二级代理商模式）,
}))
export default class DMonthlyReport extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
    }
  }
  componentWillUnmount() {
  }
  UNSAFE_componentWillMount() {
    // const { dispatch, location } = this.props;
    // dispatch({
    //   type: namespace + '/getAgentReportByUserId',
    //   payload: {},
    //   callback: (result) => { }
    // })
  }
  /**
   * 根据传入的对象，往地址栏添加对应的参数
   * @param obj  ：参数对象
   */
  replaceSearch = (obj) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    query = { ...query, ...obj };
    // this.uploadUserExcelModalCancel();
    //修改地址栏最新的请求参数
    dispatch(routerRedux.replace({
      pathname,
      search: queryString.stringify(query),
    }));
  };
  //选择日期处理时间
  selectDate = (date, dateString) => {
    if (dateString) {
      this.replaceSearch({ month: dateString })
    }

  };
  // selectDate = (date, dateString) => {
  //   if (dateString[0] && dateString[1]) {
  //     this.replaceSearch({ startShareDate: dateString[0], endShareDate: dateString[1] })
  //   }
  // };

  render() {
    const {
      location,
      loading,
      getAgentShareOrders,
      getSubAgentReport,
      getAgentReportByUserId = {}
    } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    const { type = 3 } = query;
    const userInfo = userInfoCache() || {};
    const tableData = type == 3 ? {
      ...getAgentShareOrders
    } : {
      ...getSubAgentReport
    }
    const { month='' }=getAgentReportByUserId;
    const monthLength=month.length;
    const monthShou =()=>{
      const data=new Date();
      const newmonth = data.getMonth() + 1;
      if( Number(month.substring(monthLength-2,monthLength))===newmonth){
        return '本月'
      }else{
        return Number(month.substring(monthLength-2,monthLength))+'月'
      }
    } 
    const columns = () => {
      if (type == 3) {
        return [
          {
            title: '序号',
            align: 'center',
            key: 'index',
            render: (text, record, index) => index + 1
          },
          {
            title: '学生姓名',
            align: 'center',
            dataIndex: 'subscriberName',
            key: 'subscriberName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '学生账号',
            align: 'center',
            key: 'subscriberAccount',
            dataIndex: 'subscriberAccount',
            render: (text) => text === ' ' ? '--' : encryptionPhone(text)
          },
          {
            title: '支付时间',
            align: 'center',
            key: 'payTime',
            dataIndex: 'payTime',
            render: (text) => text ? dealTimestamp(text, 'YYYY-MM-DD HH:mm:ss') : '--'
          },
          {
            title: '商品类型',
            align: 'center',
            key: 'goodsType',
            dataIndex: 'goodsType',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '支付金额(元)',
            align: 'center',
            key: 'payAmount',
            dataIndex: 'payAmount',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '分成(元)',
            align: 'center',
            key: 'shareAmount',
            dataIndex: 'shareAmount',
            render: (text) => text === ' ' ? '--' : <span style={{ color: 'red' }}>{text}</span>
          },
        ]
      } else if (type == 4) {
        return [
          {
            title: '序号',
            align: 'center',
            key: 'index',
            render: (text, record, index) => index + 1
          },
          {
            title: '代理商名称',
            align: 'center',
            dataIndex: 'agentName',
            key: 'agentName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理商手机号',
            align: 'center',
            key: 'agentPhoneNum',
            dataIndex: 'agentPhoneNum',
            render: (text) => text === ' ' ? '--' : encryptionPhone(text)
          },
          {
            title: '名下总用户数(人)',
            align: 'center',
            key: 'totalAgentSubscribers',
            dataIndex: 'totalAgentSubscribers',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '总收入(元)',
            align: 'center',
            key: 'earningAmount',
            dataIndex: 'earningAmount',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '总分成(元)',
            align: 'center',
            key: 'shareAmount',
            dataIndex: 'shareAmount',
            render: (text) => text === ' ' ? '--' : <span style={{ color: 'red' }}>{text}</span>
          },
        ]
      } else {
        return []
      }
    }
    const list = userInfo.agentId == 2 ? [
      {
        name: '直接用户',
        id: 3
      }
    ] : [
      {
        name: '直接用户',
        id: 3
      },
      {
        name: '二级代理',
        id: 4
      },
    ]
    const onClickSelect = (id) => {//拉取数据
      this.replaceSearch({ type: id, s: 10, p: 1, endShareDate: null, startShareDate: null })
    }
    //表格
    const handleTableChange = (pagination) => {
      this.replaceSearch({
        s: pagination.pageSize,
        p: pagination.current,
      })
    }
    return (
      // <Page header={header} loading={false}>
      <div className={styles['wrap']}>
        <div className={styles['header']}>
          <AgentBox title='名下代理总收入' subTitle={`${getAgentReportByUserId.agentEarn || 0} 元`} />
          <AgentBox title={`${monthShou()}代理总收入`} subTitle={`${getAgentReportByUserId.monthlyAgentEarn || 0}元`} />
          <AgentBox title='代理总分成' subTitle={`${getAgentReportByUserId.agentShare || 0}元`} />
          <AgentBox title={`${monthShou()}总分成`} subTitle={`${getAgentReportByUserId.monthlyAgentShare || 0}元`} />
        </div>
        <div>
          <div className={styles['selects']}>
            <div className={styles['select']}>
              {
                list.map(({ name, id }) =>
                  <div
                    className={styles['item']}
                    key={id}
                    onClick={() => { onClickSelect(id) }}
                    style={{ backgroundColor: type == id && '#268BFF', color: type == id && '#fff' }}>
                    {name}
                  </div>)
              }
            </div>
            <div>
              <span>账期：</span>
              {/* <RangePicker
                value={
                  query.endShareDate && query.startShareDate ?
                    [moment(query.startShareDate, 'YYYY-MM-DD'), moment(query.endShareDate, 'YYYY-MM-DD')] : null
                }
                format='YYYY-MM-DD'
                onChange={this.selectDate}
              /> */}
              <DatePicker
                value={
                  query.month ?
                    moment(query.month, 'YYYY-MM') : moment(dealTimestamp(new Date(), 'YYYY-MM'), 'YYYY-MM')
                }
                format='YYYY-MM'
                onChange={this.selectDate}
                allowClear={false}
                picker="month" />
            </div>
          </div>
          <div>
            <Table columns={[...columns()]}
              rowKey={type == 3 ? 'id' : 'agentUserId'}
              onChange={handleTableChange}
              loading={loading}
              bordered
              pagination={{ total: tableData.total, pageSize: parseInt(query.s, 10) || 10, current: parseInt(query.p, 10) || 1, showTotal: total => `共 ${total} 条`, }}
              dataSource={tableData.data || []}
            />
          </div>
        </div>
      </div>
      // </Page>
    )
  }
}