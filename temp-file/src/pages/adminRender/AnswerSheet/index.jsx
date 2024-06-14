/**
* 答题卡页面
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

export default class AnswerSheet extends React.Component {
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
        const title = '答题卡';
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const classString = classNames(styles['answer-sheet-content'], 'gougou-content');
        const objectiveList=[
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
        const subjectiveList = [
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
                    <div className={styles['answer-sheet-title-box']}>
                        <h2>答题卡</h2>
                        <p>请把答案或分数填写在指定的区域内，否则视为无效</p>
                        <div className={styles['oper-box']}>
                            <div>
                                作答完成
                                <div className={styles['oper-select']}></div>
                            </div>
                            <div>
                                作答完成
                                <div className={styles['oper-select']}></div>
                            </div>
                            <p><span className={styles['oper-star']}></span>作答或批改完成后，请在相应区域内划 “√” ，请谨慎勾选</p>
                        </div>
                    </div>
                    <h4>一，客观题</h4>
                    <div className={styles['objective-list']}>
                        {
                            objectiveList.map((item,index)=>{
                                return (<div className={styles['objective-item']} key={item.account + index}>
                                    <span>{index + 1}、</span>
                                    <div className={styles['answer-border']}></div>
                                </div>)
                            })
                        }
                    </div>

                    <h4>二，主观题</h4>
                    <div className={styles['subjective-list']}>
                        {
                            subjectiveList.map((item, index) => {
                                return (<div className={styles['subjective-item']} key={item.account + index}>
                                    <span>{index + 1}、</span>
                                    <div className={styles['answer-border']}></div>
                                    <div className={styles['score-border']}>
                                        打<br />分<br />区<br />域
                                    </div>
                                </div>)
                            })
                        }
                    </div>
               </div>
            </Page>
        );
    }
}

