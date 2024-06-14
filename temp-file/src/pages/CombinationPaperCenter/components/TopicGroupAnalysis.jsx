/**
* 题组分析数据展示 - 弹窗
* @author:张江
* @date:2021年04月29日
* @version:v1.0.0
* */

// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import {
    Empty,
    Modal,
    Tag,
    Spin,
    Table
} from 'antd';
import { connect } from "dva";
import {
    save2NumAfterPoint,
} from "@/utils/utils";
import { PaperBoard as namespace, Auth, QuestionBank } from '@/utils/namespace';
import BarTwo from './chart/barTwo.js';
import styles from '../PaperBoard/index.less'

@connect(state => ({
    loading: state[namespace].loading,
    analysisData: state[namespace].analysisData,//组题分析数据
}))

export default class TopicGroupAnalysis extends React.Component {
    static propTypes = {
        topicList: PropTypes.any.isRequired,//题型题目列表
        combinationAnalysisModalIsShow: PropTypes.bool.isRequired,//是否显示弹框
        toggleAnalysisModalState: PropTypes.func.isRequired,//弹框操作隐藏
    };


    constructor() {
        super(...arguments);
        this.state = {

        };
    }

    componentDidMount() {

    }

    /**
     *  将后台获取到的数据转换为题型表格适用的数据格式
     * @resourceData：原数据
     * @return  返回重新封装后的数据格式
     */
    handleTopicTypeAnalysisData = (resourceData) => {
        const { topicList = [] } = this.props
        let resultData = []
        resourceData && resourceData.length > 0 && resourceData.forEach((record, index) => {
            let bigTopicType = this.getCategoryName(topicList, record);//获取题型标题
            resultData.push({
                key: index,
                bigTopicType,
                // bigTopicType: record.category && topicType[record.category] || '无',
                topicRate: `${record.count !== undefined && record.count !== null ? record.count : '无题目数量数据'}（${record.ratio !== undefined && record.ratio != null ? save2NumAfterPoint(record.ratio, 2) : '无占比数据'}%）`,
                scoreRate: `${record.score !== undefined && record.score !== null ? record.score : '无分值数据'}（${record.scoreRatio !== undefined && record.scoreRatio !== null ? save2NumAfterPoint(record.scoreRatio, 2) : '无占比数据'}%）`,
                comprehensiveDifficulty: record.comprehensiveDifficulty !== undefined && record.comprehensiveDifficulty !== null ? record.comprehensiveDifficulty : record.comprehensiveDifficulty || '无'
            })
        })
        return resultData
    }

    /**
* 获取题目类型标题
* @param topicList ：题型列表
* @param topic ：题目信息
*
*/
    getCategoryName = (topicList = [], topic = {}) => {
        let bigTopicType = '无'
        for (const categoryJson of topicList) {
            if (categoryJson.category == topic.category) {
                bigTopicType = categoryJson.name || '无';
                break;
            }
        }
        return bigTopicType;
    }

    render() {
        const {
            combinationAnalysisModalIsShow,
            loading,
            analysisData,
            toggleAnalysisModalState
        } = this.props;
        let difficultStatisticsChartData = analysisData && analysisData.length > 2 && analysisData[1]//图表数据
        let knowledgeStatisticsData = analysisData && analysisData.length > 2 && analysisData[2].map((topic, index) => {
            topic.serialNumber = topic.code || (index + 1)
            return topic
        }) || []//知识点统计表格数据
        const columns = [
            {
                title: '题型',
                dataIndex: 'bigTopicType',
                key: 'bigTopicType',
            },
            {
                title: '题目量（占比）',
                dataIndex: 'topicRate',
                key: 'topicRate',
            },
            {
                title: '分值（占比）',
                dataIndex: 'scoreRate',
                key: 'scoreRate',
            },
            {
                title: '综合难度',
                dataIndex: 'comprehensiveDifficulty',
                key: 'comprehensiveDifficulty',
            },
        ];
        //组题分析====>知识点统计表格的表头
        const knowledgeColumns = [
            {
                title: '题号',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
            },
            {
                title: '知识点',
                dataIndex: 'knowNames',
                key: 'knowNames',
                render(text) {
                    return text ? text.split(',').map((knowName, index) => <Tag key={index} color={"#2db7f5"}>{knowName}</Tag>) : '-';
                }
            },
            {
                title: '分值',
                dataIndex: 'score',
                key: 'score',
            },
            {
                title: '难度',
                dataIndex: 'difficulty',
                key: 'difficulty',
            },
        ]
        return (
            <Modal
                className='combinationAnalysisModal'
                width='80%'
                title="题组分析"
                visible={combinationAnalysisModalIsShow}
                onOk={_ => {
                    toggleAnalysisModalState(false)
                }}
                onCancel={_ => {
                    toggleAnalysisModalState(false)
                }}
            >
                <Spin spinning={!!loading}>
                    <div className='combinationAnalysis_wrap'>
                        <div className='statisticsItem topicTypeStatistics'>
                            <div className="title">题型统计</div>
                            <Table
                                dataSource={analysisData && analysisData.length > 1 && this.handleTopicTypeAnalysisData(analysisData[0]) || []}
                                pagination={false}
                                columns={columns} />
                        </div>
                        <div className='statisticsItem difficultStatistics'>
                            <div className="title">难度统计</div>
                            <div className='chart'>
                                {
                                    !loading && difficultStatisticsChartData && difficultStatisticsChartData.length > 0 ?
                                        <BarTwo idString="topicAnalysis"
                                            styleObject={{ width: '72vw', height: 600 }}
                                            chartData={difficultStatisticsChartData}
                                        /> : <Empty />
                                }

                                {/* <DifficultStatisticsChart data={difficultStatisticsChartData}/> */}
                            </div>
                        </div>
                        <div className='statisticsItem knowledgeStatistics'>
                            <div className="title">知识点统计</div>
                            <Table dataSource={knowledgeStatisticsData}
                                columns={knowledgeColumns}
                                rowKey={"serialNumber"}
                                pagination={false} />
                        </div>

                    </div>
                </Spin>
            </Modal>
        )
    }
}

