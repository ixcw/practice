/**
 * 渲染题目材料以及题目 函数组件
 * @author:张江
 * @date:2020年10月19日
 * @version:v1.0.0
 * */
// import TopicContent from "../TopicContent/TopicContent";
import RenderMaterial from "../RenderMaterial/index";//渲染材料部分
import renderAnswerAnalysis from "../RenderAnswerAnalysis/index";//渲染题目答案与解析部分
import { existArr } from '@/utils/utils';

/**
 * 渲染题目材料以及题目
 * @param questionData  ：题目相关信息
 * @param isShowAnswerAnalysis  ：是否显示答案解析 默认不显示
 * @param topicContentOption  ：渲染题目参数配置
 * @param renderTopicContent  渲染题目信息
 * @param renderChildren  ：渲染子节点函数                // (item) => {
                //   return (
                //     <span onClick={() => { alert(item.id)}}>{item.id}</span>
                //   )
                // }
* @param isRenderMaterial  是否渲染材料

 */
const RenderMaterialAndQuestion = (
    questionData = {},
    isShowAnswerAnalysis = false,//是否渲染答案解析
    // topicContentOption = {//渲染题目参数配置
    //     contentFiledName: 'content',
    //     optionsFiledName: 'optionList',
    //     optionIdFiledName: 'code',
    // },
    renderTopicContent = () => { return null },
    renderChildren = () => { return null },
    isRenderMaterial = true,//是否渲染材料
) => {

    // 渲染题目信息
    const renderQuestionInfo = (item) => {
        if (!item) {//判空处理
            return null;
        }
        return (<div key={item.id} className='question-content-option'>
            {/* 渲染题目信息 */}
            {renderTopicContent(item)}
            {/* 渲染答案解析 */}
            { isShowAnswerAnalysis ? renderAnswerAnalysis(item, 1) : null}
            {/* 渲染子节点 */}
            {renderChildren(item)}
        </div>
        )
    }

    // 是否包含材料 并且有题
    const isHaveMaterialQuestionList = ((questionData && questionData.questionData && questionData.questionData.id && questionData.questionData.id > 0) || (questionData && questionData.dataId && questionData.dataId > 0));

    // 存在材料并且有题的情况
    let serialNumberArray = [];
    let materialQuestionList = questionData && questionData.materialQuestionList && Array.isArray(questionData.materialQuestionList) ?
        questionData.materialQuestionList : [];
    if (materialQuestionList && materialQuestionList.length > 0) {
        materialQuestionList = materialQuestionList.map((item = {}, index) => {
            let questionId = item.serialNumber && item.serialNumber && `${item.serialNumber}、` || item.serialCode && `${item.serialCode}、` || item.questionNum && `${item.questionNum}、` || ''
            let questionNum = item.questionNum || 0;//小题所在材料的编号
            const tempIndex = index + 1;
            if (!questionId) {
                questionId = `${tempIndex}、`
                item.serialNumber = tempIndex
            }
            let numJson = {
                questionNum: questionNum || tempIndex,
                singleCode: questionId
            }
            serialNumberArray.push(numJson);
            return item;
        })

    }

    if (isHaveMaterialQuestionList) {//有材料的情况
        if (existArr(questionData.materialQuestionList)) {//有材料并且有题的情况
            return (
                <div className='question-material-box'>
                    {//渲染材料
                        isRenderMaterial ? RenderMaterial(questionData, serialNumberArray) : null
                    }
                    {
                        questionData.materialQuestionList.map((item) => {
                            return renderQuestionInfo(item)
                        })
                    }
                </div>
            )
        } else {//有材料但是没有题目列表的情况
            return (
                <div className='question-material-box'>
                    {//渲染材料
                        isRenderMaterial ? RenderMaterial(questionData, serialNumberArray) : null
                    }
                    {renderQuestionInfo(questionData)}
                </div>
            )
        }

    } else {//没有材料的题-正常情况 大多数
        return renderQuestionInfo(questionData)
    }
};

export default RenderMaterialAndQuestion;