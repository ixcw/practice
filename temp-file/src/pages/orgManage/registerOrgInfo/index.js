/**
 *@Author:ChaiLong
 *@Description:在册组织信息
 *@Date:Created in  2020/3/9
 *@Modified By:
 */
import React from 'react';
import {connect} from 'dva';
import Page from "@/components/Pages/page";
import styles from './registerOrgInfo.less';
import {Cascader,Form,Modal,Timeline,Tabs,Drawer,Input, Table, Select, Button} from 'antd';
import queryString from 'query-string'
import {routerRedux} from "dva/router";
import paginationConfig from "@/utils/pagination";
import {orgManage as namespace} from "@/utils/namespace";
import loginInfo from "@/caches/loginInfo";

const { TabPane } = Tabs;
const {Search} = Input;
const {Option} = Select;
@connect(state => ({

}))
@Form.create({
  mapPropsToFields: state => Form.createFormField(state)
})
export default class RegisterOrgInfo extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      visibleDrawer:false,
      modalData: {},
      modalVisible: false,
    }
  }


  handleChange = (Types, value) => {
    console.log(`selected ${value}`, Types);
  };


  /**
   * 列表分页、排序、筛选变化时触发
   * @param page
   */
  handleTableChange = (page) => {
    const {dispatch, location} = this.props;
    const {search, pathname} = location;
    let query = queryString.parse(search);
    query = {...query, p: page.current};
    //修改地址栏最新的请求参数
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify(query),
    }));
  };

  /**
   * 打开抽屉
   */
  showDrawer = () => {
    this.setState({
      visibleDrawer: true,
    });
  };
  /**
   * 关闭抽屉
   */
  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  /**
   * 控制器，控制modal开关
   * @param state 0:关 1:开
   * @returns {function(...[*]=)}
   */
  controller = (state, record) => {
    //关闭modal重置form
    if (!state) {
      this.setState({modalVisible: false, fileList: [],modalData:{}});
      this.props.form.resetFields();
      return null
    }
    this.setState({modalVisible: true,modalData: record || {}});
  };

  render() {
    const title = '组织资源信息-组织管理';
    const breadcrumb = [title];
    const {location: {search, pathname}} = this.props;
    const {modalData,modalVisible}=this.state;
    const query = queryString.parse(search);
    const {getFieldDecorator} = this.props.form;
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title}/>
    );

    const options = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ];


    const columns = [
      {
        title: '组织全称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '组织简称',
        dataIndex: 'abbreviation',
        align: 'center',
        key: 'abbreviation',
      },
      {
        title: '组织类型',
        align: 'center',
        dataIndex: 'orgType',
        key: 'orgType',
        render:(text)=>{
          const typeName=['公立学校','私立学校','培训机构'];
        return(
          <span>{typeName[parseInt(text,10)]}</span>
        )
        }
      }
      ,
      {
        title: '学段',
        key: 'highLevel',
        align: 'center',
        dataIndex: 'highLevel'
      },
      {
        title: '所属区域',
        key: 'area',
        align: 'center',
        dataIndex: 'area'
      },
      {
        title: '详细地址',
        key: 'site',
        align: 'center',
        dataIndex: 'site'
      },
      {
        title: '状态',
        key: 'state',
        align: 'center',
        dataIndex: 'state',
        render:(text)=>{
          const stateName=['已激活','已冻结','报备中','报备结束'];
          return(<span>{stateName[parseInt(text,10)]}</span>)
        }
      },
      {
        title: '是否付费',
        key: 'payState',
        align: 'center',
        dataIndex: 'payState',
        render:(text)=>{
          return(
            <div  className={styles['payState']}>
              <i style={{background:`${text==='1'?'#24e648':'red'}`}}/>{text==='1'?'是':'否'}
            </div>
          )
        }
      },
      {
        title: '当前版本',
        key: 'versions',
        align: 'center',
        dataIndex: 'versions',
        render:(text)=><span>{text==='1'?'基础版':'高级版'}</span>
      },
      {
        title: '来源',
        key: 'source',
        align: 'center',
        dataIndex: 'source',
        render:(text)=>{
          return(
            <div>
                {text==='1' ? <a onClick={this.showDrawer}>代理商</a>:<span>后台</span>}
            </div>
          )
        }
      },
      {
        title: '操作',
        align: 'center',
        render:(text,record)=> <a onClick={()=>this.controller(1,record)}>修改</a>
      },
    ];
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    const data = [
      {
        key: '1',
        id:'1',
        name: 'John Brown',
        age: 32,
        highLevel:'小学，初中，高中',
        abbreviation:'简称',
        payState:'1',
        orgType:'1',
        state:'2',
        area:'贵阳',
        site:'大学城',
        versions:'3',
        principal:'张涛',
        source:'2',
        telephone:'13928478598',
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        id:'2',
        name: 'John Brown',
        age: 32,
        highLevel:'小学，初中，高中',
        abbreviation:'简称',
        payState:'1',
        orgType:'1',
        state:'2',
        area:'贵阳',
        site:'大学城',
        versions:'2',
        principal:'张涛',
        source:'1',
        telephone:'13928478598',
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },  {
        key: '3',
        id:'3',
        name: 'John Brown',
        age: 32,
        highLevel:'小学，初中，高中',
        abbreviation:'简称',
        payState:'1',
        orgType:'2',
        state:'2',
        area:'贵阳',
        site:'大学城',
        versions:'1',
        principal:'张涛',
        source:'2',
        telephone:'13928478598',
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },  {
        key: '4',
        id:'4',
        name: 'John Brown',
        age: 32,
        highLevel:'小学，初中，高中',
        abbreviation:'简称',
        payState:'2',
        orgType:'1',
        state:'2',
        area:'贵阳',
        site:'大学城',
        versions:'2',
        principal:'张涛',
        source:'2',
        telephone:'13928478598',
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
    ];




    return (<Page header={header} loading={false}>
      <div id={styles['registerOrgInfo']}>
        <div className={styles['headerFilter']}>
          <div className={styles['filterTop']}>
            <div className={styles['box']}>
              <span>名称</span>
              <Search
                placeholder="搜索产品名称"
                onSearch={value => console.log(value)}
                style={{width: 200}}
              />
            </div>
            <div className={styles['box']}>
              <span>状态</span>
              <Select defaultValue={query.state?query.state:'1'} style={{width: 120}}
                      onChange={(value) => this.handleChange('state', value)}>
                <Option value="1">全部</Option>
                <Option value="2">待激活</Option>
                <Option value="3">已激活</Option>
                <Option value="4">已冻结</Option>
                <Option value="5">已解冻</Option>
                <Option value="6">报备中</Option>
                <Option value="7">报备结束</Option>
              </Select>
            </div>
            <div className={styles['box']}>
              <span>地区</span>
              <Select placeholder='省/市' defaultValue={query.province} style={{width: 120}}
                      onChange={(value) => this.handleChange('province', value)}>
                <Option value="1">全部</Option>
                <Option value="2">学校</Option>
                <Option value="3">培训机构</Option>
              </Select>
              <Select placeholder='区/县' defaultValue={query.county} style={{width: 120, paddingLeft: '5px'}}
                      onChange={(value) => this.handleChange('county', value)}>
                <Option value="1">全部</Option>
                <Option value="2">学校</Option>
                <Option value="3">培训机构</Option>
              </Select>
            </div>
          </div>
          <div className={styles['filterBottom']}>
            <div className={styles['btnBox']}>
              <Button type='primary' onClick={()=>this.controller(1)}>新增</Button>
            </div>
          </div>
        </div>
        <div className={styles['footerTable']}>
          <Table className={styles['table']} onChange={this.handleTableChange} bordered columns={columns} pagination={paginationConfig(query, 100)} dataSource={data} />
        </div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          width={450}
          visible={this.state.visibleDrawer}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="代理服务信息" key="1">
            <div>
              <Timeline>
                <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
              </Timeline>
            </div>
            </TabPane>
            <TabPane tab="代理报备信息" key="2">
              <Timeline>
                <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="red">Solve initial network problems 2015-09-01</Timeline.Item>
                <Timeline.Item color="red">Technical testing 2015-09-01</Timeline.Item>
                <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
              </Timeline>
            </TabPane>
          </Tabs>
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
            <Form.Item {...formItemLayout} label="所属区域">
              {getFieldDecorator('area', {
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请选择所属区域',
                  },
                ],
              })(
                <Cascader options={options}  placeholder="请选择所属区域" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学校">
              {getFieldDecorator('school', {
                initialValue:modalData.school,
                rules: [
                  {
                    required: true,
                    message: '请输入详细地址',
                  },
                ],
              })(<Input  placeholder='请输入详细地址' maxLength={20}/>)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Page>)
  }
}
