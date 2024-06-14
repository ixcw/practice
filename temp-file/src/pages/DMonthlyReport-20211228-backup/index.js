/**
 *@Author:xiongwei
 *@Description:分销月报
 *@Date:Created in  2021/7/8
 *@Modified By:
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { Table, DatePicker } from 'antd';
import queryString from 'query-string'
import { existArr, dealTimestamp } from "@/utils/utils";
import { DMonthlyReport as namespace } from '@/utils/namespace';
import Page from "@/components/Pages/page";
import AgentBox from "@/components/Agent/AgentBox";
import moment from "moment";

const { RangePicker } = DatePicker;
@connect(state => ({
  loading: state[namespace].loading,
  findMonthlyAgentReportInfoByUserId: state[namespace].findMonthlyAgentReportInfoByUserId,
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
    // this.replaceSearch({id:1})
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
    if (dateString[0] && dateString[1]) {
      this.replaceSearch({ startShareDate: dateString[0], endShareDate: dateString[1] })
    }
  };

  render() {
    const { location, findMonthlyAgentReportInfoByUserId = {}, loading } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    const { type = 1 } = query;
    const columns = () => {
      if (type == 1 || type == 3) {
        return [
          {
            title: '序号',
            align: 'center',
            key: 'index',
            render: (text, record, index) => index + 1
          },
          {
            title: '账号',
            align: 'center',
            dataIndex: 'account',
            key: 'account',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '区域',
            align: 'center',
            key: 'areaName',
            dataIndex: 'areaName',
            render: (text) => text === ' ' ? '--' : text
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
            title: '消费(元)',
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
      } else if (type == 2) {
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
            key: 'phone',
            dataIndex: 'phone',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理类型',
            align: 'center',
            key: 'agentTypeName',
            dataIndex: 'agentTypeName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理区域',
            align: 'center',
            key: 'areaName',
            dataIndex: 'areaName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '总收入(元)',
            align: 'center',
            key: 'inAreaEarning',
            dataIndex: 'inAreaEarning',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '总分成(元)',
            align: 'center',
            key: 'inAreaEarningShare',
            dataIndex: 'inAreaEarningShare',
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
            key: 'phone',
            dataIndex: 'phone',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理类型',
            align: 'center',
            key: 'agentTypeName',
            dataIndex: 'agentTypeName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理区域',
            align: 'center',
            key: 'areaName',
            dataIndex: 'areaName',
            render: (text) => text === ' ' ? '--' : text
          },
          {
            title: '代理费/分成(元)',
            align: 'center',
            key: 'recommendedAgentEarning',
            dataIndex: 'recommendedAgentEarning',
            render: (text, record) => <div>{text}/<span style={{ color: 'red' }}>{record.recommendedAgentEarningShare}</span></div>
          },
          {
            title: '总收入/分成(元)',
            align: 'center',
            key: 'inAreaEarning',
            dataIndex: 'inAreaEarning',
            render: (text, record) => <div>{text}/<span style={{ color: 'red' }}>{record.inAreaEarningShare}</span></div>
          },
          {
            title: '总分成(元)',
            align: 'center',
            key: 'totalShare',
            dataIndex: 'totalShare',
            render: (text) => text === ' ' ? '--' : <span style={{ color: 'red' }}>{text}</span>
          },
        ]
      } else {
        return []
      }
    }
    const list = [
      {
        name: '区域外',
        id: 1
      },
      {
        name: '区域内代理',
        id: 2
      },
      {
        name: '直接用户',
        id: 3
      },
      {
        name: '推荐代理',
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
          <AgentBox title='名下代理商总数' subTitle={`${findMonthlyAgentReportInfoByUserId.agentNum || 0} 人`} />
          <AgentBox title='名下学校或机构总数' subTitle={`${findMonthlyAgentReportInfoByUserId.schoolNum || 0}个`} />
          <AgentBox title='名下总用户量' subTitle={`${findMonthlyAgentReportInfoByUserId.userNum || 0}个`} />
          <AgentBox title='本月总收入' subTitle={`${findMonthlyAgentReportInfoByUserId.earnInThisMounth || 0}元`} />
          <AgentBox title='本月总分成' subTitle={`${findMonthlyAgentReportInfoByUserId.shareInThisMounth || 0}元`} />
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
              <RangePicker
                value={
                  query.endShareDate && query.startShareDate ?
                    [moment(query.startShareDate, 'YYYY-MM-DD'), moment(query.endShareDate, 'YYYY-MM-DD')] : null
                }
                format='YYYY-MM-DD'
                onChange={this.selectDate}
              />
            </div>
          </div>
          <div>
            <Table columns={[...columns()]}
              rowKey={findMonthlyAgentReportInfoByUserId.fromUserVos ? 'account' : 'phone'}
              onChange={handleTableChange}
              loading={loading}
              bordered
              pagination={{ total: findMonthlyAgentReportInfoByUserId.total, pageSize: query.s || 10, current: query.p || 1, }}
              dataSource={findMonthlyAgentReportInfoByUserId.fromUserVos || findMonthlyAgentReportInfoByUserId.fromAgentVos}
            />
          </div>
        </div>
      </div>
      // </Page>
    )
  }
}