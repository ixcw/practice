/**
* 录制微课页面
* @author:张江
* @date:2020年12月31日
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
import Video from '../videoPlayer/components/Video';

import { getIcon, existArr, watermark } from '@/utils/utils';
import styles from './index.less';

// const { confirm } = Modal;
const IconFont = getIcon();

@connect(state => ({
    questionDetailLoading: state[namespace].questionDetailLoading,//加载中
    selfUploadMicroList: state[namespace].selfUploadMicroList,//微课列表
    questionVos: state[namespace].questionVos,//题目基本信息
}))

export default class RecordingPage extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            visibleUploadMicro: false,
            playVideoId: 0,
            isShowQuestionParm: true
        };
    };

    UNSAFE_componentWillMount() {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        if (query && query.questionId && query.dataId) {
            this.getQuestionDetailInfo(query);//获取题目详情
            // this.getSetParamMicroList(query)
        }
    }

    componentDidMount() {
        watermark({ "watermark_txt": "" });//设置水印
    }

    /**
* 获取题目详情信息
* @param query  ：地址栏参数
*/
    getQuestionDetailInfo = (query) => {
        const {
            dispatch,
        } = this.props;
        dispatch({// 显示加载数据中
            type: namespace + '/saveState',
            payload: { questionDetailLoading: false }
        });
        //统计微课上传量
        dispatch({
            type: namespace + '/getQuestionDetailAndSmallClass',
            payload: {
                questionId: query.questionId,
                dataId: query.dataId,
            },
        });
    }

    /**
* 获取设参的视频列表
* @param query  ：地址栏参数
*/
    // getSetParamMicroList = (query) => {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     // dispatch({// 显示加载数据中
    //     //     type: namespace + '/saveState',
    //     //     payload: { statisticsLoading: false }
    //     // });
    //     // //统计微课上传量
    //     // dispatch({
    //     //     type: namespace + '/countUserKnowJobVideo',
    //     //     payload: {
    //     //         subjectId: subjectId,
    //     //         knowIds,
    //     //     },
    //     // });
    // }

    /**
* 显示上传微课弹窗
*/
    showUploadMicroModal = () => {
        this.setState({
            visibleUploadMicro: true,
        });
    };

    /**
    * 隐藏上传微课弹窗
    */
    handleUploadMicroCancel = e => {
        this.setState({
            visibleUploadMicro: false,
        });
    };

    /**
  * 上传微课
  */
    handleUploadMicro = () => {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search);
        this.setState({
            isUploadVideo: true
        }, () => {
            if (query && query.questionId) {
                this.getQuestionDetailInfo(query)
            }
            this.handleUploadMicroCancel();
        })
    };


    /**
    * 删除微课
     * @item : 题目对象
    */
    // deleteMicro = (item) => {
    //     confirm({
    //         title: `确认删除视频《${item}》吗？`,
    //         content: '',
    //         onOk() {

    //         },
    //         onCancel() { },
    //     })
    // }

    /**
    * 更新视频名字
    * @value : 输入的值
    * @item : 题目对象
    */
    updateMicroName = (value, item) => {
        if (value == item.name) return;//名称一样则不调用修改接口
        const {
            dispatch,
        } = this.props;
        dispatch({
            type: namespace + '/updateSmallClassName',
            payload: {
                creatorId: item.creatorId,
                id: item.id,
                name: value,
            },
            callback: (result) => {
                const returnJudge = window.$HandleAbnormalStateConfig(result);
                if (returnJudge && !returnJudge.isContinue) { return; };//如果异常 直接返回
                item.name = value;
                message.success('已成功修改微课名称');
            }
        });
    }

    /**
    * 点击播放视频
    * @item : 题目对象
    */
    handlePlayVideo = (item) => {
        if (item.status != 1 || !item.video) {
            message.warn('当前视频不支持播放')
            return;
        }
        this.setState({
            playVideoId: item.id,
        })
    }

    /**
    * 点击显隐题目参数
    */
    handleShowQuestionParm = () => {
        const { isShowQuestionParm } = this.state;
        this.setState({
            isShowQuestionParm: !isShowQuestionParm,
        })

    }

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        const { dispatch } = this.props;
        watermark({ "watermark_txt": " " }, true);
        dispatch({
            type: namespace + '/saveState',
            payload: {
                selfUploadMicroList: undefined,
                questionVos: {},
            },
        });
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const {
            location,
            dispatch,
            loading,
            questionDetailLoading,
            selfUploadMicroList,
            questionVos
        } = this.props;
        const { visibleUploadMicro, isShowQuestionParm } = this.state
        const title = `${questionVos ? (questionVos.questionId || questionVos.id) +'-':''}单题微课`;
        const breadcrumb = [title];
        const header = (
            <Page.Header breadcrumb={breadcrumb} title={title} />
        );
        const classString = classNames(styles['question-detail-content'], 'gougou-content');
        return (
            <Page header={header} loading={!questionDetailLoading}>
                {/*【上传微课弹窗】*/}
                {
                    visibleUploadMicro ? <UploadMicroModal
                        QContent={questionVos}
                        visibleUploadMicro={visibleUploadMicro}
                        handleUploadMicroCancel={this.handleUploadMicroCancel}
                        handleUploadMicro={this.handleUploadMicro}
                    /> : null
                }
                <div className={classString} id='watermark'>
                    <div>
                        <h3 onClick={this.handleShowQuestionParm}>{window.$systemTitleName}<span>(点击可{isShowQuestionParm?'隐藏':'显示'}题目参数)</span></h3>
                        {/* 内容区域 */}
                        {
                            questionVos ?
                                RenderMaterialAndQuestion(questionVos, false, (RAQItem) => {
                                    return (<TopicContent topicContent={RAQItem}
                                        contentFiledName={'content'}
                                        optionsFiledName={"options"}
                                        optionIdFiledName={"code"}
                                    />)
                                },
                                    (RAQItem) => {
                                        return <div>
                                            {
                                                isShowQuestionParm ? <ParametersArea QContent={RAQItem} styleObject={{
                                                    borderTop: 'none',
                                                    // borderBottom: '1px solid #ddd',
                                                    // marginBottom: '20px'
                                                }} /> : null
                                            }
                                        </div>;
                                    },
                                )
                                :
                                <Spin tip="加载中..." spinning={!questionDetailLoading}></Spin>
                        }
                    </div>
                    {/* <div>
                       书写区域
                   </div> */}
                </div>
                <BackBtns tipText={"返回"} />
            </Page>
        );
    }
}

