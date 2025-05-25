/**
 * 题目列表页面 单个ListItem渲染组件
 * @author:张江
 * @date:2020年08月20日
 * @version:v1.0.0
 * */

// eslint-disable-next-line
import React from "react";
import PropTypes from "prop-types";
import { Tooltip, Message, Button } from "antd";
import queryString from "query-string";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import TopicContent from "../TopicContent/TopicContent";
import RenderMaterialAndQuestion from "../RenderMaterialAndQuestion/index"; //渲染题目材料以及题目或者题目
import {
  getIcon,
  openNotificationWithIcon,
  handleFetchingField,
  pushNewPage,
} from "@/utils/utils";
import styles from "./QuestionPaperItem.less";
import renderAnswerAnalysis from "../RenderAnswerAnalysis/index"; //渲染题目答案与解析部分
import {
  ManualCombination as namespace,
  HomeIndex,
  Auth,
} from "@/utils/namespace";
import { collectionType } from "@/utils/const";
import userInfoCache from "@/caches/userInfo";
import accessTokenCache from "@/caches/accessToken";

const IconFont = getIcon();

@connect((state) => ({
  loading: state[namespace].loading,
}))
export default class QuestionPaperItem extends React.Component {
  static propTypes = {
    QContent: PropTypes.object.isRequired, //题目信息
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func,
  };

  constructor() {
    super(...arguments);
    this.state = {
      isUpOrDown: false,
      isShowAnswerAnalysis: false,
      baperBoardId: "",
      collectId: "",
      isCollecting: false,
      isAdding: false,
    };
  }

  componentDidMount() {
    const { QContent, location } = this.props;
    const { pathname, search } = location;
    const query = queryString.parse(search);
  }

  /**
   * 是否撑开题目全部信息
   * @param isUpOrDown  ：是/否
   */
  upToDown = (isUpOrDown) => {
    this.setState({
      isUpOrDown: isUpOrDown,
    });
  };

  /**
   * 是否显示答案与解析
   * @param isShowAnswerAnalysis  ：是/否
   */
  onShowAnswerAnalysis = (isShowAnswerAnalysis) => {
    const { isUpOrDown } = this.state;
    this.setState({
      isShowAnswerAnalysis: isShowAnswerAnalysis,
      isUpOrDown: !isShowAnswerAnalysis,
    });
  };

  /**
   * 收藏题目
   *@topicId :题目id
   */
  collectTopic = (topicId, isCollect = true) => {
    const { dispatch, subjectId } = this.props;

    this.setState({
      isCollecting: true,
    });

    topicId
      ? isCollect
        ? dispatch({
            type: `${namespace}/collectTopic`,
            payload: {
              itemId: topicId,
              type: collectionType.QUESTION.type,
            },
            callback: (data) => {
              this.setState({
                collectId: topicId,
                isCollecting: false,
              });
              Message.success((data && data.msg) || "收藏成功！");
            },
          })
        : dispatch({
            type: `${namespace}/cancleCollectTopic`,
            payload: {
              itemId: topicId,
              type: collectionType.QUESTION.type,
            },
            callback: (data) => {
              this.setState({
                collectId: "",
                isCollecting: false,
              });
              Message.success((data && data.msg) || "取消成功！");
            },
          })
      : openNotificationWithIcon(
          "error",
          "收藏失败！请稍后重试!",
          "red",
          "缺少题目id参数",
          2
        );
  };

  /**
   * 将题目添加到试题板或者取消添加
   * @topicId : 题目id
   * @questionCategory :题目类型
   */
  addOrCancelPaperBoard = (topicId, questionCategory, isAdd, subjectId) => {
    const { dispatch } = this.props;
    const getTestQuestionEdition = () => {
      this.setState({
        isAdding: false,
      });
      dispatch({
        type: HomeIndex + "/getTestQuestionEdition",
        payload: {},
      });
    };
    this.setState({
      isAdding: true,
    });

    // topicId && questionCategory ?
    topicId
      ? isAdd
        ? dispatch({
            type: `${namespace}/saveOptionQuestion`,
            payload: {
              questionId: topicId,
              questionCategory,
              subjectId,
            },
            callback: (data) => {
              this.setState({
                baperBoardId: topicId,
              });
              getTestQuestionEdition();
              openNotificationWithIcon("success", "添加成功!", "green", "", 2);
            },
          })
        : dispatch({
            type: `${namespace}/removeQuetion`,
            payload: {
              questionId: topicId,
            },
            callback: (data) => {
              this.setState({
                baperBoardId: "",
              });
              getTestQuestionEdition();
            },
          })
      : openNotificationWithIcon(
          "error",
          "添加失败！",
          "red",
          !topicId ? "缺少题目id参数" : "缺少题目类型参数",
          2
        );
  };

  /**
   * 页面组件即将卸载时：清空数据
   */
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const {
      QContent,
      location,
      dispatch,
      isSelected,
      onSelect,
      checkPaperDetail,
    } = this.props;
    const {
      isUpOrDown,
      isShowAnswerAnalysis,
      baperBoardId,
      collectId,
      isCollecting,
      isAdding,
    } = this.state;
    const { pathname, search } = location;
    const query = queryString.parse(search);
    const access_token = accessTokenCache();
    let loginUserInfo = userInfoCache() || {};
    //跳转登录页
    const toLogin = () => {
      dispatch(
        routerRedux.replace({
          pathname: "/logun",
        })
      );
    };

    return (
      <div 
        className={`${styles['question-item']} ${isSelected ? styles.selected : ''}`}
        onClick={() => onSelect && onSelect()}
      >
        <div className={styles["question-pre-oper"]}>
          <div className={styles["parameters-area"]} onClick={(e) => checkPaperDetail && checkPaperDetail(e)}>
            <div>{QContent.name}</div>
          </div>
        </div>
        <div className={styles["question-content"]}>
          <div className={styles["question-buttom"]}>
            {QContent.createTime}
          </div>
        </div>
      </div>
    );
  }
}
