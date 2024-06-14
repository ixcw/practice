/**
 * 分销月报
 * @author：xiongwei
 * @reviseTime : 2020年09月03日
 * @version:v1.0.0
 */
import react, { Component } from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Input, Select, Button, Table, TreeSelect, Tag, message, DatePicker, Checkbox, Spin, Result } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SelectInfoBox from './components/selectInfoBox';
import moment from 'moment';
import paginationConfig from '@/utils/pagination';
import Page from "@/components/Pages/page";
import { stdColumns, processDataRetainDigit, getTimestamp } from "@/utils/utils";
import { MonthlyReport as namespace } from '@/utils/namespace';
// import { particularYear } from "@/utils/const";

import styles from './index.less';

// const { Option } = Select;
const { MonthPicker } = DatePicker;

@connect(state => ({
  loading: state[namespace].loading,
  monthlySalesReport: state[namespace].monthlySalesReport,
  monthlyAgentSalesReport: state[namespace].monthlyAgentSalesReport,
  // districtInfo:state[Public].districtInfo
}))

export default class MonthlyReport extends Component {

  constructor(props) {
    super(...arguments);
    this.state = {
      cascaderOptions: [],//省级地区数组
      cityTreeData: [],//市级地区
      countyTreeData: [],//县级地区
      selectedType: 1,//查看代理类型
      indeterminate: true,
      // checkAll: true,
    };
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    //获取所有省份
    dispatch({
      type: namespace + '/findAllProvinceInfo',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          this.setState({
            cascaderOptions: result,
          })
        }
      }
    })
    //获取地区
    dispatch({
      type: namespace + '/findCityByParentId',
      payload: {
        parentId: query.areaId ? query.areaId : 520000
      },
      callback: (result) => {
        if (result && result.length > 0) {
          const citySlections = JSON.parse(JSON.stringify(result).replace(/id/g, "value").replace(/name/g, "title"))
          this.setState({
            cityTreeData: citySlections,
          })
        }
      }
    })
    //获取县
    query.cityId && dispatch({
      type: namespace + '/findDistrictInfo',
      payload: {
        parentId: query.cityId
      },
      callback: (result) => {
        if (result && result.length > 0) {
          const districtInfoWorked = JSON.parse(JSON.stringify(result).replace(/id/g, "value").replace(/name/g, "title"))
          this.setState({
            countyTreeData: districtInfoWorked,
          })
        }
      }
    })
    //刷新后默认选择代理类型
    this.setState({
      selectedType: query.agentAreaId || 1
    })
  }
  //点击收索
  handleSearch = () => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    //获取代理类型信息
    dispatch({
      type: namespace + '/findMonthlySalesReport',
      payload: {
        ym: query.ym ? query.ym : getTimestamp(''),
        areaId: query.countyId ? query.countyId : query.cityId ? query.cityId : query.areaId ? query.areaId : 520000,
        // areaId: query.areaId ? query.areaId : 520000,
        // cityId:query.cityId ? query.cityId : null,
        // countyId:query.countyId ? query.countyId : null,
      },
      callback: (result) => {
        //默认选择第一个类型
        if (result && result.data) {
          query.countyId && this.setState({
            selectedType: query.agentAreaId ? query.agentAreaId : result[0].typeId,
          })
          query.countyId && result && dispatch({
            type: namespace + '/findMonthlyAgentSalesReport',
            payload: {
              ym: query.ym ? query.ym : getTimestamp(''),
              agentAreaId: query.countyId ? query.countyId : null,
              agentId: query.agentAreaId ? query.agentAreaId : result[0].typeId,
              page: query.p || 1,
              size: query.s || 10
            }
          })
        }
      }
    })
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
  /**
* 改变表格
* @param pagination  ：页码  
* @param filters  ：筛选
*/
  handleTableChange = (pagination, filters, sorter) => {
    // console.log('pagination, filters, sorter', pagination, filters, sorter)
    this.replaceSearch({
      p: pagination.current,
      s: pagination.pageSize,
    })
  };
  /**
 * 区域选择
 * @param areaId  ：区域ID
 */
  onChangeArea = areaId => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.cityId;
    delete query.countyId;
    query = { ...query, areaId };
    dispatch(routerRedux.replace({
      pathname,
      search: queryString.stringify(query),
    }));
    this.setState({
      cityTreeData: [],
    })
    //根据areaid获取地区
    if (areaId) {
      dispatch({
        type: namespace + '/findCityByParentId',
        payload: {
          parentId: areaId
        },
        callback: (result) => {
          if (result && result.length > 0) {
            const citySlections = JSON.parse(JSON.stringify(result).replace(/id/g, "value").replace(/name/g, "title"));
            this.setState({
              cityTreeData: citySlections,
            })
          }
        }
      })
    }
  };
  /**
 * 日期选择
 * @param date  ：日期
 * @param dateString  ：日期String
 */
  handleChangeMonth = (date, dateString) => {
    const ym = dateString.replace(/-/g, "")
    this.replaceSearch({ ym })
  }
  /**
 * 地区选择
 * @param areaValues  ：地区id
 */
  onCheckAreaChange = (areaValues) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.countyId;
    dispatch(routerRedux.replace({
      pathname,
      search: queryString.stringify(query),
    }));
    this.replaceSearch({ cityId: areaValues })
    //获取县------------
    areaValues ? dispatch({
      type: namespace + '/findDistrictInfo',
      payload: {
        parentId: areaValues
      },
      callback: (result) => {
        if (result && result.length > 0) {
          const districtInfoWorked = JSON.parse(JSON.stringify(result).replace(/id/g, "value").replace(/name/g, "title"))
          this.setState({
            countyTreeData: districtInfoWorked,
          })
        }
      }
    }) : this.setState({ countyTreeData: [] })
  }
  /**
* 县选择
* @param countyValues  ：县id
*/
  onCheckCountyChange = (countyValues) => {
    this.replaceSearch({ countyId: countyValues })
  }
  /**
* 选择代理类型
* @param type  ：类型
*/
  onChangeSelected = (type) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    this.replaceSearch({ agentAreaId: type })
    this.setState({
      selectedType: type
    })
    //获取列表-----------
    dispatch({
      type: namespace + '/findMonthlyAgentSalesReport',
      payload: {
        ym: query.ym ? query.ym : getTimestamp(''),
        agentAreaId: query.countyId ? query.countyId : null,
        agentId: type,
        page: query.p || 1,
        size: query.s || 10
      }
    })
  }

  // //表格添加点击背景色事件
  // setRowClassName = (record) => {
  //   return record.key === this.state.rowId ? 'clickRowStyl' : '';
  // }
  render() {
    const {
      location,
      loading,
      dispatch,
      monthlySalesReport,
      monthlyAgentSalesReport,
      userInfo = {}
    } = this.props;
    const { search } = location;
    const query = queryString.parse(search);
    const { selectedType, cascaderOptions, cityTreeData, countyTreeData } = this.state;
    const title = '分销月报-' + userInfo.userName;
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const provinceTreeData = JSON.parse(JSON.stringify(cascaderOptions).replace(/id/g, "value").replace(/name/g, "title"));
    let defaultSelect = [];
    query.cityId && query.cityId.split(',').map((value) => {
      defaultSelect.push(Number(value));
    })
    const columns = [//代理商
      {
        title: '代理商名称',
        dataIndex: 'agentUserName',
        key: 'agentUserName',
        align: 'center',
      },
      {
        title: '代理商手机号',
        dataIndex: 'agentPhone',
        key: 'agentPhone',
        align: 'center',
      },
      {
        title: '代理区域',
        dataIndex: 'agentAreaName',
        key: 'agentAreaName',
        align: 'center',
      },
      {
        title: '名下总用户数(人)',
        dataIndex: 'userNum',
        key: 'userNum',
        align: 'center',
        sorter: (a, b) => a.userNum - b.userNum,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '名下总成交(元)',
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        align: 'center',
        sorter: (a, b) => a.totalMoney - b.totalMoney,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '总分润(元)',
        dataIndex: 'shareMoney',
        key: 'shareMoney',
        align: 'center',
      },
    ]
    const sss = [{ id: 1, value: 'hint', title: '请先选择市' }]
    const classString = classNames(styles['monthly-report-content'], 'gougou-content');
    return (
      <Page header={header} loading={!!loading}>
        <div className={styles['monthly-report-layout']}>
          <div className={classString}>
            <div className={styles['header-option']}>
              <div className={styles['search-box']}>
                <div>
                  <label>账期：</label>
                  <MonthPicker
                    placeholder="请选择账期"
                    onChange={this.handleChangeMonth}
                    defaultValue={query.ym ? moment(query.ym, "YYYYMM") : moment(getTimestamp('/'), 'YYYY/MM')}
                    format='YYYY-MM'
                  />
                </div>

                <div>
                  <label>省：</label>
                  <TreeSelect
                    defaultValue={query.areaId ? [query.areaId] : [520000]}
                    style={{ width: '180px' }}
                    placeholder="贵州省"
                    onChange={this.onChangeArea}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={provinceTreeData}
                  />
                </div>
                <div>
                  <label>市：</label>
                  <TreeSelect
                    // treeDataSimpleMode
                    defaultValue={query.cityId ? [query.cityId] : []}
                    style={{ width: '180px' }}
                    placeholder="选择市区"
                    onChange={this.onCheckAreaChange}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={cityTreeData}
                    allowClear//显示清除按钮
                  />
                </div>
                <div>
                  <label>县：</label>
                  <TreeSelect
                    defaultValue={query.countyId ? [query.countyId] : []}
                    style={{ width: '180px' }}
                    placeholder={query.cityId ? "选择县" : '请先选择市'}
                    onChange={this.onCheckCountyChange}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={countyTreeData}
                    allowClear//显示清除按钮
                  />
                </div>
                <div>
                  <Button type="primary" onClick={this.handleSearch} icon={<SearchOutlined />}>搜索</Button>
                </div>
              </div>
              <div className={styles['right']}>
              </div>
            </div>
            <div className={styles['other-select-info-box']}>
              <div className={styles['monthly-report-type-box']}>
                {
                  monthlySalesReport ? monthlySalesReport.map((value, index) => {
                    return (<SelectInfoBox value={value} key={index} selectedType={selectedType} onChangeSelected={this.onChangeSelected} />)
                  }) :
                    <div className={styles['monthly-report-type-box-result']}>
                      <p><ExclamationCircleOutlined />无相关信息，请切换搜索条件</p>
                    </div>
                }
              </div>
              {/* <div className={styles['area-info-box']}>
                {
                  cityOptions && cityOptions.length > 0 ?
                    <div>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={defaultSelect.length == cityOptions.length ? this.state.checkAll : false}
                      >
                        全部
                    </Checkbox>
                      <Checkbox.Group
                        options={cityOptions}
                        value={defaultSelect.length > 0 ? defaultSelect : []}
                        onChange={this.onCheckAreaChange}
                      />
                    </div>
                    : query.areaId ? <Spin style={{ marginLeft: '49%' }} /> : null
                }
              </div> */}
            </div>
            {
              // selectedType == 1 || selectedType == 2 ?
              <div>
                <Table
                  bordered
                  onChange={this.handleTableChange}
                  rowKey='id'
                  columns={stdColumns(columns)}
                  dataSource={monthlyAgentSalesReport && monthlyAgentSalesReport.data ? monthlyAgentSalesReport.data : []}
                  pagination={paginationConfig(query, monthlyAgentSalesReport && monthlyAgentSalesReport.data ? monthlyAgentSalesReport.total : 0, true, true)}
                // onRow={(record)=>{
                //     return {
                //       onClick:(event)=>{
                //         this.setState({rowId:record.key});
                //         this._tableOnclick(event);
                //       }
                //       }
                // }}
                // rowClassName={this.setRowClassName}
                />
              </div>
              // : <Result
              //   className={styles['monthly-report-type-box-result']}
              //   icon={<FolderOpen theme="twoTone"/>}
              //   title="暂无数据"
              //   spin
              // />
              // <div>
              //   <div className={styles['platform-orders']}>平台订单</div>
              //   <Table
              //     bordered
              //     onChange={this.handleTableChange}
              //     rowKey='key'
              //     columns={stdColumns(columnsByUser)}
              //     dataSource={dataSource}
              //     pagination={paginationConfig(query, dataSource.length, true, true)}
              //   />
              //  </div>
            }
          </div>
        </div>
      </Page>
    )
  }
}
