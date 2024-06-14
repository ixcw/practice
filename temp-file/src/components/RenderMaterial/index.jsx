/**
 * 渲染题目材料部分 函数组件
 * @author:张江
 * @date:2020年09月21日
 * @version:v1.0.0
 * */
import MarkdownRender from "../MarkdownRender/MarkdownRender";
import QuestionParseUtil from "../MarkDown/QuestionParseUtil";
import { dealQuestionRender, dealQuestionNum, existArr } from '@/utils/utils';
/**
 * 渲染题目材料部分
 * @param topicContent  ：题目相关信息
 */
const renderMaterial = (topicContent = {}, serialNumberArray = [], currentPage, currentTopicIndex, pageSize) => {
    const questionMaterialData = topicContent && topicContent.questionData ? topicContent.questionData : {};

    const questionId = topicContent && topicContent.serialNumber && `${topicContent.serialNumber}、` || topicContent && topicContent.serialCode && `${topicContent.serialCode}、`
        || topicContent.questionNum && `${topicContent.questionNum}、` || currentPage && pageSize && currentTopicIndex !== undefined && currentTopicIndex !== null && currentTopicIndex !== '' && ((currentPage - 1) * pageSize + currentTopicIndex + 1) + '、'
        || "";//题号

    const questionNum = topicContent.questionNum || 2;//小题所在材料的编号

    let materialContent = topicContent && topicContent.dataContent ? topicContent.dataContent : questionMaterialData && questionMaterialData.content ? questionMaterialData.content : '';
    const dataContentPng = topicContent && topicContent.dataContentPng ? topicContent.dataContentPng : questionMaterialData.contentPng || ''
    if (!materialContent && !dataContentPng) {//不存在材料的情况
        return null;
    }
    let numArray = existArr(serialNumberArray) ? serialNumberArray : [{
        questionNum,
        singleCode: questionId
    }]
    materialContent = QuestionParseUtil.dealQuestionNum(materialContent, numArray);
    let materialPngList = dealQuestionRender(dataContentPng, true)
    return (
        <div onCopy={(e) => e.preventDefault()} className='materialImgBox'>
            {
                materialContent || dataContentPng ?
                    <MarkdownRender
                        source={QuestionParseUtil.fixContent(materialContent ? materialContent : '', materialPngList)}
                        escapeHtml={false} skipHtml={false}
                    />
                    : ''
            }
            {materialContent && materialContent.includes('[myImgCur]') ? null : dealQuestionRender(dataContentPng)}
        </div>
    )
};

export default renderMaterial;
