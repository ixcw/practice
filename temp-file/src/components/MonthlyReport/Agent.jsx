//----------------------------------------------------弃用----------------------------------------
/**
 * 一级代理月报/二级代理月报
 * @author：张江
 * @creatTime : 2020年03月13日
 * @version:v1.0.0
 */
import react, { Component } from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Input, Select, Button, Table, TreeSelect, Tag, Divider, message, DatePicker, Checkbox } from 'antd';
import paginationConfig from '@/utils/pagination';
import Page from "@/components/Pages/page";
import { stdColumns, processDataRetainDigit } from "@/utils/utils";
import { AgentInfoManagement as namespace } from '@/utils/namespace';
import { particularYear, qTaskStatus } from "@/utils/const";

import styles from './index.less';

const { Option } = Select;
const { MonthPicker } = DatePicker;

@connect(state => ({
  loading: state[namespace].loading,//显示加载中
  agentUserInfosList: state[namespace].agentUserInfosList,//代理商信息列表
  agentDetailInfos: state[namespace].agentDetailInfos,//代理商用户代理明细
}))

export default class Agent extends Component {

  constructor(props) {
    super(...arguments);
    this.state = {
          selectedType:1,
    };
  };

  componentDidMount() {
    const {
      dispatch,
      location
    } = this.props;
    const { search } = location;
    const query = queryString.parse(search);

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


  onCheckboxChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  onChangeSelected=(type)=>{
this.setState({
  selectedType:type
})
  }

  render() {
    const {
      location,
      loading,
      dispatch,
    } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    const { selectedType } = this.state;

    const title = query && query.type == 2 ? '二级代理月报-分销月报' : '一级代理月报-分销月报';
    const breadcrumb = [title];
    const urls = ['/distribution/monthly-report'];//上一级路由
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} urls={urls} />
    );

    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        phone: 18000000000,
        cityName: '西湖区湖底公园1号',
        bankName: 360,
        bankCardId: '已结算'
      },
      {
        key: '2',
        name: '胡彦祖',
        phone: 18000000000,
        cityName: '西湖区湖底公园2号',
        bankName: 360,
        bankCardId: '已结算'
      },
    ];


    const columnsByUser = [//直接用户
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },

      {
        title: '平台订单号',
        dataIndex: 'bankName',
        key: 'bankName',
        align: 'center',
      },
      {
        title: '支付渠道',
        dataIndex: 'bankName',
        key: 'bankNamedf',
        align: 'center',
      },
      {
        title: '支付状态',
        dataIndex: 'bankName',
        key: 'bankNamessr',
        align: 'center',
      },
      {
        title: '消费项目',
        dataIndex: 'bankName',
        key: 'bankNameert',
        align: 'center',
      },
      {
        title: '交易类型',
        dataIndex: 'bankCardId',
        key: 'bankCardIdert',
        align: 'center',
      },
      {
        title: '交易金额',
        dataIndex: 'bankCardId',
        key: 'bankCardIderwtert',
        align: 'center',
      },
      {
        title: '交易时间',
        dataIndex: 'bankCardId',
        key: 'bankCardIdwertqwer',
        align: 'center',
      },
      {
        title: '对账状态',
        dataIndex: 'bankCardId',
        key: 'bankCardIertd',
        align: 'center',
        filters: qTaskStatus,
        filteredValue: query && query.statusIds ? query.statusIds.split(',') : [],
        onFilter: (value, record) => String(record.status).indexOf(value) === 0,
      },
    ]


    const handleTableChange = (pagination, filters, sorter) => {
      this.replaceSearch({
        p: pagination.current,
        s: pagination.pageSize,
      })
    };
    const classString = classNames(styles['monthly-report-content'], 'gougou-content');
    return (
      <Page header={header} loading={!!loading}>
        <div className={classString}>
         

          <div className={styles['agent-financial-info-box']}>
            <div className={styles['billing-month']}>
              <div>
                <label>账单月：</label>
                <div>2020年03月</div>
              </div>
              <div className={styles['status']}>
                未平账
              </div>
            </div>

            <div className={styles['financial-info-box']}>
              <div className={styles['agent-info']}>
                <h3>张大山</h3>
                <div>贵阳市&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一级代理</div>
                <div className={styles['line']}></div>
              </div>
              <div className={styles['financial-info']}>
                <div className={styles['base-info']}>
                  <span>总成交：<span className={styles['money-num']}>  {processDataRetainDigit(289356, 2, '元')}</span></span>
                  <span>总分润：<span className={styles['money-num']}> {processDataRetainDigit(78965, 2, '元')}</span></span>
                  <span>已发放：<span className={styles['money-num']}> {processDataRetainDigit(12365, 2, '元')}</span></span>
                </div>
                <div>
                  <Button
                    type="primary"
                  // onClick={() => {
                  //   this.showModal({})
                  // }}
                  >打款</Button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles['other-select-info-box']}>
            <div className={styles['monthly-report-type-box']}>
              <div className={styles['other-select-info']}>
                <div className={styles['checking-status-1']}>
                  未对账
                </div>
                <div className={styles[selectedType == 1 ? 'item-selected' : 'item-no-select']} onClick={()=>{
                  this.onChangeSelected(1)
                }}>
                  <div className={styles['item-title']}>
                    直接用户
                          <h4>12589人</h4>
                  </div>
                  <div className={styles['item-description']}>
                    <p>总消费：12456元</p>
                    <p>可分润：124元</p>
                  </div>
                </div>
              </div>


              <div className={styles['other-select-info']}>
                <div className={styles['checking-status-2']}>
                  未平账
                </div>
                <div className={styles[selectedType == 2 ? 'item-selected' : 'item-no-select']} onClick={() => {
                  this.onChangeSelected(2)
                }} >
                  <div className={styles['item-title']}>
                    学校
                          <h4>12589所</h4>
                  </div>
                  <div className={styles['item-description']}>
                    <p>总消费：12456元</p>
                    <p>可分润：124元</p>
                  </div>
                </div>
              </div>


              <div className={styles['other-select-info']}>
                <div className={styles['checking-status-3']}>
                  已平账
                </div>
                <div className={styles[selectedType == 3 ? 'item-selected' : 'item-no-select']} onClick={() => {
                  this.onChangeSelected(3)
                }}>
                  <div className={styles['item-title']}>
                    机构
                          <h4>12589家</h4>
                  </div>
                  <div className={styles['item-description']}>
                    <p>总消费：12456元</p>
                    <p>可分润：124元</p>
                  </div>
                </div>
              </div>

            </div>

            <div className={styles['area-info-box']}>
              <Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckboxChange}>
                <Checkbox value="A">区域外</Checkbox>
                <Checkbox value="B">区域内</Checkbox>
              </Checkbox.Group>
            </div>
          </div>
          <div>
            <div className={styles['platform-orders']}>平台订单</div>
            <Table
              bordered
              onChange={handleTableChange}
              rowKey='key'
              columns={stdColumns(columnsByUser)}
              dataSource={dataSource}
              pagination={paginationConfig(query, dataSource.length, true, true)}
            />
          </div>
        </div>
      </Page>
    )
  }
}
