/**
* 试题板
* @author:张江
* @date:2020年08月29日
* @version:v1.0.0
* @updateAuthor:张江
* @updateVersion:v1.1.0
* @updateDate:2020年11月04日
* @description 更新描述:动态获取题型列表 渲染材料题目 可上下移动题型进行排序
* @updateDate:2023年11月27日
* @description 更新描述:修复保存出现的问题
* */
import react, { Component } from 'react'
import {
  Radio,
  TreeSelect,
  Input,
  InputNumber,
  Message,
  Empty,
  Modal,
  Tag,
  Spin,
  Table,
  Button,
  Tree,
  Transfer
} from 'antd';
import { connect } from "dva";
import { routerRedux } from 'dva/router';
import queryString from 'qs';
import classNames from 'classnames';
import { HeartOutlined, HeartFilled, FrownOutlined } from '@ant-design/icons';

import Page from "@/components/Pages/page";
import styles from './index.less'
import TopicContent from "@/components/TopicContent/TopicContent";
import RenderMaterialAndQuestion from "@/components/RenderMaterialAndQuestion/index";//渲染题目材料以及题目或者题目
import ParametersArea from '@/components/QuestionBank/ParametersArea';//
import BackBtns from "@/components/BackBtns/BackBtns";
import {
  ManualCombination,
  PaperBoard as namespace,
  HomeIndex,
  Auth,
  QuestionBank,
  MyQuestionTemplate,
  SchoolQuestionTemplate,
  Public
} from '@/utils/namespace'
import {
  getPageQuery,
  dealQuestionfieldIdOrName,
  existArr,
  calQuestionNum,
  calibrationScore,
  getIcon, openNotificationWithIcon, uppercaseNum, validatingSpecialCharacters,
  save2NumAfterPoint,
  pushNewPage
} from "@/utils/utils";
import userCache from "@/caches/userInfo";
import { myRegExp, permissionVisibleList, collectionType } from "@/utils/const";
// import DifficultStatisticsChart from "../components/chart/difficultStatisticsChart";
import BarTwo from '../components/chart/barTwo.js';
// import renderAnswerAnalysis from "@/components/RenderAnswerAnalysis/index";//渲染题目答案与解析部分
// import SetParameterModal from "../components/SetParameterModal/index";
import WrongQuestionMatchModal from "../components/WrongQuestionMatchModal/index";//相似题匹配
import EvalTargetModal from "../components/EvalTargetModal/index";//添加测评目标弹窗
import TopicGroupAnalysis from "../components/TopicGroupAnalysis";//题组分析弹窗
import ErrorCorrectionModal from "@/components/QuestionBank/ErrorCorrectionModal";
import paperBoardInfoCache from "@/caches/generalCacheByKey";//优化-试题版参数缓存-2021年07月23日-张江

const IconFont = getIcon();
const { confirm } = Modal;

// const columns = [
//   {
//     title: '题型',
//     dataIndex: 'bigTopicType',
//     key: 'bigTopicType',
//   },
//   {
//     title: '题目量（占比）',
//     dataIndex: 'topicRate',
//     key: 'topicRate',
//   },
//   {
//     title: '分值（占比）',
//     dataIndex: 'scoreRate',
//     key: 'scoreRate',
//   },
//   {
//     title: '综合难度',
//     dataIndex: 'comprehensiveDifficulty',
//     key: 'comprehensiveDifficulty',
//   },
// ];
// //组题分析====>知识点统计表格的表头
// const knowledgeColumns = [
//   {
//     title: '题号',
//     dataIndex: 'serialNumber',
//     key: 'serialNumber',
//   },
//   {
//     title: '知识点',
//     dataIndex: 'knowNames',
//     key: 'knowNames',
//     render(text) {
//       return text ? text.split(',').map((knowName, index) => <Tag key={index} color={"#2db7f5"}>{knowName}</Tag>) : '-';
//     }
//   },
//   {
//     title: '分值',
//     dataIndex: 'score',
//     key: 'score',
//   },
//   {
//     title: '难度',
//     dataIndex: 'difficulty',
//     key: 'difficulty',
//   },
// ]

const schoolList = [
  {
    "id": 15613,
    "name": "数与代数",
    "parentId": 0,
    "level": 1,
    "studyId": 1,
    "updateTime": 1586488407000,
    "detailId": "15613",
    "subjectId": null,
    "targetNum": null,
    "knowledges": null,
    "child": [
      {
        "id": 15618,
        "name": "数的认识",
        "parentId": 15613,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488409000,
        "detailId": "15613,15618",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15651,
            "name": "整数的认识",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488424000,
            "detailId": "15613,15618,15651",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15911,
                "name": "整数与自然数的认识",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089033000,
                "detailId": "15613,15618,15651,15911",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 3,
                "difficultyName": "0.4",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15912,
                "name": "整数的读法和写法",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089033000,
                "detailId": "15613,15618,15651,15912",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 2,
                "difficultyName": "0.6",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15913,
                "name": "整数大小的比较",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089033000,
                "detailId": "15613,15618,15651,15913",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15914,
                "name": "因数与倍数",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089033000,
                "detailId": "15613,15618,15651,15914",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15919,
                "name": "2、3、5倍数的特征",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089033000,
                "detailId": "15613,15618,15651,15919",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15920,
                "name": "奇数与偶数",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089033000,
                "detailId": "15613,15618,15651,15920",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16926,
                "name": "公因数与最大公因数、公倍数与最小公倍数",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15618,15651,16926",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16927,
                "name": "质数与合数、合数分解质因数",
                "parentId": 15651,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15618,15651,16927",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15652,
            "name": "数的整除",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1587089067000,
            "detailId": "15613,15618,15652",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15653,
            "name": "近似数",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488425000,
            "detailId": "15613,15618,15653",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15922,
                "name": "整数的改写与近似数",
                "parentId": 15653,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089136000,
                "detailId": "15613,15618,15653,15922",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 4,
                "difficultyName": "0.2",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15923,
                "name": "小数的近似数",
                "parentId": 15653,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089136000,
                "detailId": "15613,15618,15653,15923",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15654,
            "name": "小数的认识",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488425000,
            "detailId": "15613,15618,15654",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15924,
                "name": "小数的读写、意义及分类",
                "parentId": 15654,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089174000,
                "detailId": "15613,15618,15654,15924",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15925,
                "name": "小数的性质及改写",
                "parentId": 15654,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089174000,
                "detailId": "15613,15618,15654,15925",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15926,
                "name": "小数点位置的移动",
                "parentId": 15654,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089174000,
                "detailId": "15613,15618,15654,15926",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16928,
                "name": "小数大小的比较、小数和分数的互化",
                "parentId": 15654,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15618,15654,16928",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15655,
            "name": "分数和百分数的认识",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488426000,
            "detailId": "15613,15618,15655",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15929,
                "name": "分数的意义、读写及分类",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089189000,
                "detailId": "15613,15618,15655,15929",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15930,
                "name": "倒数的认识",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089189000,
                "detailId": "15613,15618,15655,15930",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15931,
                "name": "分数的基本性质",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089189000,
                "detailId": "15613,15618,15655,15931",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15932,
                "name": "带分数、假分数、真分数",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089189000,
                "detailId": "15613,15618,15655,15932",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15935,
                "name": "分数大小的比较",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089189000,
                "detailId": "15613,15618,15655,15935",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15936,
                "name": "百分数的读写、意义及应用",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089189000,
                "detailId": "15613,15618,15655,15936",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16929,
                "name": "通分与约分、最简分数",
                "parentId": 15655,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15618,15655,16929",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16930,
            "name": "负数、数轴的认识",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15618,16930",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 4,
            "difficultyName": "0.2",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16931,
            "name": "相反数的意义、数级、数位和计数单位",
            "parentId": 15618,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15618,16931",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15619,
        "name": "数的运算",
        "parentId": 15613,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488409000,
        "detailId": "15613,15619",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15660,
            "name": "整数的四则运算",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488428000,
            "detailId": "15613,15619,15660",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15946,
                "name": "整数四则混合运算",
                "parentId": 15660,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15660,15946",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15947,
                "name": "整数的运算律与简便计算",
                "parentId": 15660,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15660,15947",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16932,
                "name": "进位加法、退位减法及整数的加法、减法",
                "parentId": 15660,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15660,16932",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16933,
                "name": "表内、整数乘法",
                "parentId": 15660,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15660,16933",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16934,
                "name": "表内、整数除法",
                "parentId": 15660,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15660,16934",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16935,
                "name": "有余数的除法及乘法与除法的互逆关系",
                "parentId": 15660,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15660,16935",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15661,
            "name": "分数的四则运算",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488428000,
            "detailId": "15613,15619,15661",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15948,
                "name": "分数的加、减法",
                "parentId": 15661,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15661,15948",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15949,
                "name": "分数乘法",
                "parentId": 15661,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15661,15949",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 3,
                "difficultyName": "0.4",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15950,
                "name": "分数除法",
                "parentId": 15661,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15661,15950",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15951,
                "name": "单位“1”的确定",
                "parentId": 15661,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15661,15951",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16936,
                "name": "分数的乘、除法的混合运算及分数的四则混合运算",
                "parentId": 15661,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15661,16936",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16937,
                "name": "分数、百分数的计算",
                "parentId": 15661,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15661,16937",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15662,
            "name": "小数的四则运算",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488429000,
            "detailId": "15613,15619,15662",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15956,
                "name": "小数的加法和减法",
                "parentId": 15662,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15662,15956",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15957,
                "name": "小数的乘法",
                "parentId": 15662,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15662,15957",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15958,
                "name": "小数的除法",
                "parentId": 15662,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15662,15958",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15959,
                "name": "小数的四则运算及法则",
                "parentId": 15662,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15662,15959",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 15960,
                "name": "小数的简便运算",
                "parentId": 15662,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089224000,
                "detailId": "15613,15619,15662,15960",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15663,
            "name": "口算",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488429000,
            "detailId": "15613,15619,15663",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16938,
                "name": "整数、分数、小数的口算与估算",
                "parentId": 15663,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15619,15663,16938",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 3,
                "difficultyName": "0.4",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15666,
            "name": "小数、分数、百分数、比的互相转换",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1587089224000,
            "detailId": "15613,15619,15666",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16939,
            "name": "运算定律与简便运算、数的简单估算",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15619,16939",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16940,
            "name": "整数、小数、分数、百分数的四则混合运算及整除的性质与应用",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15619,16940",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16941,
            "name": "和 、差、积、商的变化规律",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15619,16941",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16942,
            "name": "算盘的认识与使用及计算器与复杂的运算",
            "parentId": 15619,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15619,16942",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15620,
        "name": "应用题",
        "parentId": 15613,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488410000,
        "detailId": "15613,15620",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15674,
            "name": "简单应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488434000,
            "detailId": "15613,15620,15674",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 15965,
                "name": "整数简单应用题",
                "parentId": 15674,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089626000,
                "detailId": "15613,15620,15674,15965",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16943,
                "name": "公因数、公倍数、小数加法、减法、小数乘法、除法应用题",
                "parentId": 15674,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15674,16943",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 3,
                "difficultyName": "0.4",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15675,
            "name": "复合应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488435000,
            "detailId": "15613,15620,15675",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16944,
                "name": "整数、小数、百分数、分数复合应用题",
                "parentId": 15675,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15675,16944",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15676,
            "name": "列方程解应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488435000,
            "detailId": "15613,15620,15676",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16945,
                "name": "列方程解应用题（含两步需要逆思考、解三步应用题、有两个未知数）",
                "parentId": 15676,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15676,16945",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15677,
            "name": "分数应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488436000,
            "detailId": "15613,15620,15677",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16946,
                "name": "分数加、减、乘、除应用题及四则复合应用题",
                "parentId": 15677,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15677,16946",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15678,
            "name": "百分数应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488436000,
            "detailId": "15613,15620,15678",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16947,
                "name": "百分数的简单、复合、实际应用题",
                "parentId": 15678,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15678,16947",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15679,
            "name": "列比例解应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488436000,
            "detailId": "15613,15620,15679",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16948,
                "name": "列比例解应用题（比与比例、按比例分配、正比例、反比例、比例尺）",
                "parentId": 15679,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15679,16948",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15680,
            "name": "面积、体积相关应用题",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488437000,
            "detailId": "15613,15620,15680",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16949,
                "name": "面积、体积相关应用题（三角形、平行四边形、长方形、正方形、梯形、圆等）",
                "parentId": 15680,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15680,16949",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15681,
            "name": "常考题型",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488437000,
            "detailId": "15613,15620,15681",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16950,
                "name": "简单应用题（提问题、填条件、图文、归一）及行程、工程问题",
                "parentId": 15681,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15681,16950",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16951,
                "name": "商品经济、和差倍数、排列与组合、数字编码应用题",
                "parentId": 15681,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15681,16951",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 1,
                "difficultyName": "0.8",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15682,
            "name": "数学广角",
            "parentId": 15620,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488438000,
            "detailId": "15613,15620,15682",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16952,
                "name": "搭配、推理、集合、优化问题",
                "parentId": 15682,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15682,16952",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16953,
                "name": "鸡兔同笼、植树、找次品、数与形、抽屉问题",
                "parentId": 15682,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15620,15682,16953",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15621,
        "name": "量与计量",
        "parentId": 15613,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488410000,
        "detailId": "15613,15621",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15683,
            "name": "时间",
            "parentId": 15621,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488438000,
            "detailId": "15613,15621,15683",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16954,
                "name": "时、分、秒、年、月、日的认识及换算",
                "parentId": 15683,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15621,15683,16954",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16955,
                "name": "时间的读法、计算、推算及判定方法",
                "parentId": 15683,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15621,15683,16955",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15692,
            "name": "面积、体积、容积的单位及换算",
            "parentId": 15621,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488442000,
            "detailId": "15613,15621,15692",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16017,
                "name": "面积和面积单位",
                "parentId": 15692,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488599000,
                "detailId": "15613,15621,15692,16017",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16018,
                "name": "面积单位间的进率及单位换算",
                "parentId": 15692,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488599000,
                "detailId": "15613,15621,15692,16018",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16019,
                "name": "体积、容积及其单位",
                "parentId": 15692,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488600000,
                "detailId": "15613,15621,15692,16019",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16020,
                "name": "体积、容积单位进率及换算",
                "parentId": 15692,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488601000,
                "detailId": "15613,15621,15692,16020",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16956,
            "name": "货币、人民币及其常用单位与单位换算",
            "parentId": 15621,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15621,16956",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16957,
            "name": "长度、长度的常用单位及换算、单位间进率及换算与生活中的计量单位",
            "parentId": 15621,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15621,16957",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15622,
        "name": "式与方程",
        "parentId": 15613,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488411000,
        "detailId": "15613,15622",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15693,
            "name": "用字母表示数",
            "parentId": 15622,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488442000,
            "detailId": "15613,15622,15693",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 2,
            "difficultyName": "0.6",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15694,
            "name": "含有字母式子的求值",
            "parentId": 15622,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488443000,
            "detailId": "15613,15622,15694",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 4,
            "difficultyName": "0.2",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16958,
            "name": "等式、方程的意义及性质与需要满足的条件",
            "parentId": 15622,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15622,16958",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16959,
            "name": "方程的解与解方程、方程的检验、方程与等式的关系",
            "parentId": 15622,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15613,15622,16959",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15623,
        "name": "比和比例",
        "parentId": 15613,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488411000,
        "detailId": "15613,15623",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15701,
            "name": "比",
            "parentId": 15623,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488446000,
            "detailId": "15613,15623,15701",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16021,
                "name": "比的意义",
                "parentId": 15701,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488601000,
                "detailId": "15613,15623,15701,16021",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 4,
                "difficultyName": "0.2",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16025,
                "name": "比值与化简比",
                "parentId": 15701,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488603000,
                "detailId": "15613,15623,15701,16025",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16960,
                "name": "比的性质、读法、写法及各部分的名称与比与分数、除法的关系",
                "parentId": 15701,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15623,15701,16960",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15702,
            "name": "比例",
            "parentId": 15623,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488447000,
            "detailId": "15613,15623,15702",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16961,
                "name": "比例的意义及性质、比与比例的区别与联系",
                "parentId": 15702,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15623,15702,16961",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16962,
                "name": "正比例和反比例与辨识、解比例",
                "parentId": 15702,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15623,15702,16962",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15703,
            "name": "比和比例的应用",
            "parentId": 15623,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488447000,
            "detailId": "15613,15623,15703",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16963,
                "name": "比与比例的应用",
                "parentId": 15703,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15613,15623,15703,16963",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      }
    ],
    "difficultyInt": 5,
    "difficultyName": "0.5",
    "score": null,
    "expertGroupLeaderId": null
  },
  {
    "id": 15614,
    "name": "空间与图形",
    "parentId": 0,
    "level": 1,
    "studyId": 1,
    "updateTime": 1586488407000,
    "detailId": "15614",
    "subjectId": null,
    "targetNum": null,
    "knowledges": null,
    "child": [
      {
        "id": 15624,
        "name": "平面图形的认识",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488412000,
        "detailId": "15614,15624",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15707,
            "name": "平行与垂直的特征、性质",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488449000,
            "detailId": "15614,15624,15707",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15708,
            "name": "角的概念及分类",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488450000,
            "detailId": "15614,15624,15708",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15715,
            "name": "三角形",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488453000,
            "detailId": "15614,15624,15715",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16964,
            "name": "平面图形的认识及分类与直线、射线、线段的认识及两点间线段最短与两点间的距离",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15624,16964",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16965,
            "name": "线段与角的综合、四边形、梯形的认识、特征及分类",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15624,16965",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16966,
            "name": "平行四边形、长方形、正方形的特征及性质",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15624,16966",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16967,
            "name": "圆、圆环、弧、圆心角、扇形、立体图形的认识及分类",
            "parentId": 15624,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15624,16967",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15625,
        "name": "立体图形的认识",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488412000,
        "detailId": "15614,15625",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15719,
            "name": "从不同的方向观察物体或几何体",
            "parentId": 15625,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488454000,
            "detailId": "15614,15625,15719",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 4,
            "difficultyName": "0.2",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15720,
            "name": "长方体的特征",
            "parentId": 15625,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488455000,
            "detailId": "15614,15625,15720",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 4,
            "difficultyName": "0.2",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15721,
            "name": "正方体的特征",
            "parentId": 15625,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488455000,
            "detailId": "15614,15625,15721",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16969,
            "name": "圆柱、圆锥的特征及长方体、正方体、圆柱的展开图",
            "parentId": 15625,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15625,16969",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15626,
        "name": "周长公式",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488413000,
        "detailId": "15614,15626",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 16970,
            "name": "长方形、正方形的周长",
            "parentId": 15626,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15626,16970",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16971,
            "name": "梯形、三角形、圆、组合图形的周长及长度、周长的估算",
            "parentId": 15626,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15626,16971",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15627,
        "name": "面积公式",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488413000,
        "detailId": "15614,15627",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15734,
            "name": "长方形、正方形的面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488461000,
            "detailId": "15614,15627,15734",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15735,
            "name": "平行四边形的面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488462000,
            "detailId": "15614,15627,15735",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15736,
            "name": "三角形的面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488462000,
            "detailId": "15614,15627,15736",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 3,
            "difficultyName": "0.4",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15738,
            "name": "圆的面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488463000,
            "detailId": "15614,15627,15738",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15741,
            "name": "面积及面积大小的比较",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488465000,
            "detailId": "15614,15627,15741",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15743,
            "name": "长方体、正方体的表面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488466000,
            "detailId": "15614,15627,15743",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16972,
            "name": "梯形、圆环、扇形及组合图形的面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15627,16972",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 3,
            "difficultyName": "0.4",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16973,
            "name": "组合体的表面积、不规则图形面积的估算、圆柱的侧面积、表面积",
            "parentId": 15627,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15627,16973",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15628,
        "name": "体积公式",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488414000,
        "detailId": "15614,15628",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15747,
            "name": "长方体、正方体的体积",
            "parentId": 15628,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488467000,
            "detailId": "15614,15628,15747",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15748,
            "name": "圆柱的体积",
            "parentId": 15628,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488468000,
            "detailId": "15614,15628,15748",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16974,
            "name": "圆锥的体积及其他不规则物理的体积算法",
            "parentId": 15628,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15628,16974",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15629,
        "name": "图形的拼组",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488414000,
        "detailId": "15614,15629",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 16975,
            "name": "图形的切拼、密铺及折叠问题",
            "parentId": 15629,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15629,16975",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15630,
        "name": "图形与变换",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488415000,
        "detailId": "15614,15630",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15762,
            "name": "轴对称图形的辨别",
            "parentId": 15630,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488474000,
            "detailId": "15614,15630,15762",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15763,
            "name": "平移与平移现象",
            "parentId": 15630,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488475000,
            "detailId": "15614,15630,15763",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15764,
            "name": "旋转与旋转现象",
            "parentId": 15630,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488475000,
            "detailId": "15614,15630,15764",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16976,
            "name": "轴、镜面对称与对称轴的条数及位置",
            "parentId": 15630,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15630,16976",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16977,
            "name": "图形的放大与缩小、旋转及观察范围",
            "parentId": 15630,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15630,16977",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15631,
        "name": "位置与方向",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488415000,
        "detailId": "15614,15631",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15770,
            "name": "观察物体",
            "parentId": 15631,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488478000,
            "detailId": "15614,15631,15770",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15771,
            "name": "方向",
            "parentId": 15631,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488478000,
            "detailId": "15614,15631,15771",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16979,
            "name": "路线图、根据方向和距离确定物体位置",
            "parentId": 15631,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15631,16979",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16980,
            "name": "比例尺、图上距离与实际距离的换算",
            "parentId": 15631,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15614,15631,16980",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15632,
        "name": "测量与作图",
        "parentId": 15614,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488415000,
        "detailId": "15614,15632",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15776,
            "name": "长度的测量方法",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488480000,
            "detailId": "15614,15632,15776",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15777,
            "name": "估测",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488481000,
            "detailId": "15614,15632,15777",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15778,
            "name": "角的度量",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488481000,
            "detailId": "15614,15632,15778",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15779,
            "name": "画指定度数的角",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488482000,
            "detailId": "15614,15632,15779",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15780,
            "name": "作轴对称图形",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488482000,
            "detailId": "15614,15632,15780",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15781,
            "name": "画对称轴",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488483000,
            "detailId": "15614,15632,15781",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15782,
            "name": "作平移后的图形",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488483000,
            "detailId": "15614,15632,15782",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15783,
            "name": "作旋转一定角度后的图形",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488484000,
            "detailId": "15614,15632,15783",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15784,
            "name": "应用比例尺画图",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488484000,
            "detailId": "15614,15632,15784",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15785,
            "name": "运用平移、对称、旋转设计图案",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488485000,
            "detailId": "15614,15632,15785",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15786,
            "name": "过直线外一点画平行线",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488485000,
            "detailId": "15614,15632,15786",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15787,
            "name": "过直线上或直线外一点作垂线",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488486000,
            "detailId": "15614,15632,15787",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15788,
            "name": "画指定周长的平面图形",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488486000,
            "detailId": "15614,15632,15788",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15789,
            "name": "画指定面积的平面图形",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488487000,
            "detailId": "15614,15632,15789",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15790,
            "name": "画圆",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488487000,
            "detailId": "15614,15632,15790",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15791,
            "name": "作梯形的高",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488487000,
            "detailId": "15614,15632,15791",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15792,
            "name": "作平行四边形的高",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488488000,
            "detailId": "15614,15632,15792",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15793,
            "name": "作三角形的高",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488488000,
            "detailId": "15614,15632,15793",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15794,
            "name": "作简单图形的三视图",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488489000,
            "detailId": "15614,15632,15794",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15795,
            "name": "作最短线路图",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488489000,
            "detailId": "15614,15632,15795",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15796,
            "name": "画指定长、宽（边长）的平面图形",
            "parentId": 15632,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488490000,
            "detailId": "15614,15632,15796",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      }
    ],
    "difficultyInt": 5,
    "difficultyName": "0.5",
    "score": null,
    "expertGroupLeaderId": null
  },
  {
    "id": 15615,
    "name": "统计和概率",
    "parentId": 0,
    "level": 1,
    "studyId": 1,
    "updateTime": 1586488408000,
    "detailId": "15615",
    "subjectId": null,
    "targetNum": null,
    "knowledges": null,
    "child": [
      {
        "id": 15633,
        "name": "统计",
        "parentId": 15615,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488416000,
        "detailId": "15615,15633",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15800,
            "name": "平均数、中位数、众数",
            "parentId": 15633,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488492000,
            "detailId": "15615,15633,15800",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16982,
                "name": "平均数、中位数、众数的意义及求法、异同及应用",
                "parentId": 15800,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15615,15633,15800,16982",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 3,
                "difficultyName": "0.4",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15801,
            "name": "统计图",
            "parentId": 15633,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488492000,
            "detailId": "15615,15633,15801",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16038,
                "name": "统计图的认识与选择",
                "parentId": 15801,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089695000,
                "detailId": "15615,15633,15801,16038",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16039,
                "name": "简单条形统计图",
                "parentId": 15801,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089695000,
                "detailId": "15615,15633,15801,16039",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16040,
                "name": "简单折线统计图",
                "parentId": 15801,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089695000,
                "detailId": "15615,15633,15801,16040",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16983,
                "name": "复式条形、复式折线统计图",
                "parentId": 15801,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15615,15633,15801,16983",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16984,
                "name": "扇形统计图及统计图的绘制",
                "parentId": 15801,
                "level": 4,
                "studyId": 1,
                "updateTime": 1591667247000,
                "detailId": "15615,15633,15801,16984",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15802,
            "name": "统计表",
            "parentId": 15633,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488493000,
            "detailId": "15615,15633,15802",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16045,
                "name": "简单统计表",
                "parentId": 15802,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089695000,
                "detailId": "15615,15633,15802,16045",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16046,
                "name": "复式统计表",
                "parentId": 15802,
                "level": 4,
                "studyId": 1,
                "updateTime": 1587089695000,
                "detailId": "15615,15633,15802,16046",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16981,
            "name": "简单的排列、组合、事物的比较、排列与分类、数据的搜集与整理",
            "parentId": 15633,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15615,15633,16981",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16985,
            "name": "统计图表的填补、综合分析、解释与应用",
            "parentId": 15633,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15615,15633,16985",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15634,
        "name": "可能性",
        "parentId": 15615,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488416000,
        "detailId": "15615,15634",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15805,
            "name": "事件的确定性与不确定性",
            "parentId": 15634,
            "level": 3,
            "studyId": 1,
            "updateTime": 1587089695000,
            "detailId": "15615,15634,15805",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15808,
            "name": "游戏规则的公平性",
            "parentId": 15634,
            "level": 3,
            "studyId": 1,
            "updateTime": 1587089695000,
            "detailId": "15615,15634,15808",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 3,
            "difficultyName": "0.4",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16986,
            "name": "可能性的大小、概率的认识",
            "parentId": 15634,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15615,15634,16986",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 1,
            "difficultyName": "0.8",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 16987,
            "name": "简单事件发生的可能性求解及生活中的概率",
            "parentId": 15634,
            "level": 3,
            "studyId": 1,
            "updateTime": 1591667247000,
            "detailId": "15615,15634,16987",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      }
    ],
    "difficultyInt": 5,
    "difficultyName": "0.5",
    "score": null,
    "expertGroupLeaderId": null
  },
  {
    "id": 15616,
    "name": "探索规律",
    "parentId": 0,
    "level": 1,
    "studyId": 1,
    "updateTime": 1586488408000,
    "detailId": "15616",
    "subjectId": null,
    "targetNum": null,
    "knowledges": null,
    "child": [
      {
        "id": 15635,
        "name": "算术中的规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488417000,
        "detailId": "15616,15635",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 4,
        "difficultyName": "0.2",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15636,
        "name": "数字排列的规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488417000,
        "detailId": "15616,15636",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 1,
        "difficultyName": "0.8",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15637,
        "name": "式子的规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488418000,
        "detailId": "15616,15637",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15638,
        "name": "图形的变化规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488418000,
        "detailId": "15616,15638",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 2,
        "difficultyName": "0.6",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15639,
        "name": "数表中的规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488419000,
        "detailId": "15616,15639",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15640,
        "name": "简单间隔、周期规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488419000,
        "detailId": "15616,15640",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 3,
        "difficultyName": "0.4",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15641,
        "name": "简单覆盖规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488420000,
        "detailId": "15616,15641",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15642,
        "name": "通过操作实验探索规律",
        "parentId": 15616,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488420000,
        "detailId": "15616,15642",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": null,
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      }
    ],
    "difficultyInt": 5,
    "difficultyName": "0.5",
    "score": null,
    "expertGroupLeaderId": null
  },
  {
    "id": 15617,
    "name": "数学竞赛",
    "parentId": 0,
    "level": 1,
    "studyId": 1,
    "updateTime": 1586488409000,
    "detailId": "15617",
    "subjectId": null,
    "targetNum": null,
    "knowledges": null,
    "child": [
      {
        "id": 15643,
        "name": "计算",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488420000,
        "detailId": "15617,15643",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15812,
            "name": "加减法的速算与巧算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488497000,
            "detailId": "15617,15643,15812",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 4,
            "difficultyName": "0.2",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15813,
            "name": "乘除法的速算与巧算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488497000,
            "detailId": "15617,15643,15813",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15814,
            "name": "小数的速算与巧算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488498000,
            "detailId": "15617,15643,15814",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15815,
            "name": "分数的速算与巧算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488498000,
            "detailId": "15617,15643,15815",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15816,
            "name": "四则混合运算的速算与巧算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488498000,
            "detailId": "15617,15643,15816",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15817,
            "name": "分数裂项",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488499000,
            "detailId": "15617,15643,15817",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15818,
            "name": "繁分数",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488499000,
            "detailId": "15617,15643,15818",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15819,
            "name": "循环小数",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488500000,
            "detailId": "15617,15643,15819",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15820,
            "name": "乘方相关",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488500000,
            "detailId": "15617,15643,15820",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15821,
            "name": "高斯取整",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488501000,
            "detailId": "15617,15643,15821",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15822,
            "name": "错中求解",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488501000,
            "detailId": "15617,15643,15822",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15823,
            "name": "等差数列",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488502000,
            "detailId": "15617,15643,15823",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15824,
            "name": "高斯求和",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488502000,
            "detailId": "15617,15643,15824",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15825,
            "name": "等差数列的应用",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488503000,
            "detailId": "15617,15643,15825",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15826,
            "name": "等比数列",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488503000,
            "detailId": "15617,15643,15826",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15827,
            "name": "斐波那契数列",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488504000,
            "detailId": "15617,15643,15827",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15828,
            "name": "简单的数字找规律",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488504000,
            "detailId": "15617,15643,15828",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15829,
            "name": "数表规律及计算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488505000,
            "detailId": "15617,15643,15829",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15830,
            "name": "乘积的个位数",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488505000,
            "detailId": "15617,15643,15830",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15831,
            "name": "比较大小",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488506000,
            "detailId": "15617,15643,15831",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15832,
            "name": "估计与估算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488506000,
            "detailId": "15617,15643,15832",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15833,
            "name": "定义新运算",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488507000,
            "detailId": "15617,15643,15833",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15834,
            "name": "页码问题",
            "parentId": 15643,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488507000,
            "detailId": "15617,15643,15834",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15644,
        "name": "算式谜，数阵，进位制",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488421000,
        "detailId": "15617,15644",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15835,
            "name": "巧填运算符号",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488507000,
            "detailId": "15617,15644,15835",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 4,
            "difficultyName": "0.2",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15836,
            "name": "24点",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488508000,
            "detailId": "15617,15644,15836",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15837,
            "name": "竖式数字谜",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488508000,
            "detailId": "15617,15644,15837",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16047,
                "name": "文字竖式",
                "parentId": 15837,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488615000,
                "detailId": "15617,15644,15837,16047",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16048,
                "name": "字母竖式",
                "parentId": 15837,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488615000,
                "detailId": "15617,15644,15837,16048",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15838,
            "name": "横式数字谜",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488509000,
            "detailId": "15617,15644,15838",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15839,
            "name": "河图洛书",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488509000,
            "detailId": "15617,15644,15839",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15840,
            "name": "幻方问题",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488510000,
            "detailId": "15617,15644,15840",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15841,
            "name": "数阵问题",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488510000,
            "detailId": "15617,15644,15841",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15842,
            "name": "进位制问题",
            "parentId": 15644,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488511000,
            "detailId": "15617,15644,15842",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15645,
        "name": "数论",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488421000,
        "detailId": "15617,15645",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15843,
            "name": "数字问题",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488511000,
            "detailId": "15617,15645,15843",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15844,
            "name": "数字和问题",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488512000,
            "detailId": "15617,15645,15844",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15845,
            "name": "数的奇偶性",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488512000,
            "detailId": "15617,15645,15845",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16049,
                "name": "认识奇数和偶数",
                "parentId": 15845,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488616000,
                "detailId": "15617,15645,15845,16049",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16050,
                "name": "奇数偶数的应用",
                "parentId": 15845,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488616000,
                "detailId": "15617,15645,15845,16050",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16051,
                "name": "奇偶性的分析",
                "parentId": 15845,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488617000,
                "detailId": "15617,15645,15845,16051",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15846,
            "name": "质数与合数",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488512000,
            "detailId": "15617,15645,15846",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15847,
            "name": "分解质因数",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488513000,
            "detailId": "15617,15645,15847",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15848,
            "name": "因数与倍数",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488513000,
            "detailId": "15617,15645,15848",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15849,
            "name": "公因数与公倍数",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488514000,
            "detailId": "15617,15645,15849",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15850,
            "name": "约数个数与约数和定理",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488514000,
            "detailId": "15617,15645,15850",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15851,
            "name": "整数的裂项与拆分",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488515000,
            "detailId": "15617,15645,15851",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15852,
            "name": "位值原理",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488515000,
            "detailId": "15617,15645,15852",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15853,
            "name": "整除的性质",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488516000,
            "detailId": "15617,15645,15853",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15854,
            "name": "带余除法",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488516000,
            "detailId": "15617,15645,15854",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15855,
            "name": "余数的性质",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488517000,
            "detailId": "15617,15645,15855",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15856,
            "name": "余数的计算",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488517000,
            "detailId": "15617,15645,15856",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15857,
            "name": "同余定理",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488518000,
            "detailId": "15617,15645,15857",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15858,
            "name": "孙子定理（中国剩余定理）",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488518000,
            "detailId": "15617,15645,15858",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15859,
            "name": "完全平方数性质",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488519000,
            "detailId": "15617,15645,15859",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15860,
            "name": "等量关系与方程",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488519000,
            "detailId": "15617,15645,15860",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15861,
            "name": "二元一次方程组",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488520000,
            "detailId": "15617,15645,15861",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15862,
            "name": "不定方程的分析求解",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488520000,
            "detailId": "15617,15645,15862",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15863,
            "name": "不等方程的分析求解",
            "parentId": 15645,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488521000,
            "detailId": "15617,15645,15863",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15646,
        "name": "计数",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488422000,
        "detailId": "15617,15646",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15864,
            "name": "分类数图形",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488521000,
            "detailId": "15617,15646,15864",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15865,
            "name": "立体图形计数",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488522000,
            "detailId": "15617,15646,15865",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15866,
            "name": "加法原理",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488522000,
            "detailId": "15617,15646,15866",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15867,
            "name": "乘法原理",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488523000,
            "detailId": "15617,15646,15867",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15868,
            "name": "排列组合",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488523000,
            "detailId": "15617,15646,15868",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15869,
            "name": "容斥原理",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488524000,
            "detailId": "15617,15646,15869",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15870,
            "name": "抽屉问题",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488524000,
            "detailId": "15617,15646,15870",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15871,
            "name": "递推法计数",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488525000,
            "detailId": "15617,15646,15871",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15872,
            "name": "对应法计数",
            "parentId": 15646,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488525000,
            "detailId": "15617,15646,15872",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15647,
        "name": "几何图形相关问题",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488422000,
        "detailId": "15617,15647",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15873,
            "name": "平面几何",
            "parentId": 15647,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488525000,
            "detailId": "15617,15647,15873",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16052,
                "name": "基础图形的认识",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488617000,
                "detailId": "15617,15647,15873,16052",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16053,
                "name": "长度和角度",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488618000,
                "detailId": "15617,15647,15873,16053",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16054,
                "name": "巧求周长",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488618000,
                "detailId": "15617,15647,15873,16054",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16055,
                "name": "巧求面积",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488619000,
                "detailId": "15617,15647,15873,16055",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16056,
                "name": "格点与面积",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488619000,
                "detailId": "15617,15647,15873,16056",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16057,
                "name": "勾股定理",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488620000,
                "detailId": "15617,15647,15873,16057",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16058,
                "name": "六大模型",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488620000,
                "detailId": "15617,15647,15873,16058",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16059,
                "name": "图形的变化与对称性",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488621000,
                "detailId": "15617,15647,15873,16059",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16060,
                "name": "动手剪与拼",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488622000,
                "detailId": "15617,15647,15873,16060",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16061,
                "name": "图形的分与合",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488622000,
                "detailId": "15617,15647,15873,16061",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16062,
                "name": "七巧板",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488623000,
                "detailId": "15617,15647,15873,16062",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16063,
                "name": "圆和扇形",
                "parentId": 15873,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488623000,
                "detailId": "15617,15647,15873,16063",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15874,
            "name": "立体几何",
            "parentId": 15647,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488526000,
            "detailId": "15617,15647,15874",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16064,
                "name": "多角度观察",
                "parentId": 15874,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488624000,
                "detailId": "15617,15647,15874,16064",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16065,
                "name": "立体图形的展开",
                "parentId": 15874,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488624000,
                "detailId": "15617,15647,15874,16065",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16066,
                "name": "表面积相关问题",
                "parentId": 15874,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488625000,
                "detailId": "15617,15647,15874,16066",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16067,
                "name": "体积相关问题",
                "parentId": 15874,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488625000,
                "detailId": "15617,15647,15874,16067",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16068,
                "name": "圆锥和圆柱",
                "parentId": 15874,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488626000,
                "detailId": "15617,15647,15874,16068",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15648,
        "name": "行程问题",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488423000,
        "detailId": "15617,15648",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15875,
            "name": "多次相遇问题",
            "parentId": 15648,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488527000,
            "detailId": "15617,15648,15875",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15876,
            "name": "接送问题",
            "parentId": 15648,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488527000,
            "detailId": "15617,15648,15876",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15877,
            "name": "行程中的变速及平均速度问题",
            "parentId": 15648,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488528000,
            "detailId": "15617,15648,15877",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15878,
            "name": "间隔发车问题",
            "parentId": 15648,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488528000,
            "detailId": "15617,15648,15878",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15879,
            "name": "扶梯问题",
            "parentId": 15648,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488529000,
            "detailId": "15617,15648,15879",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15649,
        "name": "竞赛应用题",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488423000,
        "detailId": "15617,15649",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15880,
            "name": "一般应用题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488529000,
            "detailId": "15617,15649,15880",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15881,
            "name": "归一问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488530000,
            "detailId": "15617,15649,15881",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15882,
            "name": "平均数问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488530000,
            "detailId": "15617,15649,15882",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15883,
            "name": "等量代换",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488531000,
            "detailId": "15617,15649,15883",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15884,
            "name": "倒推还原问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488531000,
            "detailId": "15617,15649,15884",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15885,
            "name": "工程问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488532000,
            "detailId": "15617,15649,15885",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15886,
            "name": "间隔问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488532000,
            "detailId": "15617,15649,15886",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16069,
                "name": "排队问题",
                "parentId": 15886,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488627000,
                "detailId": "15617,15649,15886,16069",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16070,
                "name": "阵列问题",
                "parentId": 15886,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488627000,
                "detailId": "15617,15649,15886,16070",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16071,
                "name": "上楼问题",
                "parentId": 15886,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488628000,
                "detailId": "15617,15649,15886,16071",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15887,
            "name": "周期问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488532000,
            "detailId": "15617,15649,15887",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16072,
                "name": "简单周期问题",
                "parentId": 15887,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488628000,
                "detailId": "15617,15649,15887,16072",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16073,
                "name": "隐藏周期",
                "parentId": 15887,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488629000,
                "detailId": "15617,15649,15887,16073",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16074,
                "name": "多重周期",
                "parentId": 15887,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488629000,
                "detailId": "15617,15649,15887,16074",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15888,
            "name": "鸡兔同笼",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488533000,
            "detailId": "15617,15649,15888",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16075,
                "name": "画图法解鸡兔同笼",
                "parentId": 15888,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488630000,
                "detailId": "15617,15649,15888,16075",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16076,
                "name": "假设法解鸡兔同笼",
                "parentId": 15888,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488631000,
                "detailId": "15617,15649,15888,16076",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16077,
                "name": "分组法解鸡兔同笼",
                "parentId": 15888,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488631000,
                "detailId": "15617,15649,15888,16077",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15889,
            "name": "年龄问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488533000,
            "detailId": "15617,15649,15889",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15890,
            "name": "牛吃草问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488534000,
            "detailId": "15617,15649,15890",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15891,
            "name": "盈亏问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488534000,
            "detailId": "15617,15649,15891",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15892,
            "name": "分数与百分数应用题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488535000,
            "detailId": "15617,15649,15892",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15893,
            "name": "比例应用题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488535000,
            "detailId": "15617,15649,15893",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15894,
            "name": "利润和折扣问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488536000,
            "detailId": "15617,15649,15894",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15895,
            "name": "利息、纳税",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488536000,
            "detailId": "15617,15649,15895",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15896,
            "name": "浓度问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488537000,
            "detailId": "15617,15649,15896",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15897,
            "name": "最优化问题",
            "parentId": 15649,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488537000,
            "detailId": "15617,15649,15897",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      },
      {
        "id": 15650,
        "name": "数学趣题",
        "parentId": 15617,
        "level": 2,
        "studyId": 1,
        "updateTime": 1586488423000,
        "detailId": "15617,15650",
        "subjectId": null,
        "targetNum": null,
        "knowledges": null,
        "child": [
          {
            "id": 15898,
            "name": "火柴棒游戏",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488538000,
            "detailId": "15617,15650,15898",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15899,
            "name": "有趣的找规律",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488538000,
            "detailId": "15617,15650,15899",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15900,
            "name": "最值问题",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488538000,
            "detailId": "15617,15650,15900",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15901,
            "name": "趣题巧解",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488539000,
            "detailId": "15617,15650,15901",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15902,
            "name": "最佳策略问题",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488539000,
            "detailId": "15617,15650,15902",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15903,
            "name": "一笔画问题",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488540000,
            "detailId": "15617,15650,15903",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15904,
            "name": "最短路线问题",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488540000,
            "detailId": "15617,15650,15904",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15905,
            "name": "重叠问题",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488541000,
            "detailId": "15617,15650,15905",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15906,
            "name": "钟面与时间",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488542000,
            "detailId": "15617,15650,15906",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15907,
            "name": "有趣的骰子",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488542000,
            "detailId": "15617,15650,15907",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15908,
            "name": "哈密尔顿圈与哈密尔顿链",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488543000,
            "detailId": "15617,15650,15908",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": null,
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15909,
            "name": "天平上的数学",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488543000,
            "detailId": "15617,15650,15909",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16078,
                "name": "天平称重",
                "parentId": 15909,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488632000,
                "detailId": "15617,15650,15909,16078",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16079,
                "name": "天平辨伪",
                "parentId": 15909,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488632000,
                "detailId": "15617,15650,15909,16079",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": null,
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          },
          {
            "id": 15910,
            "name": "逻辑推理",
            "parentId": 15650,
            "level": 3,
            "studyId": 1,
            "updateTime": 1586488544000,
            "detailId": "15617,15650,15910",
            "subjectId": null,
            "targetNum": null,
            "knowledges": null,
            "child": [
              {
                "id": 16080,
                "name": "简单推理",
                "parentId": 15910,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488633000,
                "detailId": "15617,15650,15910,16080",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": [],
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16081,
                "name": "列表推理",
                "parentId": 15910,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488633000,
                "detailId": "15617,15650,15910,16081",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": [],
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              },
              {
                "id": 16082,
                "name": "复杂推理",
                "parentId": 15910,
                "level": 4,
                "studyId": 1,
                "updateTime": 1586488634000,
                "detailId": "15617,15650,15910,16082",
                "subjectId": null,
                "targetNum": null,
                "knowledges": null,
                "child": [],
                "difficultyInt": 5,
                "difficultyName": "0.5",
                "score": null,
                "expertGroupLeaderId": null
              }
            ],
            "difficultyInt": 5,
            "difficultyName": "0.5",
            "score": null,
            "expertGroupLeaderId": null
          }
        ],
        "difficultyInt": 5,
        "difficultyName": "0.5",
        "score": null,
        "expertGroupLeaderId": null
      }
    ],
    "difficultyInt": 5,
    "difficultyName": "0.5",
    "score": null,
    "expertGroupLeaderId": null
  }
]

let scoreTemp = undefined//当前设置的题目分数暂存变量
let paperBoardInfoCacheKEY = '';//优化-试题版参数缓存KEY-2021年07月23日-张江
@connect(state => ({
  topicList: state[namespace].topicList,
  loading: state[namespace].loading,
  changeTopicList: state[ManualCombination].topicList,//待替换的题目列表
  changeTopicListLoading: state[ManualCombination].loading,
  analysisData: state[namespace].analysisData,//组题分析数据
  authButtonList: state[Auth].authButtonList,//按钮权限数据
}))
export default class PaperBoard extends Component {

  constructor(props) {
    super(...arguments);
    const query = getPageQuery()
    this.state = {
      collectedTopics: [],//已收藏的题目
      roleInfo: userCache(),
      topicsCount: 0,//题目总数
      totalScore: undefined,//保存操作的请求参数，总分
      paperType: query.paperType || undefined,//保存操作的请求参数，试卷类型
      topics: [],//保存操作的请求参数,所有题目
      topicScore: {},//用于存放每个题目分数的对象，用于给题目添加分数以及显示分数时方便取值，key：采用 下划线加题目id，如：{_2182:5,_2145:10}
      topicTypeTotalScores: [],//体型总分

      targetTopic: undefined,//换题操作---》即将被替换的题目
      toggleTopicModalIsShow: false,//换一题的弹框显示状态
      combinationAnalysisModalIsShow: false,//组题分析弹框显示状态
      repeatTotalNum: undefined,//可以用于替换的题目总数目
      setScoreModalIsShow: false,//设置分数弹框的显示状态
      setScoreData: [],//设置分数弹框表格的数据


      // isSetParameterModal: false,//是否显示设置参数弹窗-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留

      questionInfo: null,//需要设参的题目信息-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留
      isWrongQuestionMatchModal: false,//

      selectedChangeKnowId: '',//换一题添加知识点切换-2021年02月01日加-张江-已选中知识点id
      selectedChangeKnowList: [],//换一题添加知识点切换-2021年02月01日加-张江-待选择知识点列表

      permissionVisible: '3',//20210427新加 设置权限可见
      questionTemplateValue: '', // 试题模板值，前2位表示模板归属，01 学校模板 02 我的模板，后10位为唯一字符串，需要截取
      questionTemplateTreeData: [], // 试题模板树形数据
      paperNameValue: '', // 试卷名称
      templateList: [], // 模板列表
      knowledgePointTreeData: [], // 知识点树形数据
      knowledgePointValue: '', // 知识点值
      paperId: query.paperId || undefined,
      selectedChoolDataSource: [
        {
          key: '1',
          province: '贵州省',
          city: '贵阳市',
          county: '观山湖区',
          school: '1贵阳一中',
        },
        {
          key: '2',
          province: '贵州省',
          city: '贵阳市',
          county: '观山湖区',
          school: '2贵阳一中',
        },
        {
          key: '3',
          province: '贵州省',
          city: '贵阳市',
          county: '观山湖区',
          school: '3观山湖区贵阳一中',
        },
        {
          key: '4',
          province: '贵州省',
          city: '贵阳市',
          county: '观山湖区',
          school: '4观山湖区贵阳一中',
        },
        {
          key: '5',
          province: '贵州省',
          city: '贵阳市',
          county: '观山湖区',
          school: '5观山湖区贵阳一中',
        },
        {
          key: '6',
          province: '贵州省',
          city: '贵阳市',
          county: '观山湖区',
          school: '6观山湖区贵阳一中',
        },
      ], // 已选学校列表数据源
      selectedChoolColumns: [
        {
          title: '省份',
          dataIndex: 'province',
          key: 'province',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '市',
          dataIndex: 'city',
          key: 'city',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '区/县',
          dataIndex: 'county',
          key: 'county',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '学校',
          dataIndex: 'school',
          key: 'school',
          align: 'center',
          ellipsis: true,
        },
      ], // 已选学校列表列数据
      isShowSelectSchoolModal: false, // 是否显示选择学校弹窗
      treeSelectedSchoolKeys: [],
      isMultiple: true,
      selectedTransferKeys: [],
      targetTransferKeys: [],
      transferDataSource: []
    }
  }


  /**
   * 渲染树节点，禁用非叶子节点
   * @param {*} data 模板数据
   * @param {*} level 记录层级
   */
  renderTreeNodes = (data, level = 0) => {
    return data.map((item) => {
      // 叶子节点 且 必须是第三层模板层
      if ((!item.children || item.children.length === 0) && level === 2) {
        return <TreeSelect.TreeNode value={item.value} title={item.title} isLeaf={true} />
      }
      // 非叶子节点
      return (
        <TreeSelect.TreeNode value={item.value} title={item.title} selectable={false}>
          {this.renderTreeNodes(item.children, level + 1)}
        </TreeSelect.TreeNode>
      )
    })
  }

  /**
   * 选择试题模板
   * @param {*} value 试题模板
   */
  onQuestionTemplateSelect = (value) => {
    const paperTemplateIdStr = value.slice(0, -10)
    const paperTemplateIdType = Number(paperTemplateIdStr.slice(0, 2))
    const paperTemplateId = Number(paperTemplateIdStr.slice(2))
    this.getTemplateDetail(paperTemplateIdType, paperTemplateId)
    this.setState({ questionTemplateValue: value })
  }
  /**
 * 选择知识点
 * @param {*} value 知识点
 */
  oneKnowledgePointSelect = (value) => {
    this.setState({ knowledgePointValue: value })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const role = JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.code
    const classId = JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.classId
    const schoolId = JSON.parse(sessionStorage.getItem("gougou-front-userInfo"))?.v?.v?.schoolId
    const { roleInfo = {} } = this.state;
    // 获取模板列表
    dispatch({
      type: namespace + '/getQuestionTemplateTreeData',
      payload: {
        role,
        classId,
        schoolId
      },
      callback: res => this.setState({ questionTemplateTreeData: res.data.children })
    })
    // 获取知识点列表
    console.log(roleInfo, "用户信息")
    dispatch({
      type: namespace + '/getVersionKnowledgePoints',
      payload: {
        version: roleInfo && roleInfo.versionId
      },
      callback: (res) => {
        this.setState({
          knowledgePointTreeData: res.map((item) => {
            return {
              title: item.name,
              value: item.id,
              disabled:true,
              children: item.childList ? item.childList.map((childItem) => {
                return {
                  title: childItem.name,
                  value: childItem.id,
                  children: childItem.childList ? childItem.childList.map((subChildItem) => {
                    return {
                      title: subChildItem.name,
                      value: subChildItem.id,
                    };
                  }) : null
                };
              }) : null
            };
          })
        });

      }
    })

    if (roleInfo.subjectId) {//2020年12月29日加-张江
      this.getFourElementsList(roleInfo.subjectId)
    }
    /** ********************************************************* 优化-试题板参数显示 start author:张江 date:2021年07月23日 *************************************************************************/
    paperBoardInfoCacheKEY = `${roleInfo.account}-${roleInfo.gradeId}-${roleInfo.classId}-${roleInfo.subjectId}`;
    const paperBoardInfo = paperBoardInfoCache(paperBoardInfoCacheKEY, null) || {};
    const query = getPageQuery();
    if (paperBoardInfo.paperType) {
      this.setState({
        paperType: query.paperType || paperBoardInfo.paperType,//保存操作的请求参数，试卷类型
      })
    }
    if (paperBoardInfo.permissionVisible) {
      this.setState({
        permissionVisible: paperBoardInfo.permissionVisible || '3',//20210427新加 设置权限可见
      })
    }
    // if (paperBoardInfo.paperName) {
    //   setTimeout(() => {
    // 		this.refs.paperNameInput.state.value = query.paperName || paperBoardInfo.paperName //设置名称-2021年01月05日-张江
    // 	}, 0)
    // }

    if (query.paperName) {
      this.setState({ paperNameValue: query.paperName }) // 设置试卷名称
    }

    dispatch({
      type: namespace + '/getGroupCenterPaperBoard',
      callback: topicList => {
        this.setState(this.handleTopicsAndReturnNewStateObj(topicList, [], true))
      }
    })

    dispatch({
      type: Public + '/getAreaInfoList',
      payload: {},
      callback: (result) => {
        if (result && result.length > 0) {
          this.setState({ areaList: result })
        }
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { topicList: prevTopicList } = prevProps
    const { topicList: newTopicList } = this.props
    if (JSON.stringify(prevTopicList) !== JSON.stringify(newTopicList)) {
      this.setState(this.handleTopicsAndReturnNewStateObj(newTopicList))
    }
  }

  /**
 * 获取四要素列表-2020年12月30日加-张江-试题板设置参数
 */
  getFourElementsList = (subjectId) => {
    const {
      dispatch,
    } = this.props;
    /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 start author:张江 date:2020年12月29日 *************************************************************************/
    //根据科目筛选关键能力
    dispatch({
      type: QuestionBank + '/getQuestionAbilityList',
      payload: {
        subjectId: subjectId,
      },
    });
    //根据科目筛选核心素养
    dispatch({
      type: QuestionBank + '/getQuestionCompetenceList',
      payload: {
        subjectId: subjectId,
      },
    });
    //根据科目筛选认知层次
    dispatch({
      type: QuestionBank + '/getCognitionLevelList',
      payload: {
        subjectId: subjectId,
      },
    });
    /** ********************************************************* 四要素设参 核心素养 关键能力 认知层次 end author:张江 date:2020年12月29日 *************************************************************************/
    /** ********************************************************* 题库管理 知识维度查询 start author:张江 date:2022年05月20日 *************************************************************************/
    //知识维度查询
    dispatch({
      type: QuestionBank + '/getKnowledgeDimension',
      payload: {},
    });
    /** ********************************************************* 题库管理 知识维度查询 end author:张江 date:2022年05月10日 *************************************************************************/

  }


  /**
  * 统计试题板题目数量
  */
  getTestQuestionEdition = () => {
    this.props.dispatch({
      type: HomeIndex + '/getTestQuestionEdition',
      payload: {},
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: `${namespace}/set`,
      payload: {
        topicList: undefined
      }
    })
  }

  /**
   * 收藏题目
   *@topicId :题目id
   *@isCollect :是否收藏，true，收藏操作，false：取消收藏操作
   */
  collectTopic = (topicId, isCollect) => {
    const { dispatch } = this.props
    const { roleInfo } = this.state
    topicId ?
      isCollect ?
        dispatch({
          type: `${ManualCombination}/collectTopic`,
          payload: {
            // questionId: topicId,
            // subjectId: roleInfo.subjectId,
            itemId: topicId,
            type: collectionType.QUESTION.type
          },
          callback: data => {
            //收藏成功后，将当前的题目id添加到状态中
            let collectedTopics = [...this.state.collectedTopics]
            collectedTopics.push(topicId)
            this.setState({
              collectedTopics
            })
            Message.success(data && data.msg || "收藏成功！")
          }
        })
        :
        dispatch({
          type: `${ManualCombination}/cancleCollectTopic`,
          payload: {
            // questionId: topicId,
            // subjectId: roleInfo.subjectId,
            itemId: topicId,
            type: collectionType.QUESTION.type
          },
          callback: data => {
            //取消成功后，将当前的题目id从当前状态数据中移除
            let collectedTopics = [...this.state.collectedTopics]
            this.setState({
              collectedTopics: collectedTopics.filter(collectedTopicId => collectedTopicId !== topicId)
            })
            Message.success(data && data.msg || "取消成功！")
          }
        })
      : openNotificationWithIcon(
        'warning',
        '收藏失败！请稍后重试!',
        'rgba(0,0,0,.85)',
        '缺少题目id参数',
        2
      )
  }

  /**
   * 移除题目
   * @topicId:题目id
   * @tempId:试题板临时 id
   * @category:题目类型
   * */
  removeTopic = (topicId, tempId, category) => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认从试题板移除该题吗？',
      content: '',
      onOk() {
        dispatch({
          type: `${namespace}/remveTopic`,
          payload: {
            // questionId: topicId
            tempId,
          },
          callback: () => {
            //  移除成功后，从状态中复制一份题，并移除当前题，更新状态
            let topics = JSON.parse(JSON.stringify(_self.state.topics))
            topics.forEach(topicType => {
              if (topicType.category === category) {
                if (topicType.questionList) {
                  topicType.questionList = topicType.questionList.filter(topic => topic.id !== topicId)
                }
              }
            })
            _self.setState(_self.handleTopicsAndReturnNewStateObj(topics, [], false, true), _ => {
              _self.getTestQuestionEdition();
              Message.success("移除成功!")
            })
          }
        })
      },
      onCancel() { },
    });
  }


  /**
   * 处理获取到的数据，将需要统计的数据统计出来，并给每个题添加序号,并且返回新的可以用于修改状态的state
   * @param topics
   */
  handleTopicsAndReturnNewStateObj = (
    topics = [],
    templateList = [],
    isOrganize = false,
    reSequence = false
  ) => {
    let count = 0
    let qcount = 0
    let score = 0
    let topicTypeTotalScores = []
    let records = []//用于封装数据的，设置分数的弹框的所有题目记录
    // 根据模板规则，恢复小题或分割小题
    if (existArr(templateList)) {
      topics = this.restoreCategoryQuestionListByTemplate(topics, templateList)
    } else {
      topics = this.organizeCategoryQuestionList(topics, isOrganize)
    }
    if (reSequence) {
      topics = this.reSequenceCodeCategoryQuestionList(topics)
    }
    topics.forEach((topicType, topicTypeIndex) => {
      //定义变量统计当前体型的分数
      let topicTypeTotalScore = 0
      //遇到一个题目类型，创建一个对应的表格对象添加到 records 中
      if (topicType.questionList && topicType.questionList.length > 0) {
        records.push({
          serialNumber: topicType.name,
          sequenceCode: topicType.name,
          isTopicTypeTitle: true,
          topicTypeIndex,
          colSpan: 2,
          knowNames: '设置每道单题的分数'
        })
      }
      topicType.questionList && topicType.questionList.length > 0 && topicType.questionList.forEach((topic, index) => {
        if (parseFloat(topic.score)) {
          if (topic.sequenceCode) {
            const singleTopicScore = topic.sequenceCode.includes('-') ? 0 : parseFloat(topic.score)
            score += singleTopicScore
            topicTypeTotalScore += singleTopicScore
          } else {
            score += parseFloat(topic.score)
            topicTypeTotalScore += parseFloat(topic.score)
          }
        }
        // topic.serialNumber = ++count;
        //获取材料下子题的id 并处理分数
        if (existArr(topic.materialQuestionList)) {
          topic.materialQuestionList.map((item, tIndex) => {
            topic.serialNumber = ++qcount;
            item.serialNumber = topic.serialNumber
            //將題目添加到记录表格中
            records.push({
              id: item.id,
              parentId: item.parentId,
              tempId: item.tempId,
              serialNumber: item.serialNumber,
              sequenceCode: item.sequenceCode,
              knowNames: item.knowName,
              score: item.score,
              difficulty: item.difficulty,
              topicTypeIndex,
            })
          })
        } else {
          topic.serialNumber = ++qcount;
          //將題目添加到记录表格中
          records.push({
            id: topic.id,
            parentId: topic.parentId,
            tempId: topic.tempId,
            serialNumber: topic.serialNumber,
            sequenceCode: topic.sequenceCode,
            knowNames: topic.knowName,
            score: topic.score,
            difficulty: topic.difficulty,
            topicTypeIndex,
          })
        }
        // //將題目添加到记录表格中
        // records.push({
        //   id: topic.id,
        //   tempId: topic.tempId,
        //   serialNumber: topic.serialNumber,
        //   knowNames: topic.knowName,
        //   score: topic.score,
        //   difficulty: topic.difficulty,
        //   topicTypeIndex,
        //   materialQuestionList: topic.materialQuestionList,//材料下的子题
        // })
      })
      topicTypeTotalScores.push(topicTypeTotalScore)//将统计好的当前题型的总分添加到存放的数组中
    })
    records = this.createMergedDataSourceList(records)
    return { setScoreData: records, topicsCount: qcount, totalScore: score, topicTypeTotalScores, topics }
  }

  /**
   * 获取模板详情
   * @param {*} type 类型，1 学校 2 教师
   * @param {*} templateId 模板id
   */
  getTemplateDetail = (type, templateId) => {
    const { dispatch } = this.props
    if (type === 1) {
      // 获取学校模板详情
      dispatch({
        type: `${SchoolQuestionTemplate}/getSchoolTemplateDetail`,
        payload: { id: templateId },
        callback: res => {
          this.setState({ templateList: res.data.templateDetails }, () => {
            this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics, this.state.templateList))
          })
        }
      })
    } else if (type === 2) {
      // 获取我的模板详情
      dispatch({
        type: `${MyQuestionTemplate}/getMyTemplateDetail`,
        payload: { id: templateId },
        callback: res => {
          this.setState({ templateList: res.data.templateDetails }, () => {
            this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics, this.state.templateList))
          })
        }
      })
    }
  }

  /**
   * 通过 parentId 组织题目列表
   * @param {*} questionList 题目列表
   * @param {*} qCount 题目计数对象
   */
  organizeQuestionListByParentId = (questionList, qCount) => {
    const questionMap = new Map()
    const organizeMaterialQuestionList = (materialQuestionList, qCount) => {
      if (existArr(materialQuestionList)) {
        this.organizeQuestionListByParentId(materialQuestionList, qCount)
        materialQuestionList.forEach(materialQuestion => {
          if (existArr(materialQuestion.materialQuestionList)) {
            qCount = organizeMaterialQuestionList(materialQuestion.materialQuestionList, qCount)
          }
        })
      }
      return qCount
    }
    questionList.forEach(question => {
      questionMap.set(question.id, question)
      if (existArr(question.materialQuestionList)) {
        qCount = organizeMaterialQuestionList(question.materialQuestionList, qCount)
      } else if (!question.parentId) {
        question.childrenList = []
        question.sequenceCode = `${++qCount.count}`
      }
    })
    for (let i = questionList.length -1; i >= 0; i--) {
      if (questionList[i].parentId) {
        const parent = questionMap.get(questionList[i].parentId)
        if (parent) {
          const content = parent.content
          const lastIndex = content.lastIndexOf('<@>')
          if (lastIndex !== -1) {
            questionList[i].lastContent = content.slice(lastIndex + 3)
          }
          parent.childrenList.unshift(questionList[i])
          parent.childrenList.forEach((q, i) => {
            q.sequenceCode = `${parent.sequenceCode}-${i + 1}`
          })
          questionList.splice(i, 1)
        }
      }
    }
  }

  /**
   * 重新排序分类题目列表编号
   * @param {*} categoryQuestionList 分类题目列表
   * @returns 分类题目列表
   */
  reSequenceCodeCategoryQuestionList = (categoryQuestionList) => {
    const qCount = { count: 0 }
    const reSequenceCodeQuestionList = (questionList, qCount) => {
      const organizeMaterialQuestionList = (materialQuestionList, qCount) => {
        if (existArr(materialQuestionList)) {
          reSequenceCodeQuestionList(materialQuestionList, qCount)
          materialQuestionList.forEach(materialQuestion => {
            if (existArr(materialQuestion.materialQuestionList)) {
              qCount = reSequenceCodeQuestionList(materialQuestion.materialQuestionList, qCount)
            }
          })
        }
        return qCount
      }
      questionList.forEach(question => {
        if (existArr(question.materialQuestionList)) {
          qCount = organizeMaterialQuestionList(question.materialQuestionList, qCount)
        } else {
          if (!question.parentId) {
            question.sequenceCode = `${++qCount.count}`
            if (existArr(question.childrenList)) {
              question.childrenList.forEach((q, i) => {
                q.sequenceCode = `${question.sequenceCode}-${i + 1}`
              })
            }
            let childCode = 0
            questionList.forEach(q => {
              if (q.parentId === question.id) {
                childCode++
                q.sequenceCode = `${question.sequenceCode}-${childCode}`
              }
            })
          }
        }
      })
    }
    categoryQuestionList.forEach(categoryQuestion => {
      const questionList = categoryQuestion.questionList
      if (existArr(questionList)) {
        reSequenceCodeQuestionList(questionList, qCount)
      }
    })
    return categoryQuestionList
  }

  /**
   * 组织分类题目列表
   * @param {*} categoryQuestionList 分类题目列表
   * @param {*} isOrganize 是否组织
   * @returns 分类题目列表
   */
  organizeCategoryQuestionList = (categoryQuestionList, isOrganize) => {
    if (isOrganize) {
      const qCount = { count: 0 }
      categoryQuestionList.forEach(categoryQuestion => {
        const questionList = categoryQuestion.questionList
        if (existArr(questionList)) {
          this.organizeQuestionListByParentId(questionList, qCount)
        }
      })
    }
    return categoryQuestionList
  }

  /**
   * 通过题目子列表组织题目列表
   * @param {*} questionList 题目列表
   */
  organizeQuestionListByChildrenList = (questionList) => {
    if (!existArr(questionList)) return
    const isOnlyParentNode = questionList.every(question => !question.parentId)
    const clonedQuestionList = JSON.parse(JSON.stringify(questionList))
    questionList.forEach(question => {
      const id = question.id
      const childrenList = question.childrenList
      if (existArr(childrenList) && isOnlyParentNode) {
        const sIndex = clonedQuestionList.findIndex(question => question.id === id)
        clonedQuestionList.splice(sIndex + 1, 0, ...childrenList)
      }
    })
    questionList.length = 0
    questionList.push(...clonedQuestionList)
    questionList.forEach(question => {
      if (existArr(question.materialQuestionList)) {
        this.organizeQuestionListByChildrenList(question.materialQuestionList)
      }
    })
  }

   /**
   * 取消通过题目子列表组织题目列表
   * @param {*} questionList 题目列表
   */
  cancelOrganizeQuestionListByChildrenList = (questionList) => {
    if (!existArr(questionList)) return
    for (let i = questionList.length - 1; i >= 0; i--) {
      const question = questionList[i]
      const parentId = question.parentId
      const materialQuestionList = question.materialQuestionList
      if (parentId) {
        questionList.splice(i, 1)
      } else {
        if (existArr(materialQuestionList)) {
          this.cancelOrganizeQuestionListByChildrenList(materialQuestionList)
        }
      }
    }
  }

  /**
   * 通过模板列表恢复分类题目列表
   * @param {*} categoryQuestionList 分类题目列表
   * @param {*} templateList 模板列表
   * @returns 分类题目列表
   */
  restoreCategoryQuestionListByTemplate = (categoryQuestionList, templateList) => {
    const categoryMap = categoryQuestionList.reduce((acc, category) => (acc[category.name] = category, acc), {})
    templateList.forEach(template => {
      if (template.smallItem === 1) {
        // 分割小题小项
        const category = categoryMap[template.categoryName]
        if (category) {
          this.organizeQuestionListByChildrenList(category.questionList)
        }
      } else {
        // 取消分割
        const category = categoryMap[template.categoryName]
        if (category) {
          this.cancelOrganizeQuestionListByChildrenList(category.questionList)
        }
      }
    })
    return categoryQuestionList
  }

  /**
   * 创建合并数据源列表
   * @param {*} dataSourceList 数据源列表
   * @returns 合并数据源列表
   */
  createMergedDataSourceList = (dataSourceList) => {
    const hasSequenceCode = dataSourceList.every(el => el.sequenceCode)
    if (!hasSequenceCode) return dataSourceList
    const topicTypeList = []
    const mergedDataSourceList = []
    for (let i = dataSourceList.length - 1; i >= 0; i--) {
      if (dataSourceList[i]?.isTopicTypeTitle) {
        topicTypeList.push({k: i, v: dataSourceList.splice(i, 1)[0]})
      }
    }
    const topicGroupList = dataSourceList.reduce((acc, val) => {
      if (!acc[val.topicTypeIndex]) acc[val.topicTypeIndex] = []
      acc[val.topicTypeIndex].push(val)
      return acc
    }, [])
    topicGroupList.forEach(topicGroup => {
      const mergedTopicGroupList = topicGroup.filter(item => {
        return (!item.sequenceCode.includes('-') && !item.parentId)
      }).reduce((acc, val) => {
        const children = [val]
        topicGroup.forEach(item => {
          if (val.id === item.parentId) children.push(item)
        })
        acc = acc.concat(
          children.map((item, index) => ({
            ...item,
            rowSpan: index === 0 ? children.length : 0
          }))
        )
        return acc
      }, [])
      mergedDataSourceList.push(...mergedTopicGroupList)
    })
    mergedDataSourceList.sort((a, b) => a.serialNumber - b.serialNumber)
    if (topicTypeList.length > 0) {
      for (let i = topicTypeList.length - 1; i >= 0; i--) {
        mergedDataSourceList.splice(topicTypeList[i].k, 0, topicTypeList[i].v)
      }
    }
    return mergedDataSourceList
  }

  /**
   * 创建合并材料数据源列表
   * @param {*} materialDataSourceList 材料数据源列表
   * @returns 合并材料数据源列表
   */
  createMergedMaterialDataSourceList = (materialDataSourceList) => {
    const hasSequenceCode = materialDataSourceList.every(el => el.sequenceCode)
    if (!hasSequenceCode) return materialDataSourceList
    const topMaterialElem = materialDataSourceList.shift()
    topMaterialElem.knowName = '设置每道单题的分数'
    const mergedMaterialDataSourceList = []
    const mergedMaterialTopicList = materialDataSourceList.filter(item => {
      return (!item.sequenceCode.includes('-') && !item.parentId)
    }).reduce((acc, val) => {
      const children = [val]
      materialDataSourceList.forEach(item => {
        if (val.id === item.parentId) children.push(item)
      })
      acc = acc.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0
        }))
      )
      return acc
    }, [])
    mergedMaterialDataSourceList.push(...mergedMaterialTopicList)
    mergedMaterialDataSourceList.sort((a, b) => a.serialNumber - b.serialNumber)
    mergedMaterialDataSourceList.unshift(topMaterialElem)
    return mergedMaterialDataSourceList
  }

  /**
   * 打开/关闭 换题弹窗isShow,
   * @ isShow ：显示状态
   * @topic:需要替换的题目
   */
  toggleTopicModalState = (isShow, topic) => {
    const { dispatch, topicList = [] } = this.props
    //如果是打开弹窗，发送请求获取题目列表
    if (isShow) {
      // 换一题添加知识点切换 - 2021年02月01日加 - 张江 - 待选择知识点列表 start
      const selectedChangeKnowList = dealQuestionfieldIdOrName(topic);
      if (existArr(selectedChangeKnowList)) {
        const selectedId = selectedChangeKnowList[0].code
        // 换一题添加知识点切换 - 2021年02月01日加 - 张江 - 待选择知识点列表 end
        dispatch({
          type: `${ManualCombination}/getTopicList`,
          payload: {
            type: 2,//1.表示试题中心拉题；2.试题板换一题
            page: 1,
            size: 10,
            categoryStr: topic.category,
            // difficultIntStr: topic.difficulty,//题目难度
            knowIdStr: selectedId,//topic.knowIds,
            subjectId: topic.subjectId,
            status: 1
          },
          callback: data => {
            //更新状态，以便于在点击换一批的时候，计算随机页码
            this.setState({
              repeatTotalNum: data && data.total,
              selectedChangeKnowId: selectedId,
              selectedChangeKnowList,
            })
          }
        })
      }
    }
    let newState = {
      toggleTopicModalIsShow: isShow
    }
    if (topic) {
      topic.categoryName = this.getCategoryName(topicList, topic);//获取题型标题
      newState = { ...newState, targetTopic: topic }
    } else {
      newState = { ...newState, targetTopic: undefined }
    }
    this.setState(newState)
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

  /**
   * 打开/关闭  查看组题分析的弹框
   * @param isShow ：显示状态
   *
   */
  toggleAnalysisModalState = (isShow) => {
    const { topics } = this.state
    const { dispatch } = this.props
    //如果是打开弹窗，发送请求
    if (isShow) {
      //使用延时器，将内部的代码放到事件队列中执行，解决设置最后一道题分数后直接点击预览报告导致最后一道题分数没有设置的问题
      setTimeout(_ => {
        let noScoreTopics = []//定义数组，存放所有没有设置分数的题目序号
        //遍历数据，封装参数
        let topicList = []
        topics && topics.forEach(topicType => {
          topicType && topicType.questionList && topicType.questionList.forEach(topic => {
            if (existArr(topic.materialQuestionList)) {//获取材料下子题的id 并处理分数
              topic.materialQuestionList.map((item) => {
                if (item.id !== null && item.id !== undefined && item.id !== '' && item.score !== null && item.score !== undefined && item.score !== '' && item.score != 0) {
                  topicList.push({
                    id: item.id,
                    score: parseFloat(item.score),
                    code: item.serialNumber
                  })
                } else {
                  noScoreTopics.push(item.serialNumber)
                }
              })
            } else {
              if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score != 0) {
                topicList.push({
                  id: topic.id,
                  score: parseFloat(topic.score),
                  code: topic.serialNumber
                })
              } else {
                noScoreTopics.push(topic.serialNumber)
              }
            }
            // if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '') {
            //   topicList.push({
            //     id: topic.id,
            //     score: parseFloat(topic.score)
            //   })
            // } else {
            //   noScoreTopics.push(topic.serialNumber)
            // }
          })
        })
        if (noScoreTopics.length === 0) {
          this.setState({ combinationAnalysisModalIsShow: isShow })
          dispatch({
            type: `${namespace}/previewAnalysis`,
            payload: {
              question: topicList,
              type: 1,//1 表示还没有组成试卷之前（在试题板看到的题组分析），2：表示组成任务之后其他地方需要看这个任务的组题分析
            }
          })
        } else {
          openNotificationWithIcon(
            'warning',
            `请设置第 ${noScoreTopics.join("、")} 题的分数`,
            'rgba(0,0,0,.85)',
            '',
            4
          )
        }
      }, 0)
    } else {
      this.setState({ combinationAnalysisModalIsShow: isShow })
    }
  }

  /**
   * 打开/关闭   设置全部分数的弹框
   * @param isShow
   */
  toggleScoreModalState = (isShow, type) => {
    this.setState({ setScoreModalIsShow: type == 2 || !type ? !!isShow : true }, () => {
      const returnData = this.handleTopicsAndReturnNewStateObj(this.state.topics) || {}
      if (type == 1) {
        let setScoreData = returnData.setScoreData && returnData.setScoreData.filter((item) => item.id)
        let tempSetScoreData = []
        setScoreData && setScoreData.map((topic) => {
          //获取材料下子题的id 并处理分数
          if (existArr(topic.materialQuestionList)) {
            const tempScore = save2NumAfterPoint(Number(topic.score) / topic.materialQuestionList.length, 1)
            topic.materialQuestionList.map((item) => {
              let itemJson = { ...item, id: item.id, tempId: item.tempId, score: tempScore }
              tempSetScoreData.push(itemJson)
            })
          } else {
            tempSetScoreData.push(topic)
          }
        })
        this.saveScoreSetting(tempSetScoreData, false);
      }
    })
  }

  /**
   * 打开/关闭 设置材料下单个题的分数的弹框
   * @param isShow
   */
  toggleSingleScoreModalState = (isShow, type) => {
    const { singleTopic = {} } = this.state;
    this.setState({ isShowSingleTopic: type == 2 || !type ? !!isShow : true }, () => {
      if (type == 1) {
        let setScoreData = singleTopic.materialQuestionList && singleTopic.materialQuestionList.filter((item) => item.id);
        setScoreData = setScoreData && setScoreData.map((item) => {
          let itemJson = { ...item, id: item.id, tempId: item.tempId };
          return itemJson;
        })
        this.saveScoreSetting(setScoreData, true);
      }
    })
  }

  showSelectSchoolModalState = () => {
    this.setState({ isShowSelectSchoolModal: true })
  }

  hideSelectSchoolModal = () => {
    this.setState({ isShowSelectSchoolModal: false })
  }

  setSelectedSchool = () => {
    console.log('selected school')
  }

  /**
   * 渲染树形结构
   * @param data: 数据
   */
  renderSchoolTreeNodes = data => {
    return data && data.map(item => {
      if ((item.child && item.child.length > 0) || (item.childList && item.childList.length > 0)) {
        return {
          title: item.name,
          key: item.id,
          dataRef: item,
          selectable: false,
          children: this.renderSchoolTreeNodes(item.childList || item.child)
        }
      }
      return {
        title: item.name,
        key: item.id,
        dataRef: item,
        ...item,
        isLeaf: true
      }
    })
  }

  /**
   * 查找选中学校
   * @param {*} treeData 
   * @param {*} key 
   * @returns 
   */
  findNodeByKey = (treeData, key) => {
    for (const node of treeData) {
      if (node.id === key) return node
      if (node.child) {
        const result = this.findNodeByKey(node.child, key);
        if (result) return result
      }
    }
    return null
  }

  /**
   * 选择学校
   * @param selectedKeys：选中的id
   */
  onTreeSelect = (selectedKeys) => {
    if (!selectedKeys || selectedKeys.length < 1) return
    const selectedSchoolList = selectedKeys.map(key => {
      const school = this.findNodeByKey(schoolList, key)
      return {
        key: school.id,
        title: school.name
      }
    })
    console.log('selectedSchoolList', selectedSchoolList)
    this.setState({
      treeSelectedSchoolKeys: selectedKeys,
      transferDataSource: selectedSchoolList
    },()=> {
      console.log('selectedKeys: ', this.state.treeSelectedSchoolKeys)
    })
  }
  
  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    this.setState({ targetTransferKeys: nextTargetKeys })
  }

  onSelectTransferChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    this.setState({ selectedTransferKeys: [...sourceSelectedKeys, ...targetSelectedKeys] },()=>console.log('selectedTransferKeys:', this.state.selectedTransferKeys))
  }

  
  handleTransferSearch = (dir, value) => {
    console.log('search:', dir, value)
  }


  /**
   * 点击左侧导航题目选中时
   * @param topicId
   */
  selectTopic = (topicId, idString) => {
    const { topics } = this.state
    topics && topics.length > 0 && topics.forEach(topicType => {
      topicType && topicType.questionList && topicType.questionList.forEach(topic =>
        topicId === topic.id
          ? topic.isSelected = true
          : topic.isSelected = false
      )
    })
    this.setState({ topics });

    let offsetTop = document.getElementById(idString).offsetTop;
    offsetTop = offsetTop - 20;//计算可滚动的高度=
    window.scrollTo({//滚动的距离
      top: offsetTop < 0 ? 0 : offsetTop,
      behavior: "smooth"
    });
  }

  /**
   * 替换题目操作
   * @newTopic:用于替换的新题
   */
  replaceTopic(newTopic) {
    const { dispatch } = this.props
    const { targetTopic, topics } = this.state//从state中获取待换题和新题

    if (newTopic !== undefined && targetTopic !== undefined) {
      topics && topics.forEach(topicType => {
        topicType.questionList && topicType.questionList.forEach((topic, index) => {
          if (topic.id === targetTopic.id) {
            //将被替换的题目的tempid赋值给新的题目(解决，连续替换，替换时导致没有tempId无法替换的问题)
            newTopic.tempId = targetTopic.tempId
            topicType.questionList[index] = newTopic
            //三个参数不能为没值，为避免值为0的情况，所以单独判断undefined和null的情况（0可以通过条件）
            if (targetTopic.tempId !== undefined && targetTopic.tempId !== null && newTopic.id !== undefined && newTopic.id !== null && newTopic.category !== undefined && newTopic.category !== null) {
              dispatch({
                type: `${ManualCombination}/saveOptionQuestion`,
                payload: {
                  id: targetTopic.tempId,//即将被替换的题目在数据库表中的位置id
                  questionId: newTopic.id,
                  questionCategory: newTopic.category,
                },
                callback: _ => {
                  Message.success("替换成功!")
                  //替换成功后，将本地数据修改，更新页面
                  this.setState(this.handleTopicsAndReturnNewStateObj(topics, [], false, true), () => {
                    //关闭弹窗
                    this.toggleTopicModalState(false)
                  })
                }
              })
            } else {
              Message.error('替换失败！请稍后重试')
            }
          }
        })
      })
    }
  }

  /**
   * 随机换一页（换一批功能）
   */
  randomChange = () => {
    const { targetTopic, repeatTotalNum } = this.state
    const { dispatch, changeTopicList = {} } = this.props;
    let pageNum = Math.ceil(Math.random() * (repeatTotalNum / 10));

    // const { currentPage=1 } = changeTopicList
    // let pageNum = currentPage+1;//换一批 则是下一页
    // if (currentPage * 10 > repeatTotalNum){
    //   pageNum=1;
    // }
    // dispatch({
    //   type: `${ManualCombination}/getTopicList`,
    //   payload: {
    //     type: 2,//1.表示试题中心拉题；2.试题板换一题
    //     page: pageNum || 1,
    //     size: 10,
    //     categoryStr: targetTopic.category,
    //     // difficultIntStr: targetTopic.difficulty,//题目难度
    //     knowIdStr: selectedChangeKnowId,//targetTopic.knowIds,
    //     subjectId: targetTopic.subjectId,
    //     status: 1
    //   }
    // })
    this.getTopicListData(pageNum)
  }

  /**
  * 获取数据
  */
  getTopicListData = (pageNum) => {
    const { targetTopic, selectedChangeKnowId } = this.state
    const { dispatch } = this.props;
    dispatch({
      type: `${ManualCombination}/getTopicList`,
      payload: {
        type: 2,//1.表示试题中心拉题；2.试题板换一题
        page: pageNum,
        size: 10,
        categoryStr: targetTopic.category,
        // difficultIntStr: targetTopic.difficulty,//题目难度
        knowIdStr: selectedChangeKnowId,//targetTopic.knowIds,
        subjectId: targetTopic.subjectId,
        status: 1
      }
    })
  }
  /**
   * 设置试卷类型
   * @param e
   */
  setPaperType = (e) => {
    this.setPaperBoardInfoCache('paperType', e.target.value)
    this.setState({ paperType: e.target.value })
  }

  /**
  * 设置权限可见
  * @param e
  */
  setPermissionVisible = (e) => {
    this.setPaperBoardInfoCache('permissionVisible', e.target.value)
    this.setState({ permissionVisible: e.target.value })
  }

  /**
   * 切换是否可编辑的状态
   * @param topic 题目对象
   */
  toggleEditState = (topic) => {
    const { topics } = this.state;
    if (scoreTemp === undefined) {
      if (existArr(topic.materialQuestionList)) {
        this.dealMaterialQuestionScore(topic)
        this.setState({ isShowSingleTopic: true })
      } else {
        topic.isEdit = true
        this.setState({ topics })
      }
    }
  }


  /**
   * 设置单题分数
   * @param topic 题目对象
   * @param score 需要设置的分数
   * @param topicTypeIndex 当前单题所在的大题所在整张试卷数组的下标
   */
  setSingleItemScore = (topic, score, topicTypeIndex, type) => {
    const { topics, singleTopic = {} } = this.state
    let topicTypeKeyName = `topicTypeInput-${topicTypeIndex}`
    //如果分数为xxx. 的格式，自动处理，在末尾添加0
    score = calibrationScore(score)
    myRegExp.checkScoreFormat.lastIndex = 0;
    //需要保存的分数数据
    let saveDataScore = [];
    if (!topic.sequenceCode) {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '数据异常，请刷新页面重试！',
        3
      )
      scoreTemp = undefined
      return
    }
    if (Number(score) === 0) {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（不能设置0分）',
        3
      )
      scoreTemp = undefined
      return
    }
    if (score === '' || myRegExp.checkScoreFormat.test(score)) {
      topics && topics.forEach((topicType, topicTypeI) => {
        //定义一个变量，判断是否当前设置的分数和其他所有题的分数都一样，如果一样，在【每题（多少）分那儿也同步分数】
        let scoreIsSame = true
        topicType && topicType.questionList && topicType.questionList.forEach(topicItem => {
          //遍历查找需要设置分数的题，找到以后，直接设置分数
          if (existArr(topicItem.materialQuestionList)) {
            //处理材料下单题的情况
            let currentMaterialScroce = 0;
            topicItem.materialQuestionList.map((item) => {
              if (topic.id === item.id) {
                if (score !== '') {
                  item.score = score;
                  topicItem.materialQuestionList.forEach(v => {
                    if (
                      v.sequenceCode &&
                      v.sequenceCode.includes('-') &&
                      v.sequenceCode.startsWith(item.sequenceCode)
                    ) {
                      v.score = ''
                    }
                  })
                }
                item.isEdit = false
              } else {
                //如果遇到不同的分数，则说明存在不同的分数
                scoreIsSame = item.score === score
              }
              if (topicTypeIndex === item.serialNumber) {
                scoreIsSame
                  ? this.setState({ [topicTypeKeyName]: score })
                  : this.setState({ [topicTypeKeyName]: '' })
              }
              currentMaterialScroce += item?.sequenceCode.includes('-') ? 0 : Number(item.score)
            })
            topicItem.score = currentMaterialScroce;
            if (singleTopic && topicItem && singleTopic.id == topicItem.id) {
              this.dealMaterialQuestionScore(topicItem)
            }
          } else {
            if (topic.id === topicItem.id) {
              if (score !== '' && score != 0) {
                topicItem.score = score;
                topicType.questionList.forEach(v => {
                  if (
                    v.sequenceCode &&
                    v.sequenceCode.includes('-') &&
                    v.sequenceCode.startsWith(topicItem.sequenceCode)
                  ) {
                    v.score = ''
                  }
                })
              }
              topicItem.isEdit = false
            } else {
              //如果遇到不同的分数，则说明存在不同的分数
              scoreIsSame = topicItem.score === score
            }
          }
        })
        if (topicTypeIndex === topicTypeI) {
          scoreIsSame
            ? this.setState({ [topicTypeKeyName]: score })
            : this.setState({ [topicTypeKeyName]: '' })
        }
      })
      this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics), () => { scoreTemp = undefined })
      if (type == 1 || type == 2) return
      if (!existArr(saveDataScore)) {
        saveDataScore = [{ id: topic.id, tempId: topic.tempId, score }];
      }
      this.saveScoreSetting(saveDataScore, true);
    } else {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        3
      )
    }
  }

  /**
   * 设置小项分数
   */
  setSmallItemScore = (topic, score, type) => {
    const { topics, singleTopic = {} } = this.state
    score = calibrationScore(score)
    myRegExp.checkScoreFormat.lastIndex = 0
    let saveDataScore = [];
    const parentId = topic.parentId
    let parentScore = null
    let childrenTotalScore = null
    const childrenList = []
    if (Number(score) === 0) {
      openNotificationWithIcon(
        'warning',
        '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（不能设置0分）',
        3
      )
      scoreTemp = undefined
      return
    }
    if (myRegExp.checkScoreFormat.test(score)) {
      topics && topics.forEach((topicType) => {
        topicType && topicType.questionList && topicType.questionList.forEach(topicItem => {
          if (existArr(topicItem.materialQuestionList)) {
            topicItem.materialQuestionList.map((item) => {
              if (item.id === parentId) {
                parentScore = Number(item.score)
              }
              if (item.parentId === parentId) {
                childrenList.push(item)
              }
            })
          } else {
            if (topicItem.id === parentId) {
              parentScore = Number(topicItem.score)
            }
            if (topicItem.parentId === parentId) {
              childrenList.push(topicItem)
            }
          }
        })
      })
      if (!parentScore) {
        openNotificationWithIcon(
          'warning',
          '设置失败！',
          'rgba(0,0,0,.85)',
          '设置小项分数前请先设置单题分数',
          3
        )
        scoreTemp = undefined
        return
      }
      childrenTotalScore = childrenList.reduce((acc, val) => {
        const aScore = val.id === topic.id ? Number(score) : Number(val.score)
        return acc + (isNaN(aScore) ? 0 : aScore)
      }, 0)
      const isLastChild = childrenList
        .filter(v => v.id !== topic.id)
        .every(v => v.score)
      if (childrenTotalScore > parentScore) {
        openNotificationWithIcon(
          'warning',
          '设置失败！',
          'rgba(0,0,0,.85)',
          '小项分数之和不可超过单题分数',
          3
        )
        scoreTemp = undefined
        return
      }
      if (isLastChild && (childrenTotalScore !== parentScore)) {
        openNotificationWithIcon(
          'warning',
          '设置失败！',
          'rgba(0,0,0,.85)',
          '小项分数之和必须等于单题分数',
          3
        )
        scoreTemp = undefined
        return
      }
      topics && topics.forEach((topicType) => {
        topicType && topicType.questionList && topicType.questionList.forEach(topicItem => {
          if (existArr(topicItem.materialQuestionList)) {
            let currentMaterialScroce = 0;
            topicItem.materialQuestionList.map((item) => {
              if (topic.id === item.id) {
                if (score) item.score = score
                item.isEdit = false
              }
              currentMaterialScroce += item?.sequenceCode.includes('-') ? 0 : Number(item.score)
            })
            topicItem.score = currentMaterialScroce
            if (singleTopic && topicItem && singleTopic.id == topicItem.id) {
              this.dealMaterialQuestionScore(topicItem)
            }
          } else {
            if (topic.id === topicItem.id) {
              if (score) topicItem.score = score
              topicItem.isEdit = false
            }
          }
        })
      })
      this.setState(this.handleTopicsAndReturnNewStateObj(this.state.topics), () => { scoreTemp = undefined })
      if (type == 1 || type == 2) return
      if (!existArr(saveDataScore)) {
        saveDataScore = [{ id: topic.id, tempId: topic.tempId, score }];
      }
      this.saveScoreSetting(saveDataScore, true);
    } else {
      openNotificationWithIcon(
        'warning', '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        3
      )
    }
  }

  /**
   * 批量设置一类大题下的题目分数
   * @param topicTypeIndex ：当前设置的大题再整张试卷的索引
   * @param score：设置的分数
   */
  handleEveryTopicScoreAndReturnNewStateObj = (topicTypeIndex, score) => {
    const { topics } = this.state
    let newScore = calibrationScore(score)
    // 在全局匹配模式下
    // 对于同一个正则对象重复调用就会出现下一次的匹配位置从上一次匹配结束的位置开始,解决方法重置lastIndex为0
    myRegExp.checkScoreFormat.lastIndex = 0
    if (newScore === '' || myRegExp.checkScoreFormat.test(newScore + "")) {
      topics && topics.length > 0 && topics.forEach((topicType, index) => {
        //找到当前大题，将下面所有的小题分数设置为需要设置的分数
        if (index === topicTypeIndex) {
          let { questionList } = topicType
          questionList && questionList.length > 0 && questionList.forEach(topic => {
            //获取材料下子题的id 并处理分数
            if (existArr(topic.materialQuestionList)) {
              topic.materialQuestionList.map((item) => {
                if (!item.sequenceCode.includes('-')) {
                  item.score = newScore
                } else {
                  item.score = ''
                }
              })
              //统计材料下所有小题的分数
              topic.score = newScore * (topic.materialQuestionList.filter(v => !v.sequenceCode.includes('-')).length);
            } else {
              if (!topic.sequenceCode.includes('-')) {
                topic.score = newScore
              } else {
                topic.score = ''
              }
            }
          })
        }
      })
      return this.handleTopicsAndReturnNewStateObj(topics)
    } else {
      openNotificationWithIcon(
        'warning', '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        2
      )
    }
  }

  /**
  * 批量设置材料下单个题目分数
  * @param serialNumber ：题目在材料下的编号
  * @param score：设置的分数
  */
  handleSingleEveryTopicScoreAndReturnNewStateObj = (serialNumber, score) => {
    const { singleTopic, topics } = this.state
    let newScore = calibrationScore(score)
    // 在全局匹配模式下
    // 对于同一个正则对象重复调用就会出现下一次的匹配位置从上一次匹配结束的位置开始,解决方法重置lastIndex为0
    myRegExp.checkScoreFormat.lastIndex = 0
    if (newScore === '' || myRegExp.checkScoreFormat.test(newScore + "")) {
      //获取材料下子题的id 并处理分数
      if (singleTopic && existArr(singleTopic.materialQuestionList)) {
        singleTopic.score = 0
        singleTopic.materialQuestionList.map((item, index) => {
          if (!item.sequenceCode.includes('-')) {
            item.score = newScore
            if (index > 0) {
              singleTopic.score += Number(newScore)
            }
          } else {
            item.score = ''
          }
        })
      }
      //处理数据 重新渲染
      let isBreak = false;
      for (const topic of topics) {
        const { questionList = [] } = topic;
        for (const question of questionList) {
          if (singleTopic.id == question.id) {
            question.score = singleTopic.score;
            isBreak = true;
            question.materialQuestionList.map((item, index) => {
              if (!item.sequenceCode.includes('-')) {
                item.score = newScore
              } else {
                item.score = ''
              }
            })
            break;
          }
        }
        if (isBreak) {
          break;
        }
      }
      this.setState({ ...this.handleTopicsAndReturnNewStateObj(topics) })
      return singleTopic;
    } else {
      openNotificationWithIcon(
        'warning', '设置失败！',
        'rgba(0,0,0,.85)',
        '您当前输入的分数不合理（小数位后只能保留一位且是0或者5）',
        2
      )
    }
  }

  /**
   * 处理材料下题目的分数
   * @param question ：题目信息
   */
  dealMaterialQuestionScore = (question) => {
    if (existArr(question.materialQuestionList)) {
      const categoryName = question.materialQuestionList[0].categoryName || '材料题'
      let tempTopic = JSON.parse(JSON.stringify(question))
      tempTopic.materialQuestionList.unshift({
        isTopicTypeTitle: true,
        sequenceCode: categoryName,
        serialNumber: categoryName
      })
      tempTopic.materialQuestionList = this.createMergedMaterialDataSourceList(tempTopic.materialQuestionList)
      this.setState({ singleTopic: tempTopic })
    }
  }

  /**
   * 清空试题板
   */
  clearPaperBoard = () => {
    const { dispatch } = this.props;
    const _self = this;
    confirm({
      title: '确认清空试题板吗？',
      content: '',
      onOk() {
        dispatch({
          type: `${namespace}/clearPaperBoard`,
          callback: _ => {
            Message.success("试题板已清空")
            paperBoardInfoCache.clear(paperBoardInfoCacheKEY)
            _self.getTestQuestionEdition();
            //清空redux中的题目列表
            dispatch({
              type: `${namespace}/set`,
              payload: {
                topicList: undefined
              }
            })
          }
        })
      },
      onCancel() { },
    });
    // dispatch({
    //   type: `${namespace}/clearPaperBoard`,
    //   callback: _ => {
    //     Message.success("试题板已清空")
    //     this.getTestQuestionEdition();
    //     //清空redux中的题目列表
    //     dispatch({
    //       type: `${namespace}/set`,
    //       payload: {
    //         topicList: undefined
    //       }
    //     })
    //   }
    // })

  }

  /**
   * 确认完成组题操作
   **/
  confirmPaperBoard = () => {

    const { dispatch } = this.props
    const { topics, totalScore, paperType, permissionVisible, paperNameValue } = this.state
    const paperNameObj = document.getElementById('paperNameInput')
    let paperName = paperNameObj && paperNameObj.value;
    if (!paperNameValue) {
      openNotificationWithIcon(
        'warning',
        `请先设置组卷名称`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    }
    if (validatingSpecialCharacters(paperNameValue)) {//验证是否有特殊字符
      return;
    }
    if (!paperType) {
      openNotificationWithIcon(
        'warning',
        `请先设置试题类型`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    }
    let paperTemplateId = ''
    if (!this.state.questionTemplateValue) {
      openNotificationWithIcon(
        'warning',
        `请先选择试题模板`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      return
    } else {
      paperTemplateId = this.state.questionTemplateValue.slice(0, -10)
    }


    let paperProperty = {
      name: paperNameValue,
      totalScore,
      paperType,
      isPrivate: permissionVisible || '3',
      paperTemplateId,
      id: this.state.paperId,
      // versionKnowledgeId:this.state.knowledgePointValue
    }

    // setTimeout(() => {
    // 	this.refs.paperNameInput.state.value = undefined
    // }, 0)

    //定义数组，存放所有没有设置分数的题目序号
    let noScoreTopics = []
    //遍历数据，封装参数
    let topicList = []
    topics && topics.forEach(topicType => {
      topicType.questionList && topicType.questionList.forEach(topic => {
        if (existArr(topic.materialQuestionList)) {
          //获取材料下子题的id 并处理分数
          topic.materialQuestionList.map((item) => {
            if (item.id !== null && item.id !== undefined && item.id !== '' && item.score !== null && item.score !== undefined && item.score !== '' && item.score != 0) {
              const isParent = existArr(item.childrenList) ? 1 : 0
              topicList.push({
                questionId: item.id,
                questionCategory: item.category,
                score: item.score,
                code: item.sequenceCode,
                flag: isParent
              })
            } else {
              noScoreTopics.push(item.sequenceCode)
            }
          })
        } else {
          if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score != 0) {
            const isParent = existArr(topic.childrenList) ? 1 : 0
            topicList.push({
              questionId: topic.id,
              questionCategory: topic.category,
              score: topic.score,
              code: topic.sequenceCode,
              flag: isParent
            })
          } else {
            noScoreTopics.push(topic.sequenceCode)
          }
        }
        // if (topic.id !== null && topic.id !== undefined && topic.id !== '' && topic.score !== null && topic.score !== undefined && topic.score !== '' && topic.score !== 0) {
        //   topicList.push({
        //     questionId: topic.id,
        //     questionCategory: topic.category,
        //     score: topic.score,
        //     code: topic.serialNumber
        //   })
        // } else {
        //   noScoreTopics.push(topic.serialNumber)
        // }
      })
    })
    if (noScoreTopics.length === 0) {
      dispatch({
        type: `${namespace}/confirmPaperBoard`,
        payload: {
          versionKnowledgeId:this.state.knowledgePointValue,
          group: [paperProperty, topicList],
        },
        callback: () => {
          Message.success("保存成功!")
          paperBoardInfoCache.clear(paperBoardInfoCacheKEY)
          this.getTestQuestionEdition();
          this.setState(this.handleTopicsAndReturnNewStateObj([]), () => {
            dispatch(routerRedux.replace({//返回我的题组
              pathname: '/my-question-group',
              search: queryString.stringify({ paperType: 0 })
            }))
          })
          //  @ts-ignore
          if (window._czc) {
            //  @ts-ignore
            window._czc.push(['_trackEvent', `${window.$systemTitleName}-保存题组`, '保存']);
          }
        }
      })
    } else {
      openNotificationWithIcon(
        'warning',
        `请设置第 ${noScoreTopics.join("、")} 题的分数`,
        'rgba(0,0,0,.85)',
        '',
        4
      )
    }
  }

  /**
   * 上移操作
   * @topic：题目对象
   * @moveLength : 移动位数
   */
  moveTopic = (topic, moveLength) => {
    const { topics } = this.state
    let newTopics = []
    topics && topics.forEach((topicType, index) => {
      //只能在当前题型内移动
      if (topicType.category === topic.category) {
        topicType.questionList && topicType.questionList.forEach((topicItem, i) => {
          if (topicItem.id === topic.id) {
            newTopics = topicType.questionList.filter(item => !item.parentId)
            newTopics.forEach(newTopic => {
              newTopic.isSplit = topicType.questionList.some(item => item.parentId === newTopic.id)
            })
            const newTopicItemIndex = newTopics.findIndex(item => item.id === topicItem.id)
            const newTopicsLength = newTopics.length
            const moveTopics = newTopics.splice(newTopicItemIndex, 1)
            if (newTopicItemIndex + moveLength < 0) {
              openNotificationWithIcon(
                'warning',
                '顶不上去啦！',
                'rgba(0,0,0,.85)',
                '当前题目已经在所属题型的第一位了',
                3,
                <FrownOutlined style={{ color: "#ffe58f" }} />
              )
            } else if (newTopicItemIndex + moveLength >= newTopicsLength) {
              openNotificationWithIcon(
                'warning',
                '到底咯！',
                'rgba(0,0,0,.85)',
                '当前题目已经在所属题型的最后一位了',
                3,
                <FrownOutlined style={{ color: "#ffe58f" }} />
              )
            } else {
              if (
                moveLength !== 0 && 
                index !== undefined && 
                i !== undefined && 
                newTopicItemIndex !== undefined && 
                topics && 
                topics[index]
              ) {
                newTopics.splice(newTopicItemIndex + moveLength, 0, ...moveTopics)
                newTopics = newTopics.reduce((a, v) => {
                    if (v.isSplit) {
                      delete v.isSplit
                      a.push([v, ...v.childrenList])
                    } else {
                      delete v.isSplit
                      a.push([v])
                    }
                    return a
                  }, []).flat()
                topics[index].questionList = newTopics
                this.setState(this.handleTopicsAndReturnNewStateObj(topics, [], false, true))
              }
            }
          }
        })
      }
    })
  }

  /**
   * 上下移操作
   * @topicType：题型对象
   * @moveLength : 移动位数
   */
  moveTopicType = (sTopicType, moveLength) => {
    const { topics } = this.state
    let newTopicTypes = []
    topics && topics.forEach((topicType, index) => {
      //只能在当前题型内移动
      if (topicType.category === sTopicType.category) {
        newTopicTypes = topics.filter(item => item.category !== sTopicType.category);
        if (index + moveLength < 0) {
          openNotificationWithIcon(
            'warning',
            '顶不上去啦！',
            'rgba(0,0,0,.85)',
            '当前题型已经在第一位了',
            3,
            <FrownOutlined style={{ color: "#ffe58f" }} />
          )
        } else if (index + moveLength >= topics.length) {
          openNotificationWithIcon(
            'warning',
            '到底咯！',
            'rgba(0,0,0,.85)',
            '当前题型已经在最后一位了',
            3,
            <FrownOutlined style={{ color: "#ffe58f" }} />
          )
        } else {
          if (moveLength !== 0 && index !== undefined && index !== undefined && topics && topics[index]) {
            newTopicTypes.splice(index + moveLength, 0, sTopicType)
            this.setState(this.handleTopicsAndReturnNewStateObj(newTopicTypes, [], false, true))
          }
        }
      }
    })
  }

  /**
   *  将后台获取到的数据转换为题型表格适用的数据格式
   * @resourceData：原数据
   * @return  返回重新封装后的数据格式
   */
  // handleTopicTypeAnalysisData = (resourceData) => {
  //   const { topicList = [] } = this.props
  //   let resultData = []
  //   resourceData && resourceData.length > 0 && resourceData.forEach((record, index) => {
  //     let bigTopicType = this.getCategoryName(topicList, record);//获取题型标题
  //     resultData.push({
  //       key: index,
  //       bigTopicType,
  //       // bigTopicType: record.category && topicType[record.category] || '无',
  //       topicRate: `${record.count !== undefined && record.count !== null ? record.count : '无题目数量数据'}（${record.ratio !== undefined && record.ratio != null ? save2NumAfterPoint(record.ratio, 2) : '无占比数据'}%）`,
  //       scoreRate: `${record.score !== undefined && record.score !== null ? record.score : '无分值数据'}（${record.scoreRatio !== undefined && record.scoreRatio !== null ? save2NumAfterPoint(record.scoreRatio, 2) : '无占比数据'}%）`,
  //       comprehensiveDifficulty: record.comprehensiveDifficulty !== undefined && record.comprehensiveDifficulty !== null ? record.comprehensiveDifficulty : record.comprehensiveDifficulty || '无'
  //     })
  //   })
  //   return resultData
  // }

  /**
   * 保存分数设置
   * @scoreData :已设置保存分数的对象
   * @isSingle :是否单个设置，true，单个，false：多个
   */
  saveScoreSetting = (scoreData = [], isSingle) => {
    const { dispatch } = this.props;
    let isHaveScore = false;
    scoreData = scoreData.map((item) => {
      //判断分数是否为0或者为空
      if (item.score == 0 || !item.score) {
        isHaveScore = true
      }
      return {
        id: item.tempId,
        score: item.score
      }
    })
    if (isHaveScore) {
      openNotificationWithIcon(
        'warning',
        `分数不能设置为0或为空`,
        'rgba(0,0,0,.85)',
        '',
        3
      )
      if (!isSingle) {
        this.setState({
          setScoreModalIsShow: true
        })
      }
      return;
    }
    dispatch({
      type: `${namespace}/saveExamPaperDetailBoard`,
      payload: scoreData,
      callback: data => {
        Message.success(data && data.msg || "分数保存成功！")
        this.setState({
          setScoreModalIsShow: false,
          isShowSingleTopic: false
        })
      }
    })
  }

  /**
 * 显示设置参数弹窗-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留
 *@isShow :是否显示弹窗
 *@item :题目信息
 */
  // handleSetParameterModal = (isShow, item) => {
  //   this.setState({
  //     isSetParameterModal: isShow,
  //     questionInfo: item,
  //   })
  // }


  /**
  * 显示相似题匹配弹窗-2021年02月01日加-张江-试题板相似题匹配
  *@isShow :是否显示弹窗
  *@item :题目信息
  */
  handleWrongQuestionMatchModal = (isShow, item) => {
    this.setState({
      isWrongQuestionMatchModal: isShow,
      questionInfo: item,
    })
  }

  /**
 * 获取题目纠错modal的ref
 **/
  getErrorCorrectionModal = (ref) => {
    this.errorCorrectionRef = ref;
  }

  /**
   * 打开布置任务
   */
  openErrorCorrection = (questionId) => {
    this.errorCorrectionRef.onOff(true, questionId)
  }

  /**
  * 设置试题板缓存的值-2021年07月23日加-张江
  *@field :field 显示字段
  *@value :value显示的值
  */
  setPaperBoardInfoCache = (field, value) => {
    if (field === 'paperName') this.setState({ paperNameValue: value })
    const paperBoardInfo = paperBoardInfoCache(paperBoardInfoCacheKEY, null) || {};
    paperBoardInfo[field] = value;
    paperBoardInfoCache(paperBoardInfoCacheKEY, paperBoardInfo)
  }
  render() {
    const { dispatch } = this.props
    const {
      topics,
      topicsCount,
      totalScore,
      targetTopic,
      topicTypeTotalScores,
      combinationAnalysisModalIsShow,
      authButtonList,

      isShowSingleTopic,
      singleTopic,

      // isSetParameterModal,
      questionInfo,
      isWrongQuestionMatchModal,
      selectedChangeKnowList,
      selectedChangeKnowId
    } = this.state;
    const { changeTopicList, changeTopicListLoading, analysisData, loading, location, topicList } = this.props
    let difficultStatisticsChartData = analysisData && analysisData.length > 2 && analysisData[1]//图表数据
    const { pathname = '' } = location;
    let knowledgeStatisticsData = analysisData && analysisData.length > 2 && analysisData[2].map((topic, index) => {
      topic.serialNumber = topic.code || (index + 1)
      return topic
    }) || []//知识点统计表格数据
    /**
     * 是否有按钮权限
     * */
    const isClick = (name) => {
      return window.$PowerUtils.judgeButtonAuth(authButtonList, name)
    }

    // 设置全卷分数
    const setScoreColumn = [
      {
        title: '题号',
        dataIndex: 'sequenceCode',
        key: 'sequenceCode',
        width: 100,
        align: 'center'
      },
      {
        title: '知识点',
        dataIndex: 'knowNames',
        key: 'knowNames',
        ellipsis: true,
        width: 300,
        align: 'center',
        render(_, row) {
          return {
            children: row.knowNames,
            props: {
              rowSpan: row.rowSpan,
              colSpan: row.colSpan ? row.colSpan : 1
            }
          }
        }
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: 100,
        align: 'center',
        render(_, row) {
          return {
            children: row.difficulty,
            props: {
              rowSpan: row.rowSpan,
              colSpan: row.colSpan ? 0 : 1
            }
          }
        }
      },
      {
        title: '分值',
        width: 220,
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        render: (text, record) => {
          let stateKeyName = `topicTypeInput-${record.topicTypeIndex}`
          return (
            record.isTopicTypeTitle
              ? <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                  每题
                  <InputNumber
                    min={0}
                    max={99}
                    step={1}
                    style={{ margin: '0 10px', width: 100 }}
                    value={this.state[stateKeyName]}
                    placeholder='单题分数'
                    onChange={(value) => {
                      const score = value
                      this.setState({
                        [stateKeyName]: score,
                        ...this.handleEveryTopicScoreAndReturnNewStateObj(record.topicTypeIndex, score)
                      })
                    }} />
                  分
                </div>
              : record.sequenceCode && record.sequenceCode.includes('-') ?
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="小项分数"
                  value={record.score}
                  onChange={value => {
                    this.setSmallItemScore(record, value, 1)
                  }} /> :
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="单题分数"
                  value={record.score}
                  onChange={value => {
                    this.setSingleItemScore(record, value, record.topicTypeIndex, 1)
                  }} />
          )
        }
      },
    ]

    // 设置材料下单个题
    const setSingleScoreColumn = [
      {
        title: '题号',
        dataIndex: 'sequenceCode',
        key: 'sequenceCode',
        width: 100,
        align: 'center'
      },
      {
        title: '知识点',
        dataIndex: 'knowName',
        key: 'knowName',
        ellipsis: true,
        width: 300,
        align: 'center',
        render(_, row, index) {
          return {
            children: row.knowName,
            props: {
              rowSpan: row.rowSpan,
              colSpan: index === 0 ? 2 : 1
            }
          }
        }
      },
      {
        title: '难度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: 100,
        align: 'center',
        render(_, row, index) {
          return {
            children: row.difficulty,
            props: {
              rowSpan: row.rowSpan,
              colSpan: index === 0 ? 0 : 1
            }
          }
        }
      },
      {
        title: '分值',
        width: 220,
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        render: (text, record) => {
          let stateKeyName = `topicTypeInput-${record.serialNumber}`
          return (
            record.isTopicTypeTitle
              ? <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                  每题
                  <InputNumber
                    min={0}
                    max={99}
                    step={1}
                    style={{ margin: '0 10px', width: 100 }}
                    value={this.state[stateKeyName]}
                    placeholder='单题分数'
                    onChange={(value) => {
                      const score = value
                      this.setState({
                        [stateKeyName]: score,
                        ...this.handleSingleEveryTopicScoreAndReturnNewStateObj(record.serialNumber, score)
                      })
                    }} />
                  分
                </div>
              : record.sequenceCode && record.sequenceCode.includes('-') ?
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="小项分数"
                  value={record.score}
                  onChange={value => {
                    this.setSmallItemScore(record, value, 2)
                  }}
                /> :
                <InputNumber
                  min={0}
                  max={99}
                  step={1}
                  style={{ width: 100 }}
                  placeholder="单题分数"
                  value={record.score}
                  onChange={value => {
                    this.setSingleItemScore(record, value, record.serialNumber, 2)
                  }}
                />
          )
        }
      },
    ]
    const title = '试题板-我的题组';
    const breadcrumb = [title];
    const header = (
      <Page.Header breadcrumb={breadcrumb} title={title} />
    );
    const classString = classNames(styles['wrap'], 'gougou-content');
    return (
      <Page header={header} loading={!!loading}>
        <div className={classString}>
          {/*主内容*/}
          <div className={styles.main}>
            {/* <div className={styles.mainTop}>
              <div className={styles.filterTopicType}>
                <span>选择类型：</span>
                <Radio.Group style={{ width: '100%' }}
                  value={this.state.paperType} size={'large'}
                  onChange={this.setPaperType}
                >
                  <Radio value="1">作业</Radio>
                  <Radio value="2">测验</Radio>
                  <Radio value="3">试卷</Radio>
                </Radio.Group>
              </div>
              <div className={styles.search}>
                <span>名称:</span>
                <Input id='paperNameInput' ref={"paperNameInput"} placeholder="设置组卷名称" style={{ minWidth: 200 }}
                  allowClear
                />
              </div>
            </div> */}
            <ul className={styles.content}>
              {
                topics.length > 0 ?
                  topics.map((topicType, topicTypeIndex) => (
                    <li key={topicTypeIndex}>
                      <div className={styles.mainContenTtitle}>
                        <div className={styles.topicTypeTitle}>
                          { topicType.name ? `${uppercaseNum(topicTypeIndex + 1)}、${topicType.name}` : "未知题型" }
                          （共{calQuestionNum(topicType.questionList)}题；共{topicTypeTotalScores[topicTypeIndex]}分）
                        </div>
                        <div className={styles.questionTypeSort}>
                          {
                            isClick('上移') ?
                              <span onClick={_ => this.moveTopicType(topicType, -1)}>
                                <IconFont type="icon-moveUp" />上移
                              </span> : null
                          }
                          {
                            isClick('下移') ?
                              <span onClick={_ => this.moveTopicType(topicType, 1)}>
                                <IconFont type="icon-moveDown" />下移
                              </span> : null
                          }
                        </div>
                      </div>
                      <ul className={styles.topics}>
                        {
                          topicType.questionList && topicType.questionList.length > 0 ?
                            topicType.questionList.map((topic, index) => {
                              topic.category = topicType.category;
                              topic.categoryName = topicType.name;
                              return (
                                <li
                                  className={`${styles.topicItem} ${topic.isSelected ? styles.selected : ''}`}
                                  key={index}
                                  id={`question${topic.id}`}
                                >
                                  <div className={styles.topicBody}>
                                    <div className={styles.topicContent}>
                                      {
                                        RenderMaterialAndQuestion(topic, false, (RAQItem) => {
                                            return (
                                              <TopicContent
                                                topicContent={RAQItem}
                                                optionsFiledName='optionList'
                                                optionIdFiledName="code"
                                                contentFiledName='content'
                                                childrenFiledName='child'
                                                currentPage={1}
                                                pageSize={topicsCount}
                                                currentTopicIndex={(RAQItem.serialNumber || RAQItem.serialCode || Number(RAQItem.questionNum)) - 1}
                                              />
                                            )
                                          }, (RAQItem) => {
                                            return <ParametersArea QContent={RAQItem} comePage={''} />;
                                          }
                                        )
                                      }
                                      {/* 材料部分 */}
                                      {/* {
                                      RenderMaterial(topic)
                                    } */}
                                      {/* <TopicContent topicContent={topic}
                                      optionsFiledName='optionList'
                                      optionIdFiledName="code"
                                      contentFiledName='content'
                                      childrenFiledName='child'
                                      currentPage={1}
                                      pageSize={topicsCount}
                                      currentTopicIndex={topic.serialNumber - 1}
                                    /> */}
                                      {/* {renderAnswerAnalysis(topic, 1)} */}
                                    </div>
                                  </div>
                                  <div className={styles.topicFooter}>
                                    {/*信息列表*/}
                                    <ul className={styles.info} style={{ paddingLeft: '0px' }}>
                                      {/* <li>难度： <span>{topic.difficulty || '暂无'}</span></li> */}
                                      <li>
                                        使用次数：<span>{topic.useNumber || 0}</span>
                                      </li>
                                    </ul>
                                    {/*交互列表*/}
                                    <ul className={styles.interactive}>
                                      {/* {//-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留
                                      isClick('设置参数') && !topic.abilityIds ? <li onClick={_ => {
                                        this.handleSetParameterModal(true, topic)
                                      }}><IconFont type="icon-bianji" />设置参数</li> : null} */}
                                      {
                                        //-2021年03月10日加-张江-试题板添加测评目标
                                        isClick('测评目标') ?
                                          <li onClick={() => { this.evalTargetRef.handleOnOrOff(true, topic) }}>
                                            <IconFont type="icon-cepingmubiao" /> 测评目标
                                          </li> : null
                                      }
                                      {
                                        //-2021年02月04日加-张江-试题板添加上传微课
                                        isClick('上传微课') ? <li onClick={_ => {
                                          pushNewPage({ questionId: topic.id, dataId: topic.dataId, }, '/question-detail', dispatch)
                                        }}><IconFont type="icon-shangchuanweike" /> 上传微课</li> : null
                                      }
                                      {
                                        //2021年05月07日加-张江-试题板纠错
                                        isClick('纠错') ?
                                          <li onClick={() => this.openErrorCorrection(topic.id)}>
                                            <IconFont type={'icon-jiucuo'} /> 纠错
                                          </li> : null
                                      }
                                      {
                                        //-2021年02月01日加-张江-试题板相似题匹配
                                        isClick('相似题匹配') ?
                                          <li onClick={_ => {this.handleWrongQuestionMatchModal(true, topic)}}>
                                            <IconFont type="icon-icon_hailiangmingdanpipei" /> 相似题匹配
                                          </li> : null
                                      }
                                      {
                                        topic.isEdit ?
                                          <li className={styles.isEdit}>
                                            <InputNumber
                                              defaultValue={topic.score}
                                              min={0}
                                              max={99}
                                              step={1}
                                              style={{ width: 160 }}
                                              autoFocus={true}
                                              placeholder={"输入此题分数"}
                                              onFocus={(e) => {
                                                let { topics } = this.state
                                                //当当前文本框获取焦点时，在数据中找到当前的分数，设置到scoreTemp变量中
                                                if (topics && topics.length > 0) {
                                                  for (let i = 0; i < topics.length; i++) {
                                                    let topicTy = topics[i]
                                                    let { questionList } = topicTy
                                                    if (questionList && questionList.length > 0) {
                                                      for (let j = 0; j < questionList.length; j++) {
                                                        let topi = questionList[j]
                                                        if (topic.id === topi.id) {
                                                          scoreTemp = topic.score
                                                          break
                                                        } else {
                                                          scoreTemp = undefined
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }}
                                              onChange={value => {
                                                scoreTemp = value;
                                              }}
                                              onBlur={e => {
                                                topic.sequenceCode && topic.sequenceCode.includes('-') ?
                                                  this.setSmallItemScore(topic, e.target.value) :
                                                  this.setSingleItemScore(topic, e.target.value, topicTypeIndex)
                                              }} />
                                          </li> :
                                            topic.score ?
                                              <li onClick={_ => {this.toggleEditState(topic)}}>
                                                <IconFont type="icon-setScore" /> 分数:
                                                <span style={{ fontWeight: 'bold', marginLeft: 2 }}>{topic.score}</span>
                                              </li> :
                                              (
                                                isClick('设置分数') ?
                                                  <li onClick={_ => {this.toggleEditState(topic)}}>
                                                    <IconFont type="icon-setScore" />设置分数
                                                  </li> : null
                                              )
                                      }
                                      {
                                        isClick('换一题') ?
                                          <li onClick={_ => {this.toggleTopicModalState(true, topic)}}>
                                            <IconFont type="icon-switch" />换一题
                                          </li> : null
                                      }
                                      {
                                        isClick('收藏') ?
                                          <li
                                            onClick={_ => {
                                              let { collectedTopics } = this.state
                                              topic.collect || collectedTopics.indexOf(topic.id) !== -1 ?
                                                this.collectTopic(topic.id, false) :
                                                this.collectTopic(topic.id, true)
                                            }}
                                          >
                                            {
                                              topic.collect || this.state.collectedTopics.indexOf(topic.id) !== -1 ?
                                                <HeartFilled style={{ color: "rgba(230,30,30,0.73)" }} /> :
                                                <HeartOutlined />
                                            }
                                            收藏
                                          </li> : null
                                      }
                                      {
                                        isClick('上移') && 
                                        ((topic.sequenceCode && !topic.sequenceCode.includes('-')) || 
                                        existArr(topic.materialQuestionList)) ?
                                          <li onClick={_ => this.moveTopic(topic, -1)}>
                                            <IconFont type="icon-moveUp" />上移
                                          </li> : null
                                      }
                                      {
                                        isClick('下移') && 
                                        ((topic.sequenceCode && !topic.sequenceCode.includes('-')) || 
                                        existArr(topic.materialQuestionList)) ?
                                          <li onClick={_ => this.moveTopic(topic, 1)}>
                                            <IconFont type="icon-moveDown" />下移
                                          </li> : null
                                      }
                                      {
                                        isClick('移除') ?
                                          <li onClick={_ => {this.removeTopic(topic.id, topic.tempId, topic.category)}}>
                                            <IconFont type="icon-remove" />移除
                                          </li> : null
                                      }
                                    </ul>
                                  </div>
                                </li>
                              )
                            }) :
                            <Empty
                              description={
                                topicType.name ?
                                  `还未添加任何【${topicType.name}】类型的题` :
                                  "还未添加任何相关题目"
                              }
                            />
                        }
                      </ul>
                    </li>
                  )) : <Empty description={'您还未添加任何题目'} />
              }
            </ul>
          </div>

          {/*试题板操作*/}
          <div className={styles.right}>
            <div className={styles.title}>试题板操作</div>
            <div className={styles.mainTop}>
              <div className={styles.search}>
                <span>名称:</span>
                <Input
                  id='paperNameInput'
                  ref={"paperNameInput"}
                  placeholder="设置组卷名称"
                  style={{ minWidth: 200 }}
                  value={this.state.paperNameValue}
                  allowClear
                  onChange={(e) => {
                    this.setPaperBoardInfoCache('paperName', e.target.value)
                  }}
                />
              </div>
              <div className={styles.filterTopicType}>
                <span>题组类型：</span>
                <Radio.Group style={{ width: '100%' }}
                  value={this.state.paperType} size={'large'}
                  onChange={this.setPaperType}
                >
                  <Radio value="1">作业</Radio>
                  <Radio value="2">测验</Radio>
                  <Radio value="3">试卷</Radio>
                </Radio.Group>
              </div>
              <div className={styles.filterTopicType} style={{ marginBottom: 8 }}>
                <span>权限可见：</span>
                <Radio.Group style={{ width: '100%' }}
                  value={this.state.permissionVisible} size={'large'}
                  onChange={this.setPermissionVisible}
                >
                  {
                    permissionVisibleList && permissionVisibleList.map((item) => {
                      return (<Radio value={item.code} key={item.code}>{item.name}</Radio>)
                    })
                  }
                  {/* <Radio value="1">全部</Radio>
                  <Radio value="2">校内</Radio>
                  <Radio value="3">仅自己</Radio> */}
                </Radio.Group>
              </div>
              {
                this.state.permissionVisible === '4' ?
                  <div className={styles.selectedSchoolTable}>
                    <div className={styles.selectedSchoolTableTitle}>
                      <span>已选学校：</span>
                      <Button 
                        type="primary"
                        onClick={this.showSelectSchoolModalState}
                      >去选择</Button>
                    </div>
                    <Table 
                      dataSource={this.state.selectedChoolDataSource}
                      columns={this.state.selectedChoolColumns}
                      pagination={{ pageSize: 5 }}
                      bordered
                    />
                  </div> : null
              }
              <div className={styles.filterTopicType} style={{marginTop: 3}}>
                <span>试题模板：</span>
                <TreeSelect
                  style={{ width: '270px' }}
                  dropdownStyle={{ overflow: 'auto' }}
                  value={this.questionTemplate}
                  placeholder="请选择"
                  allowClear
                  treeExpandAction={'click'}
                  onChange={this.onQuestionTemplateSelect}
                >
                  {this.renderTreeNodes(this.state.questionTemplateTreeData)}
                </TreeSelect>
              </div>
              <div className={styles.filterTopicType}>
                <span>章节知识点: </span>
                <TreeSelect
                  style={{ width: '270px' }}
                  dropdownStyle={{ overflow: 'auto' }}
                  value={this.knowledgePointValue}
                  placeholder="请选择"
                  allowClear
                  treeExpandAction={'click'}
                  onChange={this.oneKnowledgePointSelect}
                  treeData={this.state.knowledgePointTreeData}

                />


              </div>
            </div>
            <div className={styles.leftMain}>
              <div className={styles.optArea}>
                <div className={styles.optContent}>
                  <div className={styles.optItem} onClick={() => this.toggleScoreModalState(true)} >设置分数</div>
                  {isClick('题组分析') ? <div className={styles.optItem} onClick={_ => this.toggleAnalysisModalState(true)}>题组分析</div> : null}
                  {isClick('清空试题') ? <div className={styles.optItem} onClick={this.clearPaperBoard}>清空试题</div> : null}
                  {isClick('保存题组') ? <div className={styles.optItem} onClick={this.confirmPaperBoard}>保存题组</div> : null}
                </div>
                <div className={styles.info}>
                  <div className={styles.optAreaBottomLeft}>
                    <div>总题数 <span>{topicsCount}</span> 题</div>
                    <div>总分数 <span>{totalScore}</span> 分</div>
                  </div>
                </div>
              </div>
              <div className={styles.topicNavWrap}>
                {
                  topics && topics.length > 0
                    ? topics.map((topicType, topicTypeIndex) => (
                      <div className={styles.topicNav} key={topicTypeIndex}>
                        <div className={styles.topicTypeTitle}>
                          <span>
                            {
                              topicType.name ?
                                `${uppercaseNum(topicTypeIndex + 1)}、${topicType.name}` : "未知题型"
                            }
                          </span>
                          {
                            isClick('上移') ?
                              <span onClick={_ => this.moveTopicType(topicType, -1)}>
                                <IconFont type="icon-moveUp" />上移
                              </span> : null
                          }
                          {
                            isClick('下移') ?
                              <span onClick={_ => this.moveTopicType(topicType, 1)}>
                                <IconFont type="icon-moveDown" />下移
                              </span> : null
                          }
                        </div>
                        <ul>
                          {
                            topicType.questionList && topicType.questionList.length > 0 ?
                              topicType.questionList.map((topic, index) => {
                                //获取材料下子题的id 并处理分数
                                if (existArr(topic.materialQuestionList)) {
                                  return topic.materialQuestionList.map((item) => {
                                    return (
                                      <li
                                        key={item.id}
                                        className={topic.isSelected ? styles.selected : ''}
                                        onClick={() => this.selectTopic(topic.id, `question${topic.id}`)}
                                      >
                                        {item.serialNumber}
                                      </li>
                                    )
                                  })
                                } else {
                                  return (
                                    <li
                                      key={topic.id}
                                      className={topic.isSelected ? styles.selected : ''}
                                      onClick={() => this.selectTopic(topic.id, `question${topic.id}`)}
                                    >
                                      {topic.serialNumber}
                                    </li>
                                  )
                                }
                              }) : <Empty style={{ padding: "10px" }} description={'您还未添加任何题目'} />
                          }
                        </ul>
                      </div>
                    ))
                    : <Empty description={'您还未添加任何题目'} />
                }
              </div>
            </div>
          </div>
          {/*换一题弹框*/}
          <Modal
            className="toggleTopicModal"
            width={"80%"}
            title="换题"
            visible={this.state.toggleTopicModalIsShow}
            onOk={_ => {
              this.toggleTopicModalState(false)
            }}
            onCancel={_ => {
              this.toggleTopicModalState(false)
            }}
          >
            <Spin spinning={!!changeTopicListLoading} tip='正在加载中...'>
              <div className='topicListPanel'>
                <div className='header'>
                  <div className="left">
                    <div>原题信息</div>
                    <div>题型：{targetTopic && targetTopic.category && targetTopic.categoryName || '未知'}</div>
                    {
                      targetTopic && targetTopic.difficulty ? <div>难度：{targetTopic.difficulty}</div> : ''
                    }
                    {
                      targetTopic && selectedChangeKnowId ? <div>知识点：
                        <Radio.Group onChange={(event) => {
                          const selectValue = event.target.value;
                          this.setState({
                            selectedChangeKnowId: selectValue
                          }, () => {
                            this.getTopicListData(1)
                          })
                        }} defaultValue={selectedChangeKnowId}>
                          {
                            selectedChangeKnowList.map((item) => {
                              return (<Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                            })
                          }
                        </Radio.Group>
                      </div> : ''
                    }
                  </div>
                  <div className="right" onClick={this.randomChange}><IconFont type='icon-switch' />换一批</div>
                </div>
                <ul>
                  {
                    changeTopicList && changeTopicList.data && changeTopicList.data.length > 0
                      ? changeTopicList.data.map((topic, index) => (
                        <li className='topicItem' key={index}>
                          <div className='topicBody'>
                            <div className='topicContent'>
                              {
                                RenderMaterialAndQuestion(topic, false, (RAQItem) => {
                                  return (<TopicContent topicContent={RAQItem}
                                    childrenFiledName={'children'}
                                    contentFiledName={'content'}
                                    optionIdFiledName={'code'}
                                    optionsFiledName={"optionList"}
                                    currentPage={changeTopicList.currentPage}
                                    currentTopicIndex={index}
                                    pageSize={10}
                                  />)
                                },
                                  (RAQItem) => {
                                    return <ParametersArea QContent={RAQItem} comePage={''} />;
                                  },
                                )
                              }
                              {/* 材料部分 */}
                              {/* {
                                RenderMaterial(topic)
                              } */}
                              {/* <TopicContent topicContent={topic}
                                childrenFiledName={'children'}
                                contentFiledName={'content'}
                                optionIdFiledName={'code'}
                                optionsFiledName={"optionList"}
                                currentPage={changeTopicList.currentPage}
                                currentTopicIndex={index}
                                pageSize={10}
                              /> */}
                              {/* {renderAnswerAnalysis(topic, 1)} */}
                            </div>
                          </div>
                          <div className='topicFooter'>
                            {/*信息列表*/}
                            <ul className='info'>
                              {/* <li>难度： <span>{topic.difficulty || '暂无'}</span></li> */}
                              <li>使用次数： <span>{topic.useNumber || 0}</span></li>
                            </ul>
                            <ul className='interactive'>
                              <li onClick={_ => {
                                this.replaceTopic(topic)
                              }}>
                                <IconFont type="icon-switch" />
                                替换
                              </li>
                            </ul>
                          </div>
                        </li>
                      ))
                      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                  }
                </ul>
              </div>
            </Spin>
          </Modal>
          {/*组题分析弹框*/}
          {
            combinationAnalysisModalIsShow ?
              <TopicGroupAnalysis
                analysisData={analysisData}
                combinationAnalysisModalIsShow={combinationAnalysisModalIsShow}
                toggleAnalysisModalState={this.toggleAnalysisModalState}
                topicList={topicList}
              /> : null
          }

          {/* <Modal
            className='combinationAnalysisModal'
            width='80%'
            title="组题分析"
            visible={combinationAnalysisModalIsShow}
            onOk={_ => {
              this.toggleAnalysisModalState(false)
            }}
            onCancel={_ => {
              this.toggleAnalysisModalState(false)
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
                        /> : null
                    } */}

          {/* <DifficultStatisticsChart data={difficultStatisticsChartData}/> */}
          {/* </div>
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
          </Modal> */}
          {/*设置全卷分数弹框*/}
          <Modal
            className='setScoreModal'
            width='60%'
            title="设置全卷分数"
            visible={this.state.setScoreModalIsShow}
            onOk={() => this.toggleScoreModalState(false, 1)}
            onCancel={() => this.toggleScoreModalState(false, 2)}
          >
            <div>
              <Table
                dataSource={this.state.setScoreData}
                pagination={false}
                columns={setScoreColumn}
                bordered
                rowKey={"sequenceCode"}
              />
            </div>
          </Modal>
          {/*设置材料下单个分数弹框*/}
          <Modal
            className='setScoreModal'
            width='60%'
            title="设置材料下单题分数"
            visible={isShowSingleTopic}
            onOk={() => this.toggleSingleScoreModalState(false, 1)}
            onCancel={() => this.toggleSingleScoreModalState(false, 2)}
          >
            <div>
              <Table
                dataSource={singleTopic ? singleTopic.materialQuestionList || [] : []}
                pagination={false}
                columns={setSingleScoreColumn}
                bordered
                // rowKey={"serialNumber"}
                rowKey={"sequenceCode"}
              />
            </div>
          </Modal>

          {/*选择权限可见学校*/}
          <Modal
            width='80%'
            title="选择权限可见学校"
            visible={this.state.isShowSelectSchoolModal}
            onOk={this.setSelectedSchool}
            onCancel={this.hideSelectSchoolModal}
          >
            <div className={styles['school-tree-wrap']}>
              <div className={styles['school-tree-box']}>
                <div className={styles['school-tree-title']}>学校列表</div>
                {
                  schoolList && schoolList.length > 0 ?
                    <Tree
                      blockNode
                      defaultExpandedKeys={[schoolList[0].id]}
                      defaultSelectedKeys={[schoolList[0].id]}
                      selectedKeys={this.state.treeSelectedSchoolKeys}
                      onSelect={this.onTreeSelect}
                      multiple={this.state.isMultiple}
                      treeData={this.renderSchoolTreeNodes(schoolList)}
                    />
                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={window.$emptyDescInfo} />
                }
              </div>
              <div className={styles['school-tree-box']}>
                <div className={styles['school-tree-two-title']}>
                  <span>待选学校</span>
                  <span>已选学校</span>
                </div>
                <Transfer
                  dataSource={this.state.transferDataSource}
                  showSearch
                  listStyle={{ width: 290, height: 680 }}
                  targetKeys={this.state.targetTransferKeys}
                  selectedKeys={this.state.selectedTransferKeys}
                  onChange={this.handleTransferChange}
                  onSelectChange={this.onSelectTransferChange}
                  onSearch={this.handleTransferSearch}
                  render={(item) => item.title}
                />
              </div>
            </div>
          </Modal>

          {/* 试题板设置参数-2020年12月30日加-张江-试题板设置参数 - 未使用-暂留 */}
          {/* {
            isSetParameterModal ? <SetParameterModal
              isSetParameterModal={isSetParameterModal}
              questionInfo={questionInfo}
              hideSetParameterVisible={(questionInfo) => {
                this.handleSetParameterModal(false, questionInfo)
              }}
            /> : null
          } */}

          {/* 试题板相似题匹配-2021年02月03日加-张江 */}
          {
            isWrongQuestionMatchModal ? <WrongQuestionMatchModal
              isWrongQuestionMatchModal={isWrongQuestionMatchModal}
              questionInfo={questionInfo}
              hideWrongQuestionMatchVisible={(questionInfo) => {
                this.handleWrongQuestionMatchModal(false, questionInfo)
              }}
            /> : null
          }

          {/* 试题板测评目标-2021年03月10日加-张江 */}
          <EvalTargetModal getRef={(ref) => { this.evalTargetRef = ref }} />

          {/* 试题板题目纠错-2021年05月10日加-张江 */}
          <ErrorCorrectionModal onRef={this.getErrorCorrectionModal} />

          <BackBtns tipText={"返回"} />
        </div>
      </Page>
    )
  }
}
