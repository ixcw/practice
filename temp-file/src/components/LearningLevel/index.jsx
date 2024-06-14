/**
 * 学级选择组件
 * @author:张江
 * date:2020年09月09日 
 * */
// eslint-disable-next-line
import React from 'react';
import {
  Empty,
  Pagination,
  Select
} from 'antd';
import { particularYear } from '@/utils/const';
import styles from './index.less';
import PropTypes from 'prop-types'

const { Option } = Select;

export default class LearningLevel extends React.Component {

  static propTypes = {
    learningLevelCode: PropTypes.any,//学级code
    selectedLearningLevelCodeChange: PropTypes.func,//选择学级code变化
  };
  constructor(props) {
    super(...arguments);
    this.state = {

    };
  };

  render() {
    const { learningLevelCode,selectedLearningLevelCodeChange } = this.props;

    return (
      <div>
        <label>学级：</label>
        <Select
          value={learningLevelCode}
          style={{ width: 160 }}
          onChange={selectedLearningLevelCodeChange}>
          {
            particularYear && particularYear.map((item) => {
              return (<Option key={item.code} value={item.code}>{item.code}级</Option>)
            })
          }
        </Select>
      </div>
    );
  }
}
