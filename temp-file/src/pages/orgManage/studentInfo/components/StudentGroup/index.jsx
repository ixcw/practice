/**
 * 学生分组
 * @author:熊伟
 * date:2021年09月24日
 * */
import React, { Component } from 'react';
import { connect } from "dva";
import queryString from 'query-string';
import {
  Modal,
  Spin
} from 'antd';
import PropTypes from 'prop-types';
import InputSelect from './inputSelect'
import styles from './index.less';
export default class StudentGroup extends Component {

  static propTypes = {
    showStudentGroupModal: PropTypes.bool || false,//是否显示
    onCloseStudentGroupModal: PropTypes.func,
    setFatherState: PropTypes.func,
    findStudentGroup: PropTypes.array,
    studentList: PropTypes.array,
  };

  constructor(props) {
    super(...arguments);
    this.state = {
    };
  };

  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    // schoolInfoCache.clear();
  }
  componentDidMount() {

  }

  render() {
    const {
      showStudentGroupModal,
      onCloseStudentGroupModal,
      location,
      loading,
      findStudentGroup,
      studentList
    } = this.props;
    return (
      <Modal
        visible={showStudentGroupModal}
        destroyOnClose={true}
        title={"学生分组"}
        width={"80%"}
        onOk={_ => {
          onCloseStudentGroupModal(1)
        }}
        onCancel={_ => {
          onCloseStudentGroupModal()
        }}
      >
        <Spin spinning={!loading}>
          <div className={styles['Select']}>
            {
              findStudentGroup.map(({ id, name }) => {
                return (
                  <InputSelect
                    id={id}
                    name={name}
                    findStudentGroup={findStudentGroup}
                    key={id}
                    studentList={studentList}
                  />)
              })
            }
          </div>
        </Spin>
      </Modal>
    )
  }
}
