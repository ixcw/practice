/**
 * 个人中心-我的收藏
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { PersonalCenter as namespace, Public } from '@/utils/namespace';
import styles from './index.less';
import QuestionList from './questionList.js';
import PaperList from './paperList.js';
import SmallClass from './smallClass.js';
import { Menu, Spin, Cascader } from 'antd';
@connect(state => ({
    myCollectLoading: state[namespace].myCollectLoading,
    StudyAndSubjectsList: state[Public].StudyAndSubjectsList,
}))
export default class MyCollect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // checkType:'1',//默认查看类型
        }
    }
    //点击查看类型
    onClickCheckType = (e) => {
        const { dispatch, location, pathname } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch(routerRedux.replace({ pathname, search: queryString.stringify({ personalCenterItem: query.personalCenterItem, myCollect: e.key }) }));
        // console.log(e.key)
        // this.setState({
        //     checkType:e.key
        // })
    }
    UNSAFE_componentWillMount() {
        const { dispatch, location, pathname } = this.props;
        const { search } = location;
        dispatch({
            type: Public + '/getStudyAndSubjectsList',
            payload: {}
        })
    }
    render() {
        const { location, userInfo = {}, pathname, dispatch, videoCollect, myCollectLoading, StudyAndSubjectsList } = this.props;
        const { search } = location;
        let query = queryString.parse(search);
        //设置默认查看item
        const checkType = query.myCollect ? query.myCollect : 1;
        //学段科目改变
        const StudyAndSubjectOnChange = (e) => {
            e && dispatch(routerRedux.push({
                pathname,
                search: queryString.stringify({ ...query, studyId: e[0], subjectId: e[1] })
            }));
        }
        return (
            <div className={styles['myCollect']}>
                <div className={styles['myCollect-head']}>
                    <Menu onClick={this.onClickCheckType} defaultSelectedKeys={[checkType]} mode="horizontal">
                        <Menu.Item key={1}>
                            题目
                        </Menu.Item>
                        {/* <Menu.Item key={2}>
                            套题
                        </Menu.Item>*/}
                        <Menu.Item key={3}>
                            试卷
                        </Menu.Item>
                        <Menu.Item key={4}>
                            微课
                        </Menu.Item>
                    </Menu>
                    <Cascader
                        placeholder="请选择学段科目"
                        fieldNames={{ label: 'name', value: 'id', children: 'subSubjects' }}
                        options={StudyAndSubjectsList}
                        onChange={StudyAndSubjectOnChange}
                        value={query.studyId && query.subjectId ? [Number(query.studyId), Number(query.subjectId)] : []}
                        style={{ marginRight: '50px' }}
                    />
                </div>
                <div className={styles['myCollect-content']}>
                    {
                        checkType == 1 ?
                            <div>
                                <QuestionList userInfo={userInfo} location={location} />
                            </div>
                            :
                            (checkType == 2 || checkType == 3) ?
                                <div>
                                    <PaperList location={location} />
                                </div> :
                            checkType == 4 ?
                                <div>
                                    <Spin spinning={!myCollectLoading}>
                                        <SmallClass type={2} location={location} />
                                    </Spin>
                                </div> :
                                null
                    }
                </div>
            </div>
        )
    }
}
