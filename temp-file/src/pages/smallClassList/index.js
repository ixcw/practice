/**
* 微课
* @author:熊伟
* @date:2021年11月4日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
// import PropTypes from 'prop-types';
// import { existArr } from "@/utils/utils";
import { SmallClassList as namespace } from '@/utils/namespace';
import styles from './index.less';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import BackBtns from "@/components/BackBtns/BackBtns";
import MicroItemVideo from "@/components/MicroItemVideo/MicroItem";
import { Select, Pagination, Empty, Spin } from 'antd';
import userInfo from '@/caches/userInfo'
const { Option } = Select;
// const IconFont = getIcon();

@connect(state => ({
    getSubjectList: state[namespace].getSubjectList,//科目
    findRelatedCourse: state[namespace].findRelatedCourseList,//热门微课列表
    loading: state[namespace].loading,//加载中
}))
export default class SmallClassList extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {

        };
    };

    static propTypes = {

    };

    // UNSAFE_componentWillMount() {}

    componentDidMount() {
        const { dispatch, location, pathname } = this.props;
        this.getHotVideoList();
        //科目
        dispatch({
            type: namespace + '/getSubjectList',
            payload: {
            }
        })
    }
    //切换科目
    subjectIdChange = (value) => {
        const { dispatch, location, pathname } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify({ ...query, subjectId: value })
        }));

    }
    //点击切换页码
    pageChange = (page, pageSize) => {
        const { dispatch, location, pathname } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        dispatch(routerRedux.push({
            pathname,
            search: queryString.stringify({ ...query, p: page, s: pageSize })
        }));
    }
    /**
* 热门微课列表
*/
    getHotVideoList() {
        const { dispatch } = this.props;
    }

    render() {
        const {
            location,
            getSubjectList = [],
            findRelatedCourse = {},
            loading
        } = this.props;
        const { pathname, search } = location;
        const query = queryString.parse(search);
        const getSubjectLists = [{ id: -1, name: '全部' }, ...getSubjectList];
        const findRelatedCourseList = findRelatedCourse.data ? findRelatedCourse.data : []
        // if (findRelatedCourseList && findRelatedCourseList.length > 0) {//没有热门视频时 则不展示
        const userInfoS = userInfo()
        return (
            <Spin tip="加载中..." spinning={!!loading}>
                <div className={styles['popular-micro']}>
                    {/* <ModuleTitle title={'热门微课'} seeMoreUrl={'/looking-forward'} /> */}
                    <div className={styles['title']}>
                        <h1>其他课程</h1>
                        {userInfoS.code == 'TEACHER' ? '' :
                            <div>
                                <Select value={query.subjectId ? Number(query.subjectId) : -1} style={{ width: 120 }} bordered={false} onChange={this.subjectIdChange}>
                                    {getSubjectLists.map((item, index) => <Option value={item.id} key={index}>{item.name}</Option>)}
                                </Select>
                            </div>}
                    </div>
                    <div className={styles['micro-list']}>
                        {
                            findRelatedCourseList && findRelatedCourseList.length > 0 ? findRelatedCourseList.map(item => {
                                return (
                                    <MicroItemVideo key={item.id} stylesClassName={'item-4'} location={location} mItem={item} />
                                )
                            }) :
                                <div  className={styles['Empty']}>
                                    <Empty description={"空"} />
                                </div>
                        }
                    </div>
                    <Pagination
                        defaultCurrent={query.p ? query.p : 1}
                        total={findRelatedCourse && findRelatedCourse.total}
                        pageSize={8}
                        onChange={this.pageChange}
                        style={{ marginTop: '20px' }}
                    />
                    <BackBtns tipText={"返回"} isBack={true} />
                </div>
            </Spin>
        );
        // } else {
        //     return null;
        // }

    }
}