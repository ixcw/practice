/**
* 题目详情-上传微课页面
* @author:张江
* @date:2020年12月03日
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
    Spin,
    Button
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

import { getIcon, existArr, pushNewPage } from '@/utils/utils';
import styles from './index.less';

// const { confirm } = Modal;
const IconFont = getIcon();

@connect(state => ({
    questionDetailLoading: state[namespace].questionDetailLoading,//加载中
    selfUploadMicroList: state[namespace].selfUploadMicroList,//微课列表
    questionVos: state[namespace].questionVos,//题目基本信息
}))

export default class QuestionDetail extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
            visibleUploadMicro: false,
            playVideoId: 0,
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
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        const { dispatch } = this.props;
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
        const { visibleUploadMicro, playVideoId } = this.state
        const title = '上传微课-题目详情';
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
                <div className={classString}>
                    <h3>待上传微课的题目信息如下</h3>
                    {/* 内容区域 */}
                    {
                        questionVos ?
                            // questionVos.map((item, index) => {
                            //     if (index > 0) {
                            //         item.dataId = -item.dataId;
                            //     }
                            //     return (

                            RenderMaterialAndQuestion(questionVos, true, (RAQItem) => {
                                return (<TopicContent topicContent={RAQItem}
                                    contentFiledName={'content'}
                                    optionsFiledName={"options"}
                                    optionIdFiledName={"code"}
                                />)
                            },
                                (RAQItem) => {
                                    return <ParametersArea QContent={RAQItem} styleObject={{
                                        borderTop: 'none',
                                        borderBottom: '1px solid #ddd',
                                        marginBottom: '20px'
                                    }} />;
                                },
                            )
                            //     );
                            // }) 
                            :
                            <Spin tip="加载中..." spinning={!questionDetailLoading}></Spin>
                    }
                    <div className={styles['upload-micro-box']}>
                        <h3>上传微课 {/* 录制页面 */}
                            <Button
                                style={{ marginLeft: '16px' }}
                                onClick={() => {
                                    pushNewPage({ questionId: questionVos.id, dataId: questionVos.dataId }, '/recording-page', dispatch)
                                }}
                                type="primary">录制页面</Button></h3>
                        <div className={styles['upload-micro-list']}>
                            {
                                selfUploadMicroList && selfUploadMicroList.map((item) => {
                                    return (
                                        <div key={item.id} className={styles['micro-item']}>
                                            <span
                                                className={styles['review-tag-' + item.status]}
                                            >{item.status == 1 ? '审核通过' : item.status == 2 ? '审核中' : '审核未通过'}</span>
                                            {
                                                playVideoId != item.id ? <div className={styles['image-box']}>
                                                    {/* <div className={styles['micro-oper']}>
                                                    <span onClick={() => {
                                                        this.showUploadMicroModal(item);
                                                    }}>替换</span>
                                                    <span onClick={() => {
                                                        this.deleteMicro(item)
                                                    }}>删除</span>
                                                </div> */}
                                                    <img src={item.pngUrl} alt={''} />
                                                    <IconFont type={'icon-bofanganniu1'} onClick={() => { this.handlePlayVideo(item) }} className={styles['play']} />
                                                </div> : <div className={styles['image-box']}>
                                                    <Video 
                                                       videoUrl={item.video}
                                                       isBuy={1}
                                                    // videoEndedCallback={() => {
                                                    //     this.handlePlayVideo();
                                                    // }}
                                                    />
                                                </div>
                                            }


                                            <div className={styles['input-box']}>
                                                <Input
                                                    placeholder="请输入视频名称"
                                                    defaultValue={item.name}
                                                    onBlur={(e) => {
                                                        this.updateMicroName(e.currentTarget.value, item)
                                                    }}
                                                    onPressEnter={(e) => {
                                                        this.updateMicroName(e.currentTarget.value, item)
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    )
                                })
                            }

                            <div className={styles['micro-item']}>
                                <div className={styles['upload-oper-box']} onClick={this.showUploadMicroModal}>
                                    <IconFont type={'icon-upload'} className={styles['upload']} />
                                    <span>点击上传微课</span>
                                </div>
                            </div>
                            {/* <div className={styles['add-upload-micro']}>
                                <IconFont type={'icon-jia'} onClick={this.showUploadMicroModal} className={styles['upload']} />
                            </div> */}
                        </div>
                    </div>
                </div>
                <BackBtns tipText={"返回"} />
            </Page>
        );
    }
}

