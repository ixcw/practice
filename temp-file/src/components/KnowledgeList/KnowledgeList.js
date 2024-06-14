/**
 * 左边知识点选择列表
 * @author:张江
 * @date:2020年08月21日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from "dva";
import {
  Carousel,
  Tree,
  Pagination,
  Empty,
  Tooltip,
  Spin
} from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { HomeIndex as namespace, Public, CommissionerSetParam } from '@/utils/namespace';
import { getIcon, existArr } from "@/utils/utils";
import KSelectedParamCache from "@/caches/KSelectedParam";
import userInfoCache from '@/caches/userInfo';

import styles from './KnowledgeList.less';

const { TreeNode } = Tree;
const IconFont = getIcon();

@connect(state => ({
  studyList: state[Public].studyList,//学段
  subjectList: state[Public].subjectList,//科目列表
  versionList: state[Public].versionList,//版本列表
  knowledgeList: state[namespace].knowledgeList,//知识点列表
  knowledgeLoading: state[namespace].knowledgeLoading,//知识点加载中
  studySubjectName: state[CommissionerSetParam].studySubjectName,//学段科目拼接名称
}))

export default class KnowledgeList extends React.Component {
  static propTypes = {
    isMultiple: PropTypes.bool,//是否多选
    getSelectedParam: PropTypes.func,//过滤条件筛选方法 获取选择的参数
    type: PropTypes.number,//0默认样式，1布置任务

    comePage: PropTypes.string,//来至那个页面
    heightObject: PropTypes.object,//指定高度
  };


  constructor() {
    super(...arguments);
    let paramInfo = KSelectedParamCache() || {};
    this.state = {
      tabActiveKey: this.props.type ? 2 : paramInfo.queryType || 1,
      isScreen: false,

      tabPeriodActiveKey: '',//学段
      tabSubjectActiveKey: '',//科目
      tabVersionActiveKey: '',//教材版本
      tabTextbookActiveKey: '',//教材
      textbookList: [],
      selectedParamInfo: {},

      treeSelectedKeys: [],
    };
  }

  componentDidMount() {
    const { onRef, comePage, location, knowledgeList } = this.props;
    if (onRef && typeof onRef == 'function') {
      onRef(this)
    }
    if (comePage == 'setParam') {//来至专员设参页面 
      const { search } = location;
      const query = queryString.parse(search) || {};
      if (query.knowledgeId && knowledgeList && knowledgeList.length > 0) {
        this.setState({
          treeSelectedKeys: [Number(query.knowledgeId)]
        })
        return;
      }
      // const userInfo = userInfoCache() || {};
      this.getSetParamTreeKnowledgeList();
    } else {
      this.getStudyList();
    }
  }

  onTabChange = (key) => {
    const { dispatch } = this.props
    const { tabSubjectActiveKey, tabPeriodActiveKey, tabTextbookActiveKey } = this.state
    dispatch({
      type: namespace + '/saveState',
      payload: {
        knowledgeList: undefined,
        versionList: []
      },
    });
    this.setState({
      tabActiveKey: key,
      tabVersionActiveKey: '',//教材版本
      tabTextbookActiveKey: '',//教材
      textbookList: []
    }, () => {
      if (key == 2) {
        // if (tabTextbookActiveKey) {
        //   this.getIndexListTreeKnowledge(key, tabPeriodActiveKey, tabSubjectActiveKey, tabTextbookActiveKey)
        // } else {
        this.getVersionList(tabSubjectActiveKey)
        // }
      } else {
        this.getIndexListTreeKnowledge(1, tabPeriodActiveKey, tabSubjectActiveKey)
      }
    })

  }

  /**
   * 学段选择
   * @param isScreen  ：是否显示
   */
  onScreenChange = (isScreen) => {
    this.setState({
      isScreen,
    })
  }

  /**
   * 学段选择
   * @param key  ：学段id
   */
  onPeriodButtonChange = (key) => {
    KSelectedParamCache.clear();
    this.getSubjectList(key, 1)
  }

  /**
   * 科目选择
   * @param key  ：科目id
   */
  onSubjectButtonChange = (key) => {
    const { tabActiveKey = 1, tabPeriodActiveKey } = this.state;
    KSelectedParamCache.clear();
    this.setState({
      textbookList: []
    })
    if (tabActiveKey == 1) {
      this.getIndexListTreeKnowledge(tabActiveKey, tabPeriodActiveKey, key)
    } else {
      this.getVersionList(key);
    }
  }

  /**
   * 版本版选择
   * @param key  ：版本id
   * @param item  ：单个数据
   */
  onVersionButtonChange = (key, item = {}) => {
    this.setState({
      tabVersionActiveKey: key,
      textbookList: item.childList,
    })

    // 解决教材默认选择的问题 20220310 start
    const { tabActiveKey = 1, tabPeriodActiveKey, tabSubjectActiveKey } = this.state
    const tabTextbookActiveKey = item?.childList[0] ? item?.childList[0].id : ''
    this.setState({
      tabTextbookActiveKey
    })
    if (tabActiveKey == 2) {
      this.getIndexListTreeKnowledge(tabActiveKey, tabPeriodActiveKey, tabSubjectActiveKey, tabTextbookActiveKey)
    }
    // 解决教材默认选择的问题 20220310 end
  }


  /**
   * 教材选择
   * @param key  ：教材id
   */
  onTextbookButtonChange = (key) => {
    const { tabActiveKey = 1, tabPeriodActiveKey, tabSubjectActiveKey } = this.state
    this.setState({
      tabTextbookActiveKey: key
    })
    if (tabActiveKey == 2) {
      this.getIndexListTreeKnowledge(tabActiveKey, tabPeriodActiveKey, tabSubjectActiveKey, key)
    }
  }

  /**
   * 选段列表
   * @param key  ：教材id
   */
  getStudyList() {
    const { dispatch } = this.props;
    dispatch({
      type: Public + '/getStudyList',
      callback: (result) => {
        if (result && result.length > 0) {
          const selectedParamInfo = KSelectedParamCache() || {};
          const userInfo = userInfoCache() || {};
          this.setState({
            tabSubjectActiveKey: selectedParamInfo.subjectId || userInfo.subjectId
          }, () => {
            this.getSubjectList(selectedParamInfo.studyId || userInfo.studyId || result[0].id)
          }
          )

        }
      }
    });
  }

  /**
   * 科目列表
   * @param studyId  ：学段id
   * @param type  ：是否首次加载 1表示不是
   */
  getSubjectList(studyId, type) {
    const { dispatch } = this.props;
    const { tabActiveKey = 1 } = this.state
    this.setState({
      tabPeriodActiveKey: studyId,
    })
    dispatch({
      type: Public + '/getStudyOrVersionList',
      payload: {
        queryType: 1,
        studyId,
      },
      callback: (result) => {
        if (type == 1) {
          return;
        }
        if (result && result.length > 0) {
          const selectedParamInfo = KSelectedParamCache() || {};
          const userInfo = userInfoCache() || {};
          const subjectId = selectedParamInfo.subjectId || userInfo.subjectId || (result[1] && result[1].id ? result[1].id : result[0].id);
          const tempTabActiveKey = tabActiveKey;
          this.setState({
            tabActiveKey: tempTabActiveKey,
          })
          if (tempTabActiveKey == 2) {
            this.getVersionList(subjectId);
          } else {
            this.setState({
              tabSubjectActiveKey: subjectId,
            })
            this.getIndexListTreeKnowledge(tempTabActiveKey, studyId, subjectId)
          }
        }
      }
    });
  }

  /**
   * 版本列表
   * @param subjectId  ：科目id
   */
  getVersionList(subjectId) {
    const { dispatch } = this.props;
    const { tabActiveKey = 1, tabPeriodActiveKey, tabSubjectActiveKey } = this.state
    this.setState({
      tabSubjectActiveKey: subjectId,
    })
    dispatch({
      type: Public + '/getVersionList',
      payload: {
        queryType: 2,
        subjectId,
      },
      callback: (result) => {
        if (result && result.length > 0) {
          let item = result[0];
          const selectedParamInfo = KSelectedParamCache() || {};
          if (tabActiveKey == 2 && item) {
            if (!selectedParamInfo.versionId) {
              // this.setState({
              //   tabVersionActiveKey: item.id,
              //   textbookList: item.childList,
              // })
              this.onVersionButtonChange(item.id, item);//解决教材默认选择的问题 20220310
            } else {
              for (const vItem of result) {//计算获取已选中的值
                if (vItem.id == selectedParamInfo.versionId) {
                  this.setState({
                    tabVersionActiveKey: vItem.id,
                    textbookList: vItem.childList,
                  })
                  for (const TBItem of vItem.childList) {
                    if (TBItem.id == selectedParamInfo.textbookId) {
                      this.setState({
                        tabTextbookActiveKey: TBItem.id,
                      })
                      this.getIndexListTreeKnowledge(tabActiveKey, tabPeriodActiveKey, tabSubjectActiveKey, TBItem.id)
                      break;
                    }
                  }
                  break;
                }
              }
            }

            // if (item.childList && item.childList.length > 0) {
            //     const version = item.childList[0].id;
            //     this.setState({
            //         tabTextbookActiveKey: version,
            //     })
            //     this.getIndexListTreeKnowledge(tabActiveKey, tabPeriodActiveKey, tabSubjectActiveKey, version)
            // }

          }
        } else {
          this.setState({
            tabVersionActiveKey: '',
            textbookList: [],
          })
          dispatch({
            type: namespace + '/saveState',
            payload: {
              knowledgeList: undefined,
            },
          });
        }
      }
    });
  }

  /**
   * 知识点列表
   * @param queryType  ：  查询类型（1：章节知识点，2：版本知识点）
   * @param studyId  ：学段id（当queryType等于1时，此项不能为空）
   * @param subjectId  ：科目id（当queryType等于1时，此项不能为空）
   * @param version  ：版本id（当queryType等于2时，此项不能为空）
   */
  getIndexListTreeKnowledge(queryType, studyId, subjectId, version) {
    const { dispatch, getSelectedParam, isMultiple, type } = this.props;
    const { tabVersionActiveKey } = this.state;
    this.setState({
      isScreen: false,
      tabSubjectActiveKey: subjectId
    })
    let paramInfo = KSelectedParamCache() || {};
    paramInfo.queryType = queryType;//查询类型
    paramInfo.studyId = studyId;//学段
    paramInfo.subjectId = subjectId;//科目
    if (queryType == 2) {
      paramInfo.versionId = tabVersionActiveKey//版本id
      paramInfo.textbookId = version;//教材id
    }
    KSelectedParamCache(paramInfo);//存储已选择的参数
    dispatch({
      type: namespace + '/saveState',
      payload: {
        knowledgeList: undefined,
        knowledgeLoading: false,
      },
    });
    dispatch({
      type: namespace + '/getIndexListTreeKnowledge',
      payload: {
        queryType,
        studyId,
        subjectId,
        version
      },
      callback: (result) => {
        let selectInfo = {
          knowledgeId: isMultiple ? [] : '',
          subjectId: subjectId,
          queryType,
          type: 0,//刷新切换加载
          studyId: studyId,
          isMultiple
        }
        if (result && result.length > 0) {
          let knowledgeId = result[0] ? result[0].id : '';
          if (knowledgeId) {
            this.setState({
              treeSelectedKeys: [knowledgeId]
            })
            selectInfo.knowledgeId = isMultiple ? [knowledgeId] : knowledgeId;
            selectInfo.checkedNodes = [result[0]];

            // 解决默认不拉出题目的问题 20220310 start
            if (type) {
              selectInfo.node={
                key :knowledgeId,
                name: result[0]?.name,
                checkedNodes: selectInfo.checkedNodes
              };
              getSelectedParam(selectInfo)
              // 解决默认不拉出题目的问题 20220310 end
            } else {
            getSelectedParam(selectInfo)
            }
          }
        } else {//没有知识点数据时 重置models的值
          dispatch({
            type: namespace + '/saveState',
            payload: {
              questionList: undefined,//题目列表
              examPaperList: [],//套题或者套卷列表
              questionVideoList: [],//微课列表
              total: 0,
              questionLoading: true
            },
          });
          getSelectedParam(selectInfo)
        }
      }
    });
  }


  /**
   * 渲染树形结构
   * @param data  ：数据
   */
  renderTreeNodes = data =>
    data && data.map(item => {
      if ((item.child && item.child.length > 0) || (item.childList && item.childList.length > 0)) {
        // return (
        //   <TreeNode title={item.name} key={item.id} dataRef={item}>
        //     {this.renderTreeNodes(item.childList || item.child)}
        //   </TreeNode>
        // );
        return {
          title: item.name,
          key: item.id,
          dataRef: item,
          children: this.renderTreeNodes(item.childList || item.child)
        };

      }
      // return <TreeNode icon={''} key={item.id} title={item.name} dataRef={item} {...item} isLeaf={true} />;
      return {
        title: item.name,
        key: item.id,
        dataRef: item,
        ...item,
        isLeaf: true
      };
    });

  /**
   * 选择知识点
   * @param selectedKeys  ：选中的id
   */
  onTreeSelect = (selectedKeys, info) => {
    if (!selectedKeys || selectedKeys.length < 1) {
      return;
    }
    const { getSelectedParam, isMultiple, type = 0, dispatch } = this.props;
    const { tabActiveKey, tabPeriodActiveKey, tabSubjectActiveKey, tabTextbookActiveKey } = this.state
    this.setState({
      isScreen: false,
      treeSelectedKeys: selectedKeys
    })
    //判断是否为布置作业，是则只触发最里层事件，否则全都响应
      // && !existArr(info.node.children)
    if (type) {
      getSelectedParam(info)
    } else {

      let selectInfo = {
        knowledgeId: isMultiple ? selectedKeys : selectedKeys[0],
        subjectId: tabSubjectActiveKey,
        queryType: tabActiveKey,
        type: 1,//选择知识点加载
        checkedNodes: info,
        studyId: tabPeriodActiveKey,
        isMultiple
      }
      getSelectedParam(selectInfo)
    }
  };

  /**
 * 清空已选的知识点
 */
  clearKnowledge = (treeSelectedKeys) => {
    this.setState({
      treeSelectedKeys: treeSelectedKeys,//知识点当前选中的
    })
  }

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    const { dispatch, comePage } = this.props;
    if (comePage == 'setParam') {
      return;
    }
    dispatch({
      type: namespace + '/saveState',
      payload: {
        knowledgeList: undefined,
        knowledgeLoading: false,
      },
    });
    this.setState = (state, callback) => {
      return;
    };
  }



  /**
 * 专员设参获取 知识点列表  2020年12月03日 添加
 */
  getSetParamTreeKnowledgeList() {
    const { dispatch, getSelectedParam, isMultiple, location } = this.props;
    dispatch({
      type: namespace + '/saveState',
      payload: {
        knowledgeList: undefined,
        knowledgeLoading: false,
      },
    });
    dispatch({
      type: CommissionerSetParam + '/getExpertUserJobKnowList',
      payload: {
        // queryType,
        // studyId,
        // subjectId,
        // version
      },
      callback: (result) => {
        const callbackResult = result ? result : {};
        const KnowList = callbackResult ? callbackResult.KnowList : {};
        dispatch({
          type: namespace + '/saveState',
          payload: {
            knowledgeList: KnowList,
            knowledgeLoading: true,
          },
        });
        let selectInfo = {
          knowledgeId: isMultiple ? [] : '',
          // subjectId: subjectId,
          // queryType,
          type: 0,//刷新切换加载
          // studyId: studyId,
          isMultiple
        }
        if (KnowList && KnowList.length > 0) {
          const { search } = location;
          const query = queryString.parse(search) || {};
          let knowledgeId = query.knowledgeId ? Number(query.knowledgeId) : KnowList[0] ? KnowList[0].id : '';
          if (knowledgeId) {
            this.setState({
              treeSelectedKeys: [knowledgeId]
            })
            selectInfo.subjectId = callbackResult ? callbackResult.subjectId : ''
            selectInfo.knowledgeId = isMultiple ? [knowledgeId] : knowledgeId;
            selectInfo.checkedNodes = [KnowList[0]];
            selectInfo.knowledgeList = KnowList;
            getSelectedParam(selectInfo)
          }
        } else {//没有知识点数据时 重置models的值
          dispatch({
            type: CommissionerSetParam + '/saveState',
            payload: {
              questionList: undefined,//题目列表
              total: 0,
              questionLoading: true
            },
          });
          getSelectedParam(selectInfo)
        }
      }
    });
  }

  render() {
    const {
      location,
      studyList,
      subjectList,
      versionList,
      knowledgeList = [],
      knowledgeLoading = false,
      isMultiple = false,
      type = 0,

      comePage,
      studySubjectName,

      heightObject = {},
    } = this.props;
    const {
      tabActiveKey,
      isScreen,
      tabPeriodActiveKey,
      tabSubjectActiveKey,
      tabVersionActiveKey,
      tabTextbookActiveKey,

      textbookList = [],//版本教材
      treeSelectedKeys = [],
    } = this.state
    const userInfo = userInfoCache() || {};
    return (
      <div className={styles['knowledge-box']} style={{ height: heightObject.warpHeight }}>

        {
          comePage == 'setParam' ? <div className={styles['setParam-title']}>{studySubjectName || '----'}</div> :
            <div className={styles['type-box']}>
              <div className={styles['tab-box']}>
                {type ?
                  ''
                  : <div className={styles[tabActiveKey == 1 ? 'tab-item' : '']} onClick={() => {
                    this.onTabChange(1)
                  }}>
                    <span>综合知识点</span>
                    <div className={styles['line']}></div>
                  </div>
                }
                <div className={styles[tabActiveKey == 2 ? 'tab-item' : '']} onClick={() => {
                  this.onTabChange(2)
                }}>
                  <span>章节知识点</span>
                  <div className={styles['line']}></div>
                </div>
              </div>
              <div className={styles['screen-oper']} onMouseEnter={() => {
                this.onScreenChange(true)
              }} onMouseLeave={() => {
                this.onScreenChange(false)
              }}>
                <div>
                  <Tooltip placement="top" title={tabActiveKey == 1 ? '选择学段与科目' : '选择学段,科目,版本,教材等'}>
                    <IconFont type={'icon-zhishidianshaixuananniu'} style={{ fontSize: 20 }} />
                  </Tooltip>
                </div>
                {
                  isScreen ? <div className={styles['bridge-way']} onMouseEnter={() => {
                    this.onScreenChange(true)
                  }}></div> : null
                }
                {
                  isScreen ? <div style={type == 1 ? { width: '500px' } : {}} onMouseEnter={() => {
                    this.onScreenChange(true)
                  }} className={styles['screen-box']}>
                    <div className={styles['screen-item']}>
                      <h3>选择学段</h3>
                      <div className={styles['button-tab-box']}>
                        {
                          (studyList && studyList.length > 0) && studyList.map(item =>
                            <div key={item.id} className={styles[tabPeriodActiveKey == item.id ? 'active' : '']}
                              style={{ cursor: tabPeriodActiveKey == item.id || !userInfo.studyId ? '' : 'not-allowed' }}//20210409日根据余总需求加-登录用户已确定学段科目的-判断不可选择-展示默认的
                              onClick={() => {
                                if (!userInfo.studyId) {//20210409日根据余总需求加-登录用户已确定学段科目的-判断不可选择-展示默认的
                                  this.onPeriodButtonChange(item.id)
                                }
                              }}>
                              {item.name}
                            </div>
                          )
                        }
                      </div>
                    </div>

                    <div className={styles['screen-item']}>
                      <h3>选择科目</h3>
                      <div className={styles['button-tab-box']}>
                        {
                          (subjectList && subjectList.length > 0) && subjectList.map(item =>
                            <div key={item.id} className={styles[tabSubjectActiveKey == item.id ? 'active' : '']}
                              style={{ cursor: tabSubjectActiveKey == item.id || !userInfo.subjectId ? '' : 'not-allowed' }}//20210409日根据余总需求加-登录用户已确定学段科目的-判断不可选择-展示默认的
                              onClick={() => {
                                if (!userInfo.subjectId) {//20210409日根据余总需求加-登录用户已确定学段科目的-判断不可选择-展示默认的
                                  this.onSubjectButtonChange(item.id)
                                }
                              }}>
                              {item.name}
                            </div>
                          )
                        }
                      </div>
                    </div>

                    {
                      tabActiveKey == 2 ? [<div key={1} className={styles['screen-item']}>
                        <h3>选择版本</h3>
                        {
                          (versionList && versionList.length > 0) ?
                            <div className={styles['button-tab-box']}>
                              {
                                versionList.map(item =>
                                  <div key={item.id} className={styles[tabVersionActiveKey == item.id ? 'active' : '']}
                                    onClick={() => {
                                      this.onVersionButtonChange(item.id, item)
                                    }}>
                                    {item.name}
                                  </div>
                                )
                              }
                            </div> : '当前科目暂无版本'
                        }

                      </div>
                        , <div className={styles['screen-item']} key={2}>
                        <h3>选择教材</h3>
                        {
                          (textbookList && textbookList.length > 0) ?
                            <div className={styles['button-tab-box']}>
                              {
                                textbookList.map(item =>
                                  <div key={item.id} className={styles[tabTextbookActiveKey == item.id ? 'active' : '']}
                                    onClick={() => {
                                      this.onTextbookButtonChange(item.id)
                                    }}>
                                    {item.name}
                                  </div>
                                )
                              }
                            </div> : '当前版本暂无教材信息'
                        }

                      </div>
                      ] : null
                    }
                  </div> : null
                }
              </div>
            </div>

        }
        <div className={styles['tree-box']} style={{ height: heightObject.listHeight }}>
          <Spin tip="加载中..." spinning={!knowledgeLoading}>
            {
              knowledgeList && knowledgeList.length > 0 ?
                <Tree
                  showLine={{ showLeafIcon: false }}
                  // switcherIcon={<IconFont type={'icon-jiantou1'} style={{ color: '#50A1F0', fontSize: 14 }} />}
                  // icon={''}
                  // showIcon={true}
                  blockNode
                  // defaultExpandedKeys={[String(knowledgeList[0].id)]}
                  // defaultSelectedKeys={[String(knowledgeList[0].id)]}
                  defaultExpandedKeys={[knowledgeList[0].id]}
                  defaultSelectedKeys={[knowledgeList[0].id]}
                  selectedKeys={treeSelectedKeys}
                  onSelect={this.onTreeSelect}
                  multiple={isMultiple}
                  treeData={this.renderTreeNodes(knowledgeList)}
                />
                // >
                //   {/* {this.renderTreeNodes(knowledgeList)} */}
                // </Tree> 
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
            }
          </Spin>
        </div>
      </div>

    )
  }
}
