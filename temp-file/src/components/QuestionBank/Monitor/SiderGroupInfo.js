/**
* 侧边栏组员信息列表组件
* @author:张江
* @date:2020年02月10日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "dva";
import { Menu, Icon, Layout, Select, Empty } from 'antd';
import { QuestionBankMonitor as namespace, Public } from '@/utils/namespace';
import { getIcon } from "@/utils/utils";
import styles from './SiderGroupInfo.less';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;
const { Option } = Select;
const IconFont = getIcon();

@connect(state => ({
  groupInfoList: state[namespace].groupInfoList,//组员信息列表
  studyList: state[Public].studyList,//学段列表
  subjectId: ''
}))

export default class SiderGroupInfo extends React.Component {
  static propTypes = {
    getGroupInfoUserIds: PropTypes.func.isRequired,//获取所有组员用户id
    // selectedGroupInfo: PropTypes.func.isRequired,//选择组员操作
  };


  constructor() {
    super(...arguments);
    this.state = {
      studyId: 3,
      subjectIds: null,
      selectedKeys: []
    };
  }

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: Public + '/getStudyInfo',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          let studyId = result[2] ? result[2].id : result[0].id;
          this.setState({
            studyId,
          })
          this.getPeopleGroupInfoList(studyId, true);
        }
      }
    });
  }

  /**
   * 组员信息列表
   * @param studyId  ：学段id
   */
  getPeopleGroupInfoList = (studyId) => {
    const {
      dispatch,
      getGroupInfoUserIds,
    } = this.props;
    this.setState({
      studyId,
    })
    dispatch({
      type: namespace + '/getPeopleGroupInfoList',
      payload: {
        studyId,
      },
      callback: (result) => {
        let subjectIds = result && result[0].subjectId;
        let userIdsArray = [];
        // result && result.map((item) => {
        //   item.list && item.list.map((lItem) => {
        //     userIdsArray.push(String(lItem.userId));
        //   })
        // })
        let tempResult = result && result[0] ? result[0] : {};
        tempResult.list && tempResult.list.map((lItem) => {
          userIdsArray.push(String(lItem.userId));
        })
        // result&&result.map((item)=>{
        //   subjectIdArray.push(String(item.subjectId));
        // })
        // let subjectIds = subjectIdArray.join(",");
        this.setState({
          selectedKeys: userIdsArray,
          subjectIds,
        })
        let userIds = userIdsArray.join(",");
        getGroupInfoUserIds(userIds, studyId, subjectIds)
      }
    });
  }

  /**
* 选择学段
* @param event  ：事件对象
*/
  onSelectChange = (event) => {
    this.getPeopleGroupInfoList(event)
  }

  /**
* 点击选择组员
* @param event  ：组员信息对象
*/
  handleClickSelected = (event) => {
    let userIds = event && event.key ? event.key : ''
    const {
      getGroupInfoUserIds
    } = this.props;
    const { studyId, subjectIds } = this.state;
    this.setState({
      selectedKeys: [userIds],
    })
    getGroupInfoUserIds(userIds, studyId, subjectIds)
  }

  /**
 * 点击组名
 * @param list  ：组员信息列表
 */
  onTitleClick = (list) => {
    const {
      getGroupInfoUserIds,
    } = this.props;
    let { studyId } = this.state;
    let subjectIds = list[0].subjectId;
    let userIdsArray = [];
    list && list.map((lItem) => {
      userIdsArray.push(String(lItem.userId));
    })
    this.setState({
      selectedKeys: userIdsArray,
      subjectIds,
    })
    let userIds = userIdsArray.join(",");
    getGroupInfoUserIds(userIds, studyId, subjectIds)
  }

  render() {
    const {
      studyList,
      groupInfoList,
    } = this.props;
    const { studyId, selectedKeys } = this.state

    return (
      <div className={styles['monitor-sider-menu-box']}>
        <div className={styles['search-box']}>
          <Select
            defaultValue={String(studyId)}
            showSearch
            style={{ width: 160 }}
            placeholder="请选择学段"
            optionFilterProp="children"
            onChange={this.onSelectChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              studyList && studyList.map((item) => {
                return (
                  <Option key={String(item.id)} value={String(item.id)}>{item.name}</Option>
                )

              })
            }
          </Select>

        </div>
        {
          groupInfoList && groupInfoList.length > 0 ?
            <Menu
              onClick={this.handleClickSelected}
              // onOpenChange={(event) => {
              //   console.log('event===', event)
              // }}
              multiple={true}
              style={{ width: 256 }}
              selectedKeys={selectedKeys}
              mode="inline"
            >
              {
                groupInfoList && groupInfoList.map((item, index) => {
                  return (
                    <SubMenu
                      // onTitleClick={() => {
                      //   this.onTitleClick(item.list)
                      // }}
                      key={index + 1}
                      title={
                        <span onClick={() => {
                          this.onTitleClick(item.list)
                        }}>
                          <IconFont type={'icon-subjectId-' + item.subjectId} />
                          <span>{item.groupName}【{item.leaderName}】</span>
                        </span>
                      }
                    >
                      {
                        item.list && item.list.map((sItem) => {
                          return (
                            <Menu.Item key={String(sItem.userId)}><Icon type="user" />{sItem.userName}</Menu.Item>
                          )
                        })
                      }
                    </SubMenu>
                  )
                })
              }
            </Menu> :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无分组信息" style={{ marginTop: 60 }} />
        }
      </div>
    )
  }
}

