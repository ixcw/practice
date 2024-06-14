import React from 'react';
import {
  Menu,
  Avatar,
  Dropdown,
  Modal,
  notification,
  Button,
  Tooltip,
  message
} from 'antd';
import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import { connect } from "dva";
import { UsergroupAddOutlined, UpOutlined } from '@ant-design/icons';
//引入样式
import './App.less';
import styles from './HeaderMenu.less'

import userInfoCache from '@/caches/userInfo';
import accessTokenCache from '@/caches/accessToken';
import KSelectedParamCache from "@/caches/KSelectedParam";
import { Auth as namespace, HomeIndex, Public } from "@/utils/namespace";
import { getIcon, pushNewPage, urlToList } from "@/utils/utils";
import JoinClassModal from './JoinClassModal';
import PerfectInfo from './PerfectInfo';//完善信息弹窗

import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import isToDesktopCache from "@/caches/isToDesktop";//是否是桌面端记录缓存

TweenOne.plugins.push(Children);


const IconFont = getIcon();
const { confirm } = Modal;


const { SubMenu } = Menu;

@connect(state => ({
  menu: state[namespace].menu,
  userInfo: state[namespace].userInfo,
  myClassInfoList: state[HomeIndex].myClassInfoList,//班级列表
  questionBoardStatistics: state[HomeIndex].questionBoardStatistics,//试题板题目数量统计
}))

export default class HeaderMenu extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      collapsed: false,
      current: undefined,
      visiblePerfectInfo: false,
    };
  }

  componentDidMount() {
    const {
      menu,
      dispatch
    } = this.props;
    const pathname = urlToList(window.location.hash);
    this.getSelectedMenuKeys(menu, pathname);
    const access_token = accessTokenCache();
    let loginUserInfo = userInfoCache() || {};
    if (access_token && (loginUserInfo.code == "TEACHER" || loginUserInfo.code == "STUDENT")) {
      dispatch({
        type: HomeIndex + '/getMyClassInfoList',
        payload: {},
      });
      if (loginUserInfo.code == "TEACHER") {
        dispatch({
          type: HomeIndex + '/getTestQuestionEdition',
          payload: {},
        });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    let { menu } = this.props;
    const { visiblePerfectInfo } = this.state;
    let newMenu = nextProps.menu;
    const pathname = urlToList(window.location.hash);
    // if (JSON.stringify(menu) !== JSON.stringify(newMenu)) {
    this.getSelectedMenuKeys(newMenu, pathname)
    // }

    // 2021年08月24日 邀请注册的学生账号登录-显示完善信息弹窗 start --张江
    const loginUserInfo = userInfoCache() || {};
    const access_token = accessTokenCache();
    // (userInfo.classId && userInfo.gradeId)
    if ((loginUserInfo && loginUserInfo.account && (loginUserInfo.gradeId || loginUserInfo.code != 'STUDENT'))) { } else {
      if (visiblePerfectInfo || !access_token) {
        return;
      }
      this.setState({
        visiblePerfectInfo: true,
      });
    }
    // 2021年08月24日 邀请注册的学生账号登录-显示完善信息弹窗 end --张江
  }

  /**
   * 确认弹框
   */
  showConfirmModal = () => {
    const {
      dispatch,
    } = this.props;
    confirm({
      title: '确认退出登录吗？',
      content: '',
      onOk() {
        notification.success({ message: '退出成功', description: '', duration: 1 });
        dispatch({
          type: namespace + '/logout',
        })
      },
      onCancel() { },
    });
  }

  /**
* 点击切换菜单
* @param e  ：事件对象
*/
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  /**
  * 渲染菜单
  * @param arr ：菜单数组
  * @param pathname ：当前菜单
  */
  getMenu = (arr, pathname) => {
    const isToDesktop = isToDesktopCache();
    const access_token = accessTokenCache();
    return arr && arr.map(it => {
      if (it.childList && it.childList.length > 0) {
        return (
          <SubMenu key={it.id}
            title={
              <span>
                {/* {
                  it.imgUrl ? <IconFont type={it.imgUrl} className={styles['inline-block']} /> : null
                } */}
                {<span>{it.name}</span>}
              </span>
            }>
            {this.getMenu(it.childList, pathname)}
          </SubMenu>
        )
      } else {
        if (it.imgUrl === 'desktop') {//桌面端菜单显示
          if (isToDesktop) {//判断是否是在桌面端打开
            return (
              <Menu.Item key={it.id}>
                <a onClick={() => {
                  window.desktopNewWindow(it.apiUrl, access_token);//执行桌面端方法
                }}><span>{it.name}</span></a>
              </Menu.Item>
            )
          } else {
            return null;
          }
        } else {
          return (
            <Menu.Item key={it.id}>
              {
                pathname.indexOf(it.apiUrl) > -1 ?
                  <a>
                    {/* {
                  it.imgUrl ? <IconFont type={it.imgUrl} /> : null
                } */}
                    <span>{it.name}</span></a> :
                  <Link to={it.apiUrl == '/home' ? '/home' : it.apiUrl}>
                    {/* {
                  it.imgUrl ? <IconFont type={it.imgUrl} /> : null
                } */}
                    <span>{it.name}</span>
                  </Link>
              }
            </Menu.Item>
          )
        }
      }
    });

  };


  /**
  * 筛选选中的菜单
  * @param menu ：菜单数组
  * @param pathname ：当前菜单
  */
  getSelectedMenuKeys = (menu, pathname) => {
    menu && menu.map((item) => {
      if (item.childList && item.childList.length > 0) {
        this.getSelectedMenuKeys(item.childList, pathname)
      } else {
        if ((pathname === '/' && item.apiUrl === '/home') || pathname === '/home' && item.apiUrl === '/home') {
          this.setState({
            current: item.id
          })
        } else if (pathname.indexOf(item.apiUrl) > -1 && pathname != '/') {
          this.setState({
            current: item.id
          })
        }
      }
    })
    // console.log(this.state.current)
  };

  /**
  * 显示加入班级弹窗
  */
  showJoinClassModal = () => {
    this.setState({
      visibleJoinClass: true,
    });
  };

  /**
  * 隐藏加入班级弹窗
  */
  handleJoinClassCancel = e => {
    const {
      dispatch
    } = this.props;
    this.setState({
      visibleJoinClass: false,
    });
    dispatch({
      type: Public + '/saveState',
      payload: {
        selectSubjectList: []
      },
    });
  };

  /**
* 加入班级
* @param command  ：口令
* @param subjectId  ：科目的id
*/
  handleJoinClass = (command, subjectId) => {
    const {
      dispatch
    } = this.props;
    this.handleJoinClassCancel();
    dispatch({
      type: HomeIndex + '/getMyClassInfoList',
      payload: {},
      callback: (result) => {
        if (result && result.length == 1) {
          this.handleSwitchClass(result[0])
        }
      }
    });
  };

  /**
*切换班级
* @param item  ：班级信息
* @param isNew  ：是否新班级
*/
  handleSwitchClass = (item, isNew = false) => {
    const { dispatch } = this.props
    let loginUserInfo = userInfoCache() || {};
    if (item.id == loginUserInfo.classId && item.subjectId == loginUserInfo.subjectId) {
      message.warn('已是当前班级,无需切换')
      return;
    }
    const messageConfig = {//加载切换班级提示加载配置
      key: 'isNew',
      content: isNew ? '已成功加入班级,正在处理,请稍候...' : '正在切换班级,请稍候...',
      duration: 10,
      style: {
        marginTop: '20vh',
      },
    }
    message.loading(messageConfig)
    // 切换班级
    dispatch({
      type: HomeIndex + '/userSwitchClass',
      payload: {
        classId: item.id,
        schoolId: item.schoolId || loginUserInfo.schoolId,
        subjectId: loginUserInfo.code == "TEACHER" ? (item.subjectId || loginUserInfo.subjectId) : undefined,//学生切换班级不传科目
      },
      callback: (result) => {
        userInfoCache.clear();
        this.getSwitchUserInfo(messageConfig)
        // message.loading({
        //   content: isNew ? '已成功加入班级,正在处理,请稍候...' : '正在切换班级,请稍候...',
        //   duration: 1,
        //   style: {
        //     marginTop: '20vh',
        //   },
        //   onClose: () => {
        //     KSelectedParamCache.clear();
        //     loginUserInfo.classId = item.id;
        //     loginUserInfo.className = item.name;
        //     if (loginUserInfo.code == "TEACHER") {
        //       loginUserInfo.subjectId = item.subjectId || loginUserInfo.subjectId
        //       loginUserInfo.subjectName = item.subjectName || loginUserInfo.subjectName
        //     }
        //     loginUserInfo.schoolId = item.schoolId || loginUserInfo.schoolId
        //     loginUserInfo.schoolName = item.schoolName || loginUserInfo.schoolName
        //     userInfoCache(loginUserInfo)
        //     window.location.reload()
        //   }
        // })
      }
    });
  };

  /**
  *获取切换班级后的用户信息
  * @param messageConfig  ：加载配置
  */
  getSwitchUserInfo = (messageConfig) => {
    const { dispatch } = this.props;
    const pathname = urlToList(window.location.hash);
    dispatch({
      type: namespace + '/getSwitchUserInfo',
      payload: {},
      callback: (result) => {
        message.loading({
          ...messageConfig,
          duration: 1,
          onClose: () => {
            KSelectedParamCache.clear();
            if (pathname === '/' || pathname === '/home') {
              window.location.reload()
            } else {
              dispatch(routerRedux.replace('/'));//其他页面 切换班级之后跳转首页
            }
          }
        })
      }
    });
  }


  /**
* 隐藏完善信息弹窗
*/
  handlePerfectInfoCancel = e => {
    const {
      dispatch
    } = this.props;
    this.setState({
      visiblePerfectInfo: false,
    });
    // dispatch({
    //   type: Public + '/saveState',
    //   payload: {
    //     selectSubjectList: []
    //   },
    // });
  };

  /**
* 显示完善信息弹窗
* @param payload  ：待传参数
*/
  handlePerfectInfo = (payload) => {
    const {
      dispatch
    } = this.props;
    this.handlePerfectInfoCancel();
    userInfoCache.clear();
    const messageConfig = {//加载切换班级提示加载配置
      key: 'isNew',
      content: '正在获取完善信息,请稍候...',
      duration: 1,
      style: {
        marginTop: '20vh',
      },
    }
    this.getSwitchUserInfo(messageConfig)
  };

  render() {
    const {
      dispatch,
      userInfo,
      menu,
      collapsed,
      myClassInfoList = [],
      questionBoardStatistics = 0,
    } = this.props;
    const { current, visibleJoinClass, visiblePerfectInfo } = this.state
    const pathname = urlToList(window.location.hash);
    const access_token = accessTokenCache();
    let loginUserInfo = userInfoCache() || {};
    const isToDesktop = isToDesktopCache()
    if (!access_token) {//不存在token时 清除用户信息缓存
      loginUserInfo = {};
      accessTokenCache.clear();
    }
    const toLogin = () => {//跳转登录页
      dispatch(routerRedux.replace({
        pathname: '/login'
      }));
    }
    const textAnimation = {
      Children: {
        value: Number(questionBoardStatistics),
        floatLength: 0
      },
      duration: 1000,
    }
    return (
      //外部（整个头部的导航）包含块
      <div className={styles.wrap}>
        {/*【加入班级弹窗】*/}
        {
          access_token && visibleJoinClass && (loginUserInfo.code == "TEACHER" || loginUserInfo.code == "STUDENT" || loginUserInfo.code == "CLASS_HEAD") ?
            <JoinClassModal
              visibleJoinClass={visibleJoinClass}
              handleJoinClassCancel={this.handleJoinClassCancel}
              handleJoinClass={this.handleJoinClass}
              loginUserInfo={loginUserInfo}
            /> : null
        }
        {/*【完善信息弹窗-学生】*/}
        {
          access_token && visiblePerfectInfo && (loginUserInfo.code == "STUDENT") ?
            <PerfectInfo
              visiblePerfectInfo={visiblePerfectInfo}
              handlePerfectInfoCancel={this.handlePerfectInfoCancel}
              handlePerfectInfo={this.handlePerfectInfo}
              loginUserInfo={loginUserInfo}
            /> : null
        }

        {/*【导航选项卡】*/}
        <div className={styles.switchOper}>
          {
            loginUserInfo && loginUserInfo.account
              && loginUserInfo.schoolId && loginUserInfo.code != "PARENT" ? <Tooltip key='school' className='right-header-button' placement="bottom" title={loginUserInfo.schoolName}>
              <div className={((myClassInfoList[0] && myClassInfoList[0].id) || loginUserInfo.classId) ? styles['school-name'] : ''}>{loginUserInfo.schoolName}</div>
            </Tooltip> : null
          }

          {
            loginUserInfo
              && loginUserInfo.account
              && loginUserInfo.schoolId
              && ((myClassInfoList[0] && myClassInfoList[0].id) || loginUserInfo.classId) ? [
              <div key='class'>
                {
                  loginUserInfo.code == "TEACHER" || loginUserInfo.code == "STUDENT" ?
                      <Dropdown className={styles.userHead} overlayClassName="dropdown-classlist-box" placement="bottomCenter" arrow overlay={
                      loginUserInfo.code == "TEACHER" ?
                        <div className="dropdown-list">
                          {
                            myClassInfoList.map(item => <a key={item.id + '' + item.subjectId} style={{ color: loginUserInfo.classId ? (item.id == loginUserInfo.classId && item.subjectId == loginUserInfo.subjectId ? '#7DD747' : '') : (item.id == myClassInfoList[0].id && item.subjectId == myClassInfoList[0].subjectId ? '#7DD747' : '') }} onClick={() => {
                              this.handleSwitchClass(item, false)
                            }}>{item.name + '-' + item.subjectName}</a>)
                          }
                          <a className={'classAction'} onClick={() => {
                            this.showJoinClassModal();
                          }
                          }> 加入班级</a>
                        </div> :
                        <div className="dropdown-list">
                          {
                            myClassInfoList.map(item => <a key={item.id} style={{
                              color:
                                loginUserInfo.classId ? (item.id == loginUserInfo.classId ? '#7DD747' : '')
                                  : (item.id == myClassInfoList[0].id ? '#7DD747' : '')
                            }} onClick={() => {
                              this.handleSwitchClass(item, false)
                            }}>{item.name}</a>)
                          }
                          <a className={'classAction'} onClick={() => {
                            this.showJoinClassModal();
                          }
                          }> 加入班级</a>
                        </div>
                    }>
                      <span>{loginUserInfo.code == "STUDENT" ?
                        (loginUserInfo.className || myClassInfoList[0].name) : (loginUserInfo.className + '-' + loginUserInfo.subjectName || myClassInfoList[0].name + '-' + myClassInfoList[0].subjectName)} <UpOutlined style={{ fontSize: 14, color: '#666' }} /></span>
                    </Dropdown> : loginUserInfo.code == "PARENT" ? <span>{loginUserInfo.userName || ''}</span> :
                      loginUserInfo.code == "STUDENT" ? <span>{loginUserInfo.className}</span> : null
                }

              </div>] : <div>
              {
                access_token && loginUserInfo.code == "PARENT" ? <Button type="primary" className={'classAction'} onClick={() => {
                  // this.showJoinClassModal();
                  message.warn('申请关联正在开发中,敬请期待...')
                }
                } icon={<UsergroupAddOutlined style={{ fontSize: '18px' }} />}>申请关联</Button>
                  : (access_token && (loginUserInfo.code == "TEACHER" || loginUserInfo.code == "STUDENT" || loginUserInfo.code == "CLASS_HEAD") ? <Button type="primary" className={'classAction'} onClick={() => {
                    this.showJoinClassModal();
                  }
                  } icon={<UsergroupAddOutlined style={{ fontSize: '18px' }} />}>加入班级</Button> :
                    (access_token ? null : <Button type="primary" className={'classAction'} onClick={() => {
                      toLogin();
                    }
                    } icon={<UsergroupAddOutlined style={{ fontSize: '18px' }} />}>加入班级</Button>)
                  )
              }
            </div>
          }
        </div>

        <div className={styles.navArea}>
          <Menu
            theme="light"
            mode="horizontal"
            onClick={this.handleClick}
            selectedKeys={[String(current)]}
          >
            {
              menu && menu.length > 0 && this.getMenu(menu, pathname)
            }
          </Menu>
          {
            loginUserInfo.code == "TEACHER" || loginUserInfo.code == 'GG_QUESTIONBANKADMIN' || loginUserInfo.code == 'GG_GUIDETOPICMEMBER' ? [
              <div key='shitiban' className='right-header-button'>
                <Button type="primary" onClick={() => {
                  pushNewPage({}, '/my-question-group/paper-board', dispatch)
                }} icon={<IconFont type={'icon-shitiban'} style={{ fontSize: '14px', }} />}>试题板(<TweenOne
                  animation={textAnimation}
                  style={{ display: 'inline-block' }}
                >
                    0
                  </TweenOne>)</Button>
              </div>,
              // <div style={{ marginLeft: 20 }} key='shangchuan' className='right-header-button'>
              //   <Button type="primary" icon={<IconFont type={'icon-shangchuan'} style={{ fontSize: '14px', }} />}>上传微课</Button>
              // </div>
            ] : null
          }
          {/* {
            (loginUserInfo.code == "TEACHER") && isToDesktop ? [
              <div style={{ marginLeft: 20 }} key='zhibo' className='right-header-button'>
                <Button
                  type="primary"
                  icon={<IconFont type={'icon-zhibo'} style={{ fontSize: '14px', }} />}
                  onClick={() => {
                    window.desktopNewWindow('openLiveBroadcastForTsdWin', access_token)
                  }}
                >实时直播</Button>
              </div>,
              <div style={{ marginLeft: 20 }} key='other' className='right-header-button'>
                <Button
                  type="primary"
                  icon={<IconFont type={'icon-zhibo'} style={{ fontSize: '14px', }} />}
                  onClick={() => {
                    window.desktopNewWindow('openLiveBroadcastForTsdWin',access_token);
                  }}
                >其他</Button>
              </div>
            ]
              : null
          } */}
        </div>
      </div>
    )
  }
}
