/**
 * 个人中心-我的收藏-题目
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { PersonalCenter as namespace } from '@/utils/namespace';
import { existArr } from '@/utils/utils';
import styles from './paperList.less';
import { Pagination, Button, Empty, Spin } from 'antd';
import QuestionGroupItem from "@/pages/Homes/components/QuestionGroupItem";
@connect(state => ({
    listUserQuestionCollect: state[namespace].listUserQuestionCollect,
    myCollectLoading: state[namespace].myCollectLoading,
        paperCollect: state[namespace].paperCollect,
}))
export default class PaperList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
    render() {
        const { listUserQuestionCollect, myCollectLoading, paperCollect={}, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        // const clickCheckSmallClass = () => {
        //     console.log('点击查看微课')
        // }
        // const clickCancelCollect = () => {
        //     console.log('点击取消收藏')
        // }
        const paperCollectList = paperCollect.data||[]
        return (
            <Spin spinning={!myCollectLoading}>
                <div className={styles['paperList']}>
                    <div>
                    {
                        existArr(paperCollectList)&&paperCollectList.map((item) => {
                            item.collectStatus = 1;
                            return (
                                <QuestionGroupItem key={item.id} questionGroupInfo={item} source={1} />
                            )
                        })
                    }
                    </div>
                    {
                        paperCollect && !paperCollect.data ?
                            <Empty description={"暂无数据请添加"}/> : null
                    }
                    <div className={styles['content-pagination']}>
                        <Pagination
                            defaultCurrent={query.p ? query.p : 1}
                            total={paperCollect && paperCollect.total}
                            pageSize={query.s ? query.s : 10}
                            onChange={this.pageChange}
                            style={{ marginTop: '20px' }}
                        />
                    </div>
                </div>
            </Spin>
        )
    }
}