/**
* 录制微课页面
* @author:张江
* @date:2021年08月09日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import { connect } from "dva";
import classNames from 'classnames';
import {
    Input,
    message,
    // Modal,
    Spin
} from 'antd';
import queryString from 'query-string';
// import { routerRedux } from 'dva/router';
import Page from '@/components/Pages/page';
import BackBtns from "@/components/BackBtns/BackBtns";
import TopicContent from "@/components/TopicContent/TopicContent";
import ParametersArea from '@/components/QuestionBank/ParametersArea';//
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import UploadMicroModal from '@/components/QuestionItem/UploadMicroModal';
import { CommissionerSetParam as namespace } from '@/utils/namespace';

import { getIcon, existArr, watermark } from '@/utils/utils';
import styles from './index.less';

// const { confirm } = Modal;
const IconFont = getIcon();

@connect(state => ({
    // questionDetailLoading: state[namespace].questionDetailLoading,//加载中
}))

export default class LinkCard extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
           
        };
    };

    UNSAFE_componentWillMount() {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
    }

    componentDidMount() {
        // watermark({ "watermark_txt": "" });//设置水印
    }

    render() {
        const {
            location,
            dispatch,
            loading,

        } = this.props;
        const title = '链接卡';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const classString = classNames(styles['link-card-content'], 'gougou-content');
        const linkCardList=[
            {
                name: '张三',
                account:'123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
            {
                name: '张三',
                account: '123456'
            },
        ]
        return (
            <Page header={header} loading={false}>
                <div className={classString}>
                    <div className={styles['link-card-title-box']}>
                        <h2>智能笔链接卡</h2>
                        <h3>高三一班</h3>
                        <p>使用智能笔在所在区域内画 “√” ，即可完成绑定</p>
                    </div>
                    <div className={styles['link-card-list']}>
                        {
                            linkCardList.map((item,index)=>{
                                return (<div className={styles['link-card-item']} key={item.account + index}>
                                    {item.name}（{item.account}）
                                </div>)
                            })
                        }
                       
                    </div>
               </div>
            </Page>
        );
    }
}

