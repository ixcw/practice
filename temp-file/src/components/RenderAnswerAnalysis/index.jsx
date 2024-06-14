/**
 * 渲染题目答案与解析部分 函数组件
 * @author:张江
 * @date:2020年08月25日
 * @version:v1.0.0
 * */
import MarkdownRender from "../MarkdownRender/MarkdownRender";
import QuestionParseUtil from "../MarkDown/QuestionParseUtil";
import { dealQuestionRender } from '@/utils/utils';

/**
 * 渲染题目答案与解析部分
 * @param topicContent  ：题目相关信息
 */
const renderAnswerAnalysis = (topicDetail = {}, index = 1) => {
  const splicingAnswer = (littleTopic, filedName) => {
    littleTopic && littleTopic.children && littleTopic.children.length > 0 && littleTopic.children.map(item => {
      littleAnswer += `<span>${item.serial_number || ''} ${item[filedName] || '暂无答案'}</span><br>`;
      splicingAnswer(item);
    })
  };
  let { children = [], studentAnswer, flag } = topicDetail;
  let topicDetailAnswer = children.length === 0 && topicDetail && topicDetail.answer;//整个大题答案（如果是大题），如果是小题，则是小题答案
  let littleAnswer = index !== undefined && children && children.length > 0 && children[index].answer;//小题答案
  if (!littleAnswer) {
    littleAnswer = "";
    splicingAnswer(children[index], "answer");
  }

  let answer = littleAnswer || topicDetailAnswer;//小题答案优 先

  let topicDetailAnalysis = children.length === 0 && topicDetail && topicDetail.analysis;//整个答题解析（如果是大题），如果是小题，则是小题解析
  let littleAnalysis = index !== undefined && children && children.length > 0 && children[index].analysis;//小题解析
  if (!littleAnalysis) {
    littleAnalysis = "";
    splicingAnswer(children[index], "analysis");
  }

  let analysis = littleAnalysis || topicDetailAnalysis;//小题答案优先
  let answerPngList = dealQuestionRender(topicDetail.answerPng, true)
  let analysisPngList = dealQuestionRender(topicDetail.analysisPng, true)
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className='answerAnalysisImgBox'
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '48px' }}>答案：</div>
        <div style={{ width: "calc(100% - 60px)" }}>
          {
            answer || topicDetail.answerPng ?
              <MarkdownRender
                source={QuestionParseUtil.fixContent(answer ? answer : '', answerPngList)}
                escapeHtml={false} skipHtml={false}
              />
              : '暂无答案'
          }
          {answer && answer.includes('[myImgCur]') ? null : dealQuestionRender(topicDetail.answerPng)}
        </div>
      </div>
      {/* {studentAnswer && flag === 1 ? <div>{`学生答案：${studentAnswer}`}</div> : ''} */}
      <div>
        {/* <span>解析：</span> */}
        <div className="lineHeight3-2">
          {
            analysis || topicDetail.analysisPng ?
              <MarkdownRender
                source={QuestionParseUtil.fixContent(analysis ? analysis : '', analysisPngList)}
                escapeHtml={false} skipHtml={false}
              />
              : '本题暂无解析内容'
          }
          {analysis && analysis.includes('[myImgCur]') ? null : dealQuestionRender(topicDetail.analysisPng)}
        </div>
      </div>
    </div>
  )
};

export default renderAnswerAnalysis;
