/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2020/9/3
 *@Modified By:
 * @updateAuthor:张江
 * @updateVersion:v1.0.1
 * @updateDate:2021年09月24日
 * @description 更新描述:路由由push->replace，行内样式改为类名样式并添加动画效果
 */
import React from 'react'
import styles from './correctJob.less'
import {Empty, Input} from "antd";
import {existArr, existObj, pushNewPage, replaceSearch} from "@/utils/utils";
import {TaskCorrect as namespace} from '@/utils/namespace'
import RedCircle from '@/components/redCircle'
import {connect} from 'dva'
import classNames from 'classnames';
import {string} from "prop-types";


const {Search} = Input;
@connect(state => ({}))
export default class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    }
  }

  render() {
    const {location: {query, pathname}, dispatch, resetNumbRemark = () => undefined, topicList, studentList, switchStatus = true, cutBoardRef} = this.props
    const {searchValue,searchStu} = this.state;
    const copyStudents = JSON.parse(JSON.stringify(studentList));
    const _studentList= this.state.searchStu&&this.state.searchStu.length>0?this.state.searchStu:copyStudents;
    const tagType = (status, id, score) => {
      let checked = ''
      if (id == query.id && !query.studentCorrect) {
        checked = (<div>批阅中</div>)
        return checked
      }
      if (status == 0) {
        return <div style={{color: '#63a1ea'}}>待批阅</div>
      }
      if (status == 1) {
        return <div>{score ? score : 0}分</div>
      }
    }

    /**
     * 切换学生同时重置掉打分框内容
     * @param record
     * @param str
     * @param resetNumbRemark
     */
    const handleUrl = (record, str, resetNumbRemark) => {
      if (record?.id == query.id) {
        return
      }
      cutBoardRef.cutScrollView();//回滚到第一题
      resetNumbRemark()
      if (topicList) {
        query.topicId = existObj(topicList[0]) && topicList[0].id ? topicList[0].id : undefined
        query.questionId = undefined
      }
      query[str] = record.id || 0;
      query.studentCorrect = record?.isCorrect || undefined;//学生批阅状态用来判断是否用老接口请求
      pushNewPage(query, pathname, dispatch, 'replace')
    };

    /**
     *
     * @param value
     * @constructor
     */
    const SearchName = (value) => {
      if (copyStudents != null && copyStudents.length > 0 && value.length > 0) {
        const arrTemp = [];
        copyStudents.map(stu => {
          if (stu.userName != null && stu.userName != 'undefinedre' && stu.userName.length > 0 && stu.userName.indexOf(value) >= 0) {
            arrTemp.push(stu);
          }
        });
        this.setState({searchStu: arrTemp});
      } else {
        this.setState({searchStu: []});
      }
    }

    return (
      // <div style={{display: switchStatus ? '' : 'none'}} className={styles['studentList']}>
      <div className={switchStatus ? classNames(styles['studentList'], styles['show']) : classNames(styles['studentList'], styles['hide'])}>
        <div className={styles['searchStudent']} style={{overflow:'hidden'}}>
          <Search
            allowClear={true}
            placeholder="学生列表"
            onSearch={SearchName}
            onChange={SearchName}
            // style={{width: 180}}
          />
        </div>
        <div className={styles['list']}>
          {query.jobType === '1' && !query?.isCorrect ?
            <div key={'null'} className={`${styles['student']} ${query.id == '0' ? styles['check'] : ''}`}
                 onClick={() => {
                   query.id !== '0' && handleUrl('0', 'id', resetNumbRemark)
                 }}>
              全部待批阅
            </div> : ''}
          {
            _studentList ? _studentList.map(re => (
                <div key={re.id} className={`${styles['student']} ${query.id == re.id ? styles['check'] : ''}`}
                     onClick={() => handleUrl(re, 'id', resetNumbRemark)}>
                  <div dangerouslySetInnerHTML={{__html: re.userName ? re.userName :'未知学生'}}
                       className={styles['name']}/>
                  <div className={styles['status']}>
                    {
                      tagType(re.isCorrect, re.id, re.score)
                    }
                  </div>
                  <div className={styles['lookReport']}>
                    {
                      re.isCorrect == 1 ? <a onClick={(e) => {
                        // 阻止合成事件的冒泡
                        e.stopPropagation && e.stopPropagation();
                        pushNewPage({
                          id: re.id,
                          jobType: query?.jobType,
                          jobId: query.jobId,
                          equities: re.equities ? 1 : 0//是否有权限查看报告
                        }, '/studentPersonReport', dispatch, 'replace')
                      }
                      }>查看报告</a> : <RedCircle number={re.unCorrectCount}/>
                    }
                  </div>
                </div>
              ))
              :
              <Empty style={{marginTop: 150}}/>
          }
        </div>
      </div>
    )
  }
}
