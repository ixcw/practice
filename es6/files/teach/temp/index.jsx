/**
 * 模板规则
 */
import {
  Select,
  Checkbox,
  Spin
} from 'antd'
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import styles from './index.less'
import ResizeObserver from "resize-observer-polyfill";
import JudgeArea from "@/pages/CombinationPaperCenter/components/JudgeArea";//对错判断区域
import AnswerArea from "@/pages/CombinationPaperCenter/components/AnswerArea";//答题区域
import ScoreGrid from "@/pages/CombinationPaperCenter/components/ScoreGrid";//分数格子
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import TopicContent from "@/components/TopicContent/TopicContent";

const TemplateRule = forwardRef((props, ref) => {
  const { 
    isEditable, // 是否可编辑
    templateDetail, // 模板详情
    // reviewType 批阅模式 1 对错模式 2 分值模式 3 半对模式
    // arrayType 排列方式或布局方式 1 横向排列 2 纵向排列 3 题目上方 4 题目下方
    // isArea 是否需要作答区域 0 不需要 1 需要
    // scoreSet 分数设置 2 不需要小数 3 需要小数
    // checked 是否选中 true 选中 false 未选中
    // scoreChecked 是否选中小数 true 选中 false 未选中
    // splitChecked 是否选中小项 true 选中 false 未选中
    index = 6,
    changeTemplateRule
  } = props

  const initialMount = useRef(true) // 初次挂载
  const timerIdRef = useRef(null) // 定时器id
  const resizeObserverRef = useRef(null) // 重绘器
  const [loading, setLoading] = useState(false)

  const reviewTypeOptions = [
    { value: 1, label: '对错模式' },
    { value: 2, label: '分值模式' },
    { value: 3, label: '半对模式' }
  ]
  const arrayTypeBooleanOptions = [
    { value: 1, label: '横向排列' },
    { value: 2, label: '纵向排列' }
  ]
  const arrayTypeScoreOptions = [
    { value: 3, label: '题目上方' },
    { value: 4, label: '题目下方' }
  ]

  /**
   * 选择批阅模式
   * @param {*} value 
   */
  const selectReviewType = value => {
    const intValue = parseInt(value)
    changeTemplateRule(intValue, 'reviewType', index)
    if (intValue === 1 || intValue === 3) {
      changeTemplateRule(1, 'arrayType', index)
    } else if (intValue === 2) {
      changeTemplateRule(4, 'arrayType', index)
    }
  }

  /**
   * 选择排列布局方式
   * @param {*} value 
   */
  const selectArrayType = value => {
    const intValue = parseInt(value)
    changeTemplateRule(intValue, 'arrayType', index)
  }

  /**
   * 选择是否需要答题区域
   * @param {*} e 
   */
  const onChangeIsArea = e => {
    const isChecked = e.target.checked
    changeTemplateRule(isChecked, 'checked', index)
    isChecked ? changeTemplateRule(1, 'isArea', index) : changeTemplateRule(0, 'isArea', index)
  }

  /**
   * 选择是否需要小数位
   * @param {*} e 
   */
  const onChangeScoreSet = e => {
    const isChecked = e.target.checked
    changeTemplateRule(isChecked, 'scoreChecked', index)
    isChecked ? changeTemplateRule(3, 'scoreSet', index) : changeTemplateRule(2, 'scoreSet', index)
  }

  /**
   * 选择是否分割至小题小项
   * @param {*} e 
   */
  const onChangeIsSplitQuestion = e => {
    const isChecked = e.target.checked
    changeTemplateRule(isChecked, 'splitChecked', index)
    isChecked ? changeTemplateRule(1, 'smallItem', index) : changeTemplateRule(0, 'smallItem', index)
  }

  useEffect(() => {
    // 初始化重绘器
    resizeObserverRef.current = new ResizeObserver((entries) => {
      // 初次挂载不执行
      if (initialMount.current) {
        initialMount.current = false
        return
      }
      const height = entries[0].target.offsetHeight
      // 高度为0，说明是关闭弹框，不执行
      if (height === 0) return
      clearTimeout(timerIdRef.current)
      setLoading(true)
      timerIdRef.current = setTimeout(() => {
        // 执行高度修改逻辑
        changeTemplateRule(height, 'height', index)
        setLoading(false)
      }, 500)
    })
    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect()
      clearTimeout(timerIdRef.current)
    }
  }, [])

  /**
   * 重绘绑定
   * @param {*} el 元素
   */
  const resizeObserverBindRef = (el) => {
    if (el && resizeObserverRef.current) resizeObserverRef.current.observe(el)
  }

  return (
    <div className={styles['template-rule']}>
      <div className={styles['template-rule-area']}>
        <div className={styles['rule-config']}>
          <span style={{marginLeft: 8}}>批阅模式</span>
          <Select
            value={templateDetail.reviewType}
            style={{ width: '105px', margin: '0 10px' }}
            disabled={!isEditable}
            onChange={selectReviewType}
            options={reviewTypeOptions}
          />
          {
            templateDetail.reviewType === 1 || templateDetail.reviewType === 3 ?
            <div>
              <span>排列方式</span>
              <Select
                value={templateDetail.arrayType}
                style={{ width: '105px', margin: '0 10px' }}
                disabled={!isEditable}
                onChange={selectArrayType}
                options={arrayTypeBooleanOptions}
              />
            </div> :
            <div>
              <span>布局方式</span>
              <Select
                value={templateDetail.arrayType}
                style={{ width: '105px', margin: '0 10px' }}
                disabled={!isEditable}
                onChange={selectArrayType}
                options={arrayTypeScoreOptions}
              />
            </div>
          }
          <Checkbox 
            checked={templateDetail.checked} 
            disabled={!isEditable}
            onChange={onChangeIsArea}
          >是否需要答题区域</Checkbox>
          {
            templateDetail.reviewType === 2 ? 
              <Checkbox 
                checked={templateDetail.scoreChecked}
                disabled={!isEditable}
                onChange={onChangeScoreSet}
              >评分区小数位</Checkbox> : null
          }
          {
            templateDetail.rule !== 1 && templateDetail.rule !== 2 && templateDetail.rule !== 9 ? 
              <Checkbox 
                checked={templateDetail.splitChecked}
                disabled={!isEditable}
                onChange={onChangeIsSplitQuestion}
              >分割至小题小项</Checkbox> : null
          }
        </div>
        <div className={styles['score-grid']}>
          <ScoreGrid 
            hasScoreGrid={templateDetail.reviewType === 2 && templateDetail.arrayType === 3}
            isDecimal={templateDetail.scoreSet === 3}
            score={templateDetail.score} />
        </div>
        <div className={styles['question-area']}>
          <div className={styles['question-example']}>
            {
              RenderMaterialAndQuestion(templateDetail, false,
                (RAQItem) => {
                  return (
                    <TopicContent
                      topicContent={RAQItem}
                      childrenFiledName={'children'}
                      contentFiledName={'content'}
                      optionIdFiledName={'code'}
                      optionsFiledName={"optionList"}
                      currentPage={1}
                      currentTopicIndex={(RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)) - 1}
                      pageSize={10} />
                  )
                }
              )
            }
          </div>
          <JudgeArea 
            height={90 + 'px'}
            reviewType={templateDetail.reviewType}
            hasJudgeArea={templateDetail.reviewType === 1 || templateDetail.reviewType === 3}
            isHorizontal={templateDetail.arrayType === 1}
            isEditable={false} />
        </div>
        <div className={styles['score-grid']}>
          <ScoreGrid 
            hasScoreGrid={templateDetail.reviewType === 2 && templateDetail.arrayType === 4}
            isDecimal={templateDetail.scoreSet === 3}
            score={templateDetail.score} />
        </div>
        <div className={styles['answer-area']}>
          <Spin spinning={loading}>
            <AnswerArea 
              id={templateDetail.id}
              ref={resizeObserverBindRef}
              height={templateDetail.height + 'px'} 
              hasAnswerArea={templateDetail.isArea === 1} 
              isEditable={isEditable} />
          </Spin>
        </div>
      </div>
    </div>
  )
})

export default TemplateRule
