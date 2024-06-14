/**
 *@Author:xiongwei
 *@Description:组织资源信息
 *@Date:Created in  2020/6/19
 *@Modified By:
 */
import React from 'react';
import { connect } from 'dva';
import Page from "@/components/Pages/page";
import styles from './OrgResourceInfo.less';
import BulkImport from './components/BulkImport'
import { OrgResourceInfo as namespace, Public } from "@/utils/namespace";
import { Cascader, Input, Table, Select, Button, Popconfirm, message, Form, Modal, Checkbox, Tree, Radio, Drawer, Timeline, Icon, Result, Spin } from 'antd';
import queryString from 'query-string'
import { routerRedux } from "dva/router";
import paginationConfig from "@/utils/pagination";


const { Search } = Input;
const { Option } = Select;
@Form.create({
  mapPropsToFields: state => Form.createFormField(state)
})
@connect(state => ({
  loading: state[namespace].loading,
  findOrganizeInfo: state[namespace].findOrganizeInfo
}))
export default class OrgResourceInfo extends React.Component {
  constructor(props) {
    super(...arguments);
    this.setStatus = this.setStatus.bind(this);
    this.state = {
      modalData: {},
      modalVisible: false,
      drawerSwitch: false,//抽屉开关
      agentInfo: "serve",//默认查看信息serve-服务信息
      cascaderOptions: [],
      bulkImport: false,//批量导入开关
      popSwitch: 0//弹框开关
    }
  }


  handleChange = (Types, value) => {
    console.log(`selected ${value}`, Types);
  };


  /**
   * 控制器，控制modal开关
   * @param state 0:关 1:开
   * @returns {function(...[*]=)}
   */
  controller = (state, record) => {
    //关闭modal重置form
    if (!state) {
      this.setState({ modalVisible: false, fileList: [], modalData: {} });
      this.props.form.resetFields();
      return null
    }
    this.setState({ modalVisible: true, modalData: record || {} });
  };


  /**
   * 列表分页、排序、筛选变化时触发
   * @param page
   */
  handleTableChange = (page) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    query = { ...query, p: page.current, s: page.pageSize };

    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  };
  /**
   * 查看信息
   */
  checkInfo = (record) => {
    this.setState({
      drawerSwitch: true,
      modalData: record || {}
    })
  }
  /**
   * 关掉抽屉
   */
  drawerOnClose = () => {
    this.setState({
      drawerSwitch: false
    })
  }
  /**
    * 确定提交表单
    */
  handleAddOrg = () => {
    const { validateFields, resetFields } = this.props.form;
    const { modalData } = this.state;
    const { dispatch } = this.props;
    validateFields((err, values) => {
      const len = values.areaId.length;
      const areaId = values.areaId[len - 1];
      const studyId = values.studyId;
      const newStudyId = studyId.join(',');
      values.studyId = newStudyId;
      values.areaId = areaId;
      if (err) {
        return;
      }
      // 调修改接口
      if (modalData.id) {
        dispatch({
          type: namespace + '/updateOrganizeInfo',
          payload: { id: modalData.id, ...values },
          callback: () => {
            message.success('修改成功');
            this.findOrganizeInfo();
            resetFields();//重置表单
          }
        })
      }
      //调增加接口
      if (!modalData.id) {
        dispatch({
          type: namespace + '/addOrganizeInfo',
          payload: values,
          callback: () => {
            message.success('添加成功');
            this.findOrganizeInfo();
            resetFields();//重置表单
          }
        })
      }
      resetFields();//重置表单
      this.setState({ modalVisible: false });
    });
  };
  /**
   * 点击数状
   * @param selectedKeys--地方id
   *  @param info--详细信息
   */
  treeOnSelect = (selectedKeys, info) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.p;
    query = { ...query, areaId: selectedKeys };
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  }
  /**
   * 点击数状全部，查询全部
   */
  checkAllArea = () => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.areaId;
    delete query.p;
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  }
  /**
   * 修改类型触发
   * @param types--类型集合
   */
  onTypeSlectionsChangeType = (types) => {
    const type = types.join(",");
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.p;
    query = { ...query, type };
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  }
  //机构选择改变时
  onTypeSlectionsChangeOrganization = (e) => {
    const status = e.join(",");
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.p;
    query = { ...query, status };
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  }
  /**
   * 收索触发
   * @param value--收索值
   */
  onSearch = (value) => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    let query = queryString.parse(search);
    delete query.p;
    query = { ...query, search: value };
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  }
  /**
   * 修改状态触发
   * @param str--类型string
  * @param id--id
  * @param status--状态
   */
  setStatus = (str, id, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: namespace + '/setUpdateOrganizeInfoStatus',
      payload: {
        id,
        status
      },
      callback: () => {
        this.findOrganizeInfo();
        message.success(`${str}成功`)
      }
    })
  }
  //查询列表信息
  findOrganizeInfo = () => {
    const { dispatch, location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    dispatch({
      type: namespace + '/findOrganizeInfo',
      payload: {
        name: query.search || null,
        types: query.type || null,
        states: query.status || null,
        areaId: query.areaId || null,
        page: query.p || 1,
        size: query.s || 10
      },
    })
  }
  //打开上传界面
  setBulkImport = () => {
    this.setState({
      bulkImport: true
    })
  }
  //关闭上传界面
  closeBulkImport = () => {
    this.setState({
      bulkImport: false
    })
  }
  componentDidMount() {
    const { dispatch } = this.props
    //发送请求
    dispatch({
      type: Public + '/getAreaInfoList',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          this.setState({
            cascaderOptions: result,
          })
        }
      }
    })
    this.findOrganizeInfo();
  }
  render() {
    const { modalData, modalVisible, agentInfo, cascaderOptions, bulkImport, popSwitch } = this.state;
    const { location: { search, pathname }, findOrganizeInfo, loading } = this.props;
    const modalDataDetailId = modalData && modalData.detailId ? modalData.detailId.split(',') : [];
    modalDataDetailId && modalDataDetailId.map((value, index) => {
      modalDataDetailId[index] = Number(value);
    })
    const modalDataStudyId = modalData && modalData.studyId ? modalData.studyId.split(',') : [];
    modalDataStudyId && modalDataStudyId.map((value, index) => {
      modalDataStudyId[index] = Number(value);
    })
    const query = queryString.parse(search);
    const { getFieldDecorator } = this.props.form;
    const title = '组织管理-组织机构';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const typeSlections = [
      { label: '公立学校', value: '1' },
      { label: '私立学校', value: '2' },
      { label: '机构', value: '3' },
    ];
    const stateSlections = [
      { label: '待激活', value: '1' },
      { label: '已激活', value: '2' },
      { label: '报备中', value: '3' },
      // { label: '已冻结', value: '4' },
    ];
    //[{key:'111',title:'北京',children:[{key:'555',title:'北区',children:[{key:'ddf',title:'1区'}]},{key:'865',title:'东区'}]}]
    const treeData = JSON.parse(JSON.stringify(cascaderOptions).replace(/id/g, "key").replace(/name/g, "title").replace(/areas/g, "children").replace(/"children":null,/g, ""));//.replace(/"children":null,/g,"")
    const columns = [
      {
        title: '组织全称',
        dataIndex: 'name',
        key: 'names',
        align: 'center'
      },
      {
        title: '组织简称',
        dataIndex: 'shortName',
        align: 'center',
        key: 'shortNames',
      },
      {
        title: '组织类型',
        align: 'center',
        dataIndex: 'typeName',
        key: 'typeNames',
      },
      {
        title: '学段',
        key: 'studyNames',
        align: 'center',
        dataIndex: 'studyName'
      },
      {
        title: '所属区域',
        key: 'detailAddress',
        align: 'center',
        dataIndex: 'detailAddress'
      },
      {
        title: '状态',
        key: 'statusValues',
        align: 'center',
        dataIndex: 'statusValue',
        render: (text, record) => {
          return (
            <div className={styles['operate']}>
              <span>{record.statusValue} </span>
              {
                window.$PowerUtils.judgeButtonAuth(pathname, '设置') ?
                  <Icon type="setting" theme="filled" className={styles['operate-icon']} onClick={() => { this.setState({ popSwitch: record.id }) }} /> : null
              }
              {
                record.id == popSwitch ?
                  <div className={styles['operate-pop']}>
                    <div className={styles['operate-pop-item']} onClick={() => { this.setStatus('激活', record.id, 2) }}><Icon type="fullscreen" /> 激活</div>
                    <div className={styles['operate-pop-item']} onClick={() => { message.warning('功能未开通，敬请期待...') }}><Icon type="lock" theme="filled" /> 冻结</div>
                  </div> : null
              }
            </div>)
        }
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
          return (
            <div className={styles['operate']}>
              {
                window.$PowerUtils.judgeButtonAuth(pathname, '修改') ?
                  <a onClick={() => this.controller(1, record)}>修改</a> : null
              }
              <Popconfirm placement="top" title={'审核'}
                onConfirm={() => {
                  this.setStatus('审核', record.id, record.status);
                }}
                okText="确定"
                cancelText="取消"
              >
                {
                  window.$PowerUtils.judgeButtonAuth(pathname, '审核') ?
                    <a> 审核</a> : null
                }
              </Popconfirm>
              {
                window.$PowerUtils.judgeButtonAuth(pathname, '查看') ?
                  <a onClick={() => this.checkInfo(record)}> 查看</a> : null
              }
            </div>)
        }
      },
    ];
    //表格数据
    let data = findOrganizeInfo ? findOrganizeInfo.data : [];
    const total = findOrganizeInfo ? findOrganizeInfo.total : 0;
    //查看代理商服务&报备信息
    const checkAgentInfo = (e) => {
      console.log('e.target.value', e.target.value)
      this.setState({
        agentInfo: e.target.value
      })
    }
    return (
      <Page header={header} loading={!!loading}>
        <div id={styles['orgResourceInfo']} onClick={() => { popSwitch != 0 && this.setState({ popSwitch: 0 }) }}>
          <div className={styles['header']}>
            <div className={styles['box1']}>
              <span>类型:  </span>
              <Checkbox.Group options={typeSlections} defaultValue={query.type && query.type.split(',') || ['1', '2', '3']} onChange={this.onTypeSlectionsChangeType} />
            </div>
            <div className={styles['box2']}>
              <span>状态:  </span>
              <Checkbox.Group options={stateSlections} defaultValue={query.status && query.status.split(',') || ['1', '2', '3']} onChange={this.onTypeSlectionsChangeOrganization} />
            </div>
            <div className={styles['box3']}>
              <span>名称:  </span>
              <Search
                placeholder="搜索组织名称"
                onSearch={this.onSearch}
                style={{ width: 200 }}
              />
            </div>
            <div className={styles['box4']}>
              {
                window.$PowerUtils.judgeButtonAuth(pathname, '新增') ?
                  <Button onClick={() => this.controller(1)} icon='plus'>新增</Button> : null
              }
              {
                window.$PowerUtils.judgeButtonAuth(pathname, '批量导入') ?
                  <Button icon='copy' onClick={this.setBulkImport}>批量导入</Button> : null
              }
            </div>
          </div>
          <div className={styles['contentTables']}>
            <div className={styles['siderSlect']}>
              <p>按地区查询 <span onClick={this.checkAllArea}>全部</span></p>
              <Tree
                className={styles['siderSlect-tree']}
                blockNode
                selectedKeys={query.areaId ? [query.areaId] : []}
                onSelect={this.treeOnSelect}
                treeData={treeData}//array\<{key, title, children, [disabled, selectable]}></>
              />
              {
                !treeData.length > 0 ? <Spin className={styles['siderSlect-loading']} /> : null
              }
            </div>
            <div className={styles['rightTable']}>
              <Table className={styles['table']} onChange={this.handleTableChange} bordered columns={columns} rowKey={'id'} pagination={paginationConfig(query, total, true, true)} dataSource={data} />
            </div>
          </div>
          {bulkImport ? <BulkImport closeBulkImport={this.closeBulkImport} findOrganizeInfo={this.findOrganizeInfo} /> : null}
          <Drawer
            title={modalData.name}
            width='400'
            headerStyle={{ border: 'none', paddingBottom: 0 }}
            placement="right"
            onClose={this.drawerOnClose}
            visible={this.state.drawerSwitch}
            getContainer={false}
            style={{ position: 'absolute' }}
          >
            <Radio.Group value={agentInfo} onChange={checkAgentInfo} className={styles['drawerBtn']}>
              <Radio.Button value="serve">代理商服务信息</Radio.Button>
              <Radio.Button value="advanceFore">代理商报备信息</Radio.Button>
            </Radio.Group>
            <div className={styles['drawerTimeline']}>
              {/* <Timeline>
                <Timeline.Item>
                  <p>Create a services site 2015-09-01</p>
                  <p>wwwrewrqwe</p>
                  <p>wwwrewrqwe</p>
                </Timeline.Item>
                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                <Timeline.Item dot={<Icon type="minus-circle" style={{ fontSize: '16px' }} />} color="red">
                  Technical testing 2015-09-01
                </Timeline.Item>
                <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
              </Timeline> */}
              <Result
                icon={<Icon type="exception" theme="outlined" />}
                title={`${modalData.name}!`}
                subTitle="暂无代理商信息"
              />
            </div>
          </Drawer>
          <Modal
            title={`${modalData.id ? '编辑组织' : '新增组织'}`}
            visible={modalVisible}
            onOk={this.handleAddOrg}
            onCancel={() => this.controller(0)}
            className={styles['goodsManageModal']}
            width={'50%'}
          >
            <Form>
              <Form.Item {...formItemLayout} label="组织全称">
                {getFieldDecorator('name', {
                  initialValue: modalData.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入组织全称',
                    },
                  ],
                })(<Input placeholder='请输入组织全称' maxLength={20} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="组织简称">
                {getFieldDecorator('shortName', {
                  initialValue: modalData.shortName
                })(<Input placeholder='请输入组织简称' maxLength={30} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="组织类型">
                {getFieldDecorator('type', {
                  initialValue: modalData.type,
                  rules: [
                    {
                      required: true,
                      message: '请选择组织类型',
                    },
                  ],
                })(<Radio.Group>
                  <Radio value={1}>公立学校</Radio>
                  <Radio value={2}>私立学校</Radio>
                  <Radio value={3}>机构</Radio>
                </Radio.Group>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="学段">
                {getFieldDecorator('studyId', {
                  initialValue: modalDataStudyId,
                  rules: [
                    {
                      required: true,
                      message: '请选择组织学段',
                    },
                  ],
                })(<Checkbox.Group >
                  <Checkbox value={1}>小学</Checkbox>
                  <Checkbox value={2}>初中</Checkbox>
                  <Checkbox value={3}>高中</Checkbox>
                </Checkbox.Group>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="所属区域">
                {getFieldDecorator('areaId', {
                  initialValue: modalDataDetailId,//modalData.area,//[520000,520100,520102],//
                  rules: [
                    {
                      required: true,
                      message: '请选择所属区域',
                    },
                  ],
                })(<Cascader options={cascaderOptions} fieldNames={{ label: 'name', value: 'id', children: 'areas' }} placeholder="请选择所属区域" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="详细地址">
                {getFieldDecorator('address', {
                  initialValue: modalData.address,
                  rules: [
                    {
                      required: true,
                      message: '请输入详细地址',
                    },
                  ],
                })(<Input placeholder='请输入详细地址' maxLength={20} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="负责人">
                {getFieldDecorator('adminName', {
                  initialValue: modalData.adminName,
                  rules: [
                    {
                      required: true,
                      message: '请输入负责人',
                    },
                  ],
                })(<Input placeholder='请输入负责人' maxLength={20} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="负责人电话">
                {getFieldDecorator('phone', {
                  initialValue: modalData.phone,
                  rules: [
                    {
                      required: true,
                      message: '请输入负责人电话',
                    },
                    {
                      message: '请输入正确的电话号码',
                      pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                    }
                  ],
                })(<Input placeholder='请输入负责人电话' maxLength={20} type="phone" />)}
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Page>)
  }
}
