/**
* 题目列表页面 设置参数表单组件
* @author:张江
* @date:2019年11月25日
* @version:v1.0.1
* @updateTime :2022年05月20日
* @updateDescription :添加添加知识维度
* */

// eslint-disable-next-line
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  message,
  Icon,
  Input,
  Form,
  Cascader,
  InputNumber,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './SetParameterForm.less';
const FormItem = Form.Item;
let uuid = 1;
let kaUuid = 1;//关键能力

const SetParameterForm = ({ QContent: QContent1, knowledgeList, version, updateQuestionParameter, otherParam = {} }) => {
  const [form] = Form.useForm();
  const [QContent, setQContent] = useState(QContent1);
  const [initialVNumber, setInitialVNumber] = useState([]);//知识点
  const [initialKeyAbility, setInitialKeyAbility] = useState([]);//关键能力
  const [initialCoreLiteracy, setInitialCoreLiteracy] = useState([]);//核心素养
  const [initialCognitiveLevel, setInitialCognitiveLevel] = useState([]);//认知层次
  const [initialKnowledgeDimension, setInitialKnowledgeDimension] = useState([]);//知识维度
  const {
    keyAbilityList = [],//关键能力
    coreLiteracyList = [],//核心素养
    cognitiveLevelList = [],//认知层次
    knowledgeDimensionList=[],//知识维度
    comePage,//来至那个页面
  } = otherParam;
  const knowledgeKey = 'knowIds',//知识点
    keyAbilityKey = 'abilityIds',//关键能力
    coreLiteracyKey = 'compIds',//核心素养
    cognitiveLevelKey = 'cognIds',//认知层次
    knowledgeDimensionKey = 'dimeIds';//知识维度

  useEffect(() => {
    const knowIdsArray = dealKnows(QContent1, knowledgeKey);//知识点
    const keyAbilityIdsArray = dealKnows(QContent1, keyAbilityKey);//关键能力
    const coreLiteracyIdsArray = dealKnows(QContent1, coreLiteracyKey);//核心素养
    const cognitiveLevelIdsArray = dealKnows(QContent1, cognitiveLevelKey);//认知层次
    const knowledgeDimensionIdsArray = dealKnows(QContent1, knowledgeDimensionKey);//知识维度
    if (initialVNumber && initialVNumber.length > 0) {
    } else {
      if (knowIdsArray && knowIdsArray.length > 0) {//知识点
        for (let item of knowIdsArray) {
          if (item != []) {
            initialVNumber.push(uuid++)
            setInitialVNumber(initialVNumber)
          }
        }
      } else {
        setInitialVNumber([uuid++])
      }
    }

    if (initialKeyAbility && initialKeyAbility.length > 0) {
    } else {
      if (keyAbilityIdsArray && keyAbilityIdsArray.length > 0) {//关键能力
        for (let item of keyAbilityIdsArray) {
          if (item != []) {
            initialKeyAbility.push(uuid++)
            setInitialKeyAbility(initialKeyAbility)
          }
        }
      } else {
        setInitialKeyAbility([uuid++])
      }
    }

    if (initialCoreLiteracy && initialCoreLiteracy.length > 0) {
    } else {
      if (coreLiteracyIdsArray && coreLiteracyIdsArray.length > 0) {//核心素养
        for (let item of coreLiteracyIdsArray) {
          if (item != []) {
            initialCoreLiteracy.push(uuid++)
            setInitialCoreLiteracy(initialCoreLiteracy)
          }
        }
      } else {
        setInitialCoreLiteracy([uuid++])
      }


    }

    if (initialCognitiveLevel && initialCognitiveLevel.length > 0) {
    } else {

      if (cognitiveLevelIdsArray && cognitiveLevelIdsArray.length > 0) {//认知层次
        for (let item of cognitiveLevelIdsArray) {
          if (item != []) {
            initialCognitiveLevel.push(uuid++)
            setInitialCognitiveLevel(initialCognitiveLevel)
          }
        }
      } else {
        setInitialCognitiveLevel([uuid++])
      }
    }

    // 知识维度
    if (initialKnowledgeDimension && initialKnowledgeDimension.length > 0) {
    } else {

      if (knowledgeDimensionIdsArray && knowledgeDimensionIdsArray.length > 0) {//知识维度
        for (let item of knowledgeDimensionIdsArray) {
          if (item != []) {
            initialKnowledgeDimension.push(uuid++)
            setInitialKnowledgeDimension(initialKnowledgeDimension)
          }
        }
      } else {
        setInitialKnowledgeDimension([uuid++])
      }
    }

  });

  /**
  * 添加知识点输入框
  * @param type  ：类型 1知识点 2关键能力 3核心素养 4认知层次
  */
  const add = (type) => {
    if (type == 1) {//1知识点
      // can use data-binding to get
      const nextKeys = initialVNumber && initialVNumber.concat(uuid);
      setInitialVNumber(nextKeys)
    } else if (type == 2) {//2关键能力
      // can use data-binding to get
      const nextKeys = initialKeyAbility && initialKeyAbility.concat(uuid);
      setInitialKeyAbility(nextKeys)
    } else if (type == 3) {//3核心素养
      // can use data-binding to get
      const nextKeys = initialCoreLiteracy && initialCoreLiteracy.concat(uuid);
      setInitialCoreLiteracy(nextKeys)
    } else if (type == 4) {//4认知层次
      // can use data-binding to get
      const nextKeys = initialCognitiveLevel && initialCognitiveLevel.concat(uuid);
      setInitialCognitiveLevel(nextKeys)
    } else if (type == 5) {//5知识维度
      // can use data-binding to get
      const nextKeys = initialKnowledgeDimension && initialKnowledgeDimension.concat(uuid);
      setInitialKnowledgeDimension(nextKeys)
    }
    uuid++;
  };

  /**
  * 移除知识点输入框
  * @param k  ：key值
  * @param type  ：类型 1知识点 2关键能力 3核心素养 4认知层次 5知识维度
  */
  const remove = (k, type) => {
    if (type == 1) {//1知识点
      // We need at least one passenger
      if (initialVNumber.length === 1) {
        return;
      }
      let initialKeys = initialVNumber.filter(key => key !== k);
      // can use data-binding to set
      setInitialVNumber(initialKeys)
    } else if (type == 2) {//2关键能力
      // We need at least one passenger
      if (initialKeyAbility.length === 1) {
        return;
      }
      let initialKeys = initialKeyAbility.filter(key => key !== k);
      // can use data-binding to set
      setInitialKeyAbility(initialKeys)
    } else if (type == 3) {//3核心素养
      // We need at least one passenger
      if (initialCoreLiteracy.length === 1) {
        return;
      }
      let initialKeys = initialCoreLiteracy.filter(key => key !== k);
      // can use data-binding to set
      setInitialCoreLiteracy(initialKeys)
    } else if (type == 4) {//4认知层次
      // We need at least one passenger
      if (initialCognitiveLevel.length === 1) {
        return;
      }
      let initialKeys = initialCognitiveLevel.filter(key => key !== k);
      // can use data-binding to set
      setInitialCognitiveLevel(initialKeys)
    } else if (type == 5) {//5知识维度
      // We need at least one passenger
      if (initialKnowledgeDimension.length === 1) {
        return;
      }
      let initialKeys = initialKnowledgeDimension.filter(key => key !== k);
      // can use data-binding to set
      setInitialKnowledgeDimension(initialKeys)
    }

  };

  /**
  * 知识点id 处理传入后台
  * @param v  ：知识点id数组
  */
  const convertIds = (v) => {
    let ret = [];
    // eslint-disable-next-line
    v.map(it => {
      let str = it ? it.join(",") : '';
      if (ret.indexOf(str) < 0) {
        ret.push(str)
      }
    });

    return ret.join(";")
  };

  /**
  * 切割知识点id 
  * @param QContent  ：题目内容
  * @param filed  ：字段
  */
  const dealKnows = (QContent, filed = 'knowIds') => {
    let knowIdsArray = []
    if (QContent && QContent[filed]) {
      const knowIdString = QContent[filed].split(';');
      for (let item of knowIdString) {
        if (item) {
          let knowIds = item.split(',').map((item) => {
            return Number(item)
          });
          knowIdsArray.push(knowIds)
        }
      }
    }
    return knowIdsArray;
  }

  /**
  * 渲染题目答案与解析部分
  */
  const validateToDifficulty = (rule, value, callback) => {
    if ((value > 0 || value == 0) && (value < 1 || value == 1)) {
      callback();
      return;
    } else {
      callback('难度值必须是大于等于0 小于等于1的数字');
    }
  };

  /**
  * 显示最后一级知识点
  * @param label  ：知识点数组
  */
  const displayRender = (label) => {
    return label[label.length - 1];
  }

  /**
  * 知识点输入框渲染
  * @param type  ：类型 1知识点 2关键能力 3核心素养 4认知层次 5知识维度
  */
  const formItemsRender = (type) => {
    let knowIdsArray = dealKnows(QContent)
    let keys = initialVNumber;
    let labelName = '知识点';
    let nameKey = knowledgeKey;
    let tempOptions = knowledgeList;
    // console.log('initialKeyAbility===', initialKeyAbility)
    // console.log('initialVNumber===', initialVNumber)
    if (type == 1) {//1知识点
      knowIdsArray = dealKnows(QContent, knowledgeKey)
      keys = initialVNumber;
      labelName = '知识点';
      nameKey = knowledgeKey;
      tempOptions = knowledgeList;
    } else if (type == 2) {//2关键能力
      knowIdsArray = dealKnows(QContent1, keyAbilityKey);//关键能力
      keys = initialKeyAbility;
      labelName = '关键能力';
      nameKey = keyAbilityKey;
      tempOptions = keyAbilityList;
    } else if (type == 3) {//3核心素养
      knowIdsArray = dealKnows(QContent1, coreLiteracyKey);//3核心素养
      keys = initialCoreLiteracy;
      labelName = '核心素养';
      nameKey = coreLiteracyKey;
      tempOptions = coreLiteracyList;
    } else if (type == 4) {//4认知层次
      knowIdsArray = dealKnows(QContent1, cognitiveLevelKey);//4认知层次
      keys = initialCognitiveLevel;
      labelName = '认知层次';
      nameKey = cognitiveLevelKey;
      tempOptions = cognitiveLevelList;
    } else if (type == 5) {//5知识维度
      knowIdsArray = dealKnows(QContent1, knowledgeDimensionKey);//5知识维度
      keys = initialKnowledgeDimension;
      labelName = '知识维度';
      nameKey = knowledgeDimensionKey;
      tempOptions = knowledgeDimensionList;
    }
    const formItems = keys.map((k, index) => {
      return (
        <div key={k} className='set-form-item'>
          <FormItem
            // label={'知识点' + (index + 1)}
            label={index == 0 ? `${labelName}:` : ''}
            required={false}
            name={`${nameKey}[${k}]`}
            initialValue={knowIdsArray[index]}
            validateTrigger={['onChange']}
            // type == 1 ? 
            rules={[{
              required: true,
              message: `请选择${labelName}` + (index + 1),
            }]}
          >
            <Cascader
              options={tempOptions ? tempOptions : [{}]}
              showSearch={{
                matchInputWidth: false,
              }}
              expandTrigger="hover"
              allowClear={false}
              displayRender={displayRender}
              placeholder={`请选择${labelName}` + (index + 1)}
              fieldNames={{ label: "name", value: "id", children: type == 1 ? 'child' : 'childList' }}
              style={{ width: '90%', marginRight: 8 }} />
          </FormItem>
          {keys.length > 1 ? (
            <MinusCircleOutlined
              className="dynamic-delete-button"
              disabled={keys.length === 1}
              onClick={() => remove(k, type)} />
          ) : null}
        </div>

      );
    });
    return formItems;
  }
  const onSubmitFinish = payload => {
    // console.log('Received values of form: ', payload);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'undefined') {
        delete payload[key]
      }
    });
    delete payload['keys'];
    let isRepeat = false;
    payload.questionId = QContent.id;
    payload.categoryCode = QContent.category;//20201106设参点知识时添加题型类型传入
    if (comePage != 'setParam') {
      if (payload && payload[knowledgeKey]) {
        payload[knowledgeKey] = convertIds(payload[knowledgeKey]);//处理知识点id
        QContent.SknowIds = QContent.knowIds;
        QContent.knowIds = payload[knowledgeKey];
      } else {
        QContent.SknowIds = QContent.knowIds;
        // let tempKnowIds = []
        // initialVNumber.map((item) => {
        //   tempKnowIds.push(payload[`knowIds[${item}]`])
        //   delete payload[`knowIds[${item}]`]
        // })
        // payload.knowIds = convertIds(tempKnowIds);//处理知识点id;

        let ret = [];
        for (const item of initialVNumber) {
          let str = payload[`${knowledgeKey}[${item}]`].join(",");
          delete payload[`${knowledgeKey}[${item}]`];
          if (ret.indexOf(str) < 0) {
            ret.push(str)
          } else {
            message.warning('知识点选择存在重复');
            isRepeat = true
            break;
          }
        }
        if (isRepeat) {
          return;
        }
        payload[knowledgeKey] = ret.join(';');//处理知识点id;

        QContent.knowIds = payload[knowledgeKey];
      }
    } else {
      payload.knowIds = QContent.knowIds;
      payload.difficulty = QContent.difficulty
    }

    if (comePage !== 'uploadData') {//考试数据入库 2021年05月06日
      // 关键能力
      if (payload && payload[keyAbilityKey]) {
        payload[keyAbilityKey] = convertIds(payload[keyAbilityKey]);//处理关键能力id
        // QContent.SknowIds = QContent.knowIds;
        QContent[keyAbilityKey] = payload[keyAbilityKey];
      } else {
        // QContent.SknowIds = QContent.knowIds;
        let ret = [];
        for (const item of initialKeyAbility) {
          let str = payload[`${keyAbilityKey}[${item}]`].join(",");
          delete payload[`${keyAbilityKey}[${item}]`];
          if (ret.indexOf(str) < 0) {
            ret.push(str)
          } else {
            message.warning('关键能力选择存在重复');
            isRepeat = true
            break;
          }
        }
        if (isRepeat) {
          return;
        }
        payload[keyAbilityKey] = ret.join(';');//处理知识点id;

        QContent[keyAbilityKey] = payload[keyAbilityKey];
      }

      // 核心素养
      if (payload && payload[coreLiteracyKey]) {
        payload[coreLiteracyKey] = convertIds(payload[coreLiteracyKey]);//处理核心素养id
        // QContent.SknowIds = QContent.knowIds;
        QContent[coreLiteracyKey] = payload[coreLiteracyKey];
      } else {
        // QContent.SknowIds = QContent.knowIds;
        let ret = [];
        for (const item of initialCoreLiteracy) {
          let str = payload[`${coreLiteracyKey}[${item}]`].join(",");
          delete payload[`${coreLiteracyKey}[${item}]`];
          if (ret.indexOf(str) < 0) {
            ret.push(str)
          } else {
            message.warning('核心素养选择存在重复');
            isRepeat = true
            break;
          }
        }
        if (isRepeat) {
          return;
        }
        payload[coreLiteracyKey] = ret.join(';');//处理核心素养id;
        QContent[coreLiteracyKey] = payload[coreLiteracyKey];
      }

      // 认知层次
      if (payload && payload[cognitiveLevelKey]) {
        payload[cognitiveLevelKey] = convertIds(payload[cognitiveLevelKey]);//处理认知层次id
        // QContent.SknowIds = QContent.knowIds;
        QContent[cognitiveLevelKey] = payload[cognitiveLevelKey];
      } else {
        // QContent.SknowIds = QContent.knowIds;
        let ret = [];
        for (const item of initialCognitiveLevel) {
          let str = payload[`${cognitiveLevelKey}[${item}]`].join(",");
          delete payload[`${cognitiveLevelKey}[${item}]`];
          if (ret.indexOf(str) < 0) {
            ret.push(str)
          } else {
            message.warning('认知层次选择存在重复');
            isRepeat = true
            break;
          }
        }
        if (isRepeat) {
          return;
        }
        payload[cognitiveLevelKey] = ret.join(';');//处理认知层次id;

        QContent[cognitiveLevelKey] = payload[cognitiveLevelKey];
      }


      // 知识维度
      if (payload && payload[knowledgeDimensionKey]) {
        payload[knowledgeDimensionKey] = convertIds(payload[knowledgeDimensionKey]);//处理知识维度id
        // QContent.SknowIds = QContent.knowIds;
        QContent[knowledgeDimensionKey] = payload[knowledgeDimensionKey];
      } else {
        // QContent.SknowIds = QContent.knowIds;
        let ret = [];
        for (const item of initialKnowledgeDimension) {
          let str = payload[`${knowledgeDimensionKey}[${item}]`].join(",");
          delete payload[`${knowledgeDimensionKey}[${item}]`];
          if (ret.indexOf(str) < 0) {
            ret.push(str)
          } else {
            message.warning('知识维度选择存在重复');
            isRepeat = true
            break;
          }
        }
        if (isRepeat) {
          return;
        }
        payload[knowledgeDimensionKey] = ret.join(';');//处理知识维度id;

        QContent[knowledgeDimensionKey] = payload[knowledgeDimensionKey];
      }

      payload.backstage = 1;//前台默认传1
      payload.isSetParam = 2;//该题是否设置知识点 0否 1是，2：所有参数完成（已点四要素保存）
    } else {
      // 考试数据入库设置分数 - 2021年05月20日
      QContent.SquestionScore = QContent.questionScore;
      QContent.questionScore = payload.questionScore
    }
    QContent.Sdifficulty = QContent.difficulty;
    QContent.difficulty = payload.difficulty
    setQContent(QContent)
    // console.log('payload===', payload)
    updateQuestionParameter(payload, QContent)
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const formItemsRenderList = comePage && comePage == 'setParam' ? [2, 3, 4, 5] : comePage === 'uploadData' ? [1] : [1, 2, 3, 4, 5];
  return (
    <div className={styles['set-arameter']}>
      <Form onFinish={onSubmitFinish} layout="inline">
        {/* <FormItem label="题号">
          <span style={{ marginTop: '-6.5px' }}>{QContent && QContent.id ? QContent.id : ''}</span>
        </FormItem> */}
        {
          comePage && comePage == 'setParam' ?
            <FormItem label="知识点">
              <span style={{ marginTop: '-6.5px' }}>{QContent && QContent.knowName ? QContent.knowName : '暂无'}</span>
            </FormItem>
            // null
            : <FormItem
              label="难度"
              name={'difficulty'}
              initialValue={QContent && QContent.difficulty ? QContent.difficulty : undefined}
              // validator={validateToDifficulty}
              rules={[{
                required: true,
                message: "请输入难度值",
              }]}
            >
              <InputNumber style={{ width: 160 }} placeholder="请输入难度值" min={0} max={1} step={0.05} />
            </FormItem>
        }

        {//2021年05月06日 上传考试数据页面 uploadData
          comePage === 'uploadData' ?
            <FormItem label="分数"
              name={'questionScore'}
              initialValue={QContent && QContent.questionScore ? QContent.questionScore : undefined}
              rules={[{
                required: true,
                message: "请输入分数",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const tempValue = getFieldValue('questionScore');
                  if (((tempValue > 0 && (tempValue < 100 || tempValue == 100)) || tempValue == 0) && (tempValue < 100 || tempValue == 100) && tempValue == value) {
                    return Promise.resolve();
                  }
                  if (tempValue !== 0 && !tempValue) {
                    return Promise.reject();
                  }
                  return Promise.reject(new Error('分数必须是大于等于0 小于等于100的数字'));
                },
              }),
              ]}
            >
              <InputNumber style={{ width: 160 }} placeholder="请输入分数" min={0} max={100} step={0.5} />
            </FormItem> : null
        }

        {
          formItemsRenderList.map(item => [formItemsRender(item),
          <FormItem key={'form-item'}>
            <Button type="dashed" onClick={() => { add(item) }} className={styles['add-knowledge']}>
              <PlusOutlined />
            </Button>
          </FormItem>])
        }


        {/* <div>
          {formItemsRender(2)}
          <FormItem >
            <Button type="dashed" onClick={() => { add(2) }} className={styles['add-knowledge']}>
              <PlusOutlined />
            </Button>
          </FormItem>
       </div> */}

        {/* {formItemsRender(3)}
        <FormItem >
          <Button type="dashed" onClick={() => { add(3) }} className={styles['add-knowledge']}>
            <PlusOutlined />
          </Button>
        </FormItem>

        {formItemsRender(4)}
        <FormItem >
          <Button type="dashed" onClick={() => { add(4) }} className={styles['add-knowledge']}>
            <PlusOutlined />
          </Button>
        </FormItem> */}

        <FormItem>
          <Button style={{ marginRight: '8px' }} type="primary" htmlType="submit">保存参数</Button>
        </FormItem>
      </Form>
    </div>
  )
}
SetParameterForm.propTypes = {
  QContent: PropTypes.any,
  knowledgeList: PropTypes.any,
  version: PropTypes.any,
  updateQuestionParameter: PropTypes.func,
  otherParam: PropTypes.object
};
export default SetParameterForm
