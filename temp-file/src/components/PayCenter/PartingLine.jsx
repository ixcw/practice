/**
 * 分割线组件
 * @author:张江
 * date:2021年01月08日
 * */
// eslint-disable-next-line
import React from 'react';
import {
  Divider,
  Popover
} from 'antd';
import styles from './PartingLine.less';
import PropTypes from 'prop-types'
import { getIcon, existArr } from "@/utils/utils";

const IconFont = getIcon();
export default class PartingLine extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,//名称
    description: PropTypes.string,//描述
    memberList: PropTypes.array,//会员列表
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      popoverVisible: false
    };
  };
  /**
    * 显示
    * @param visible 
    */
  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  render() {
    const { title, description, memberList } = this.props;
    const { popoverVisible } = this.state
    return (
      <div className={styles['parting-line-box']}>
        <Divider className={styles['parting-line']}>{title}</Divider>
        {
          description && !existArr(memberList) ? <p className={styles['parting-line-description']}>{description}</p>
            : null
        }
        {
          existArr(memberList) ? <Popover placement="bottom" content={
            <div className={'member-list-box'}>
              {
                memberList.map((item, index) => {
                  return (<div key={index} className={'member-item'}>
                    <IconFont type={'icon-VIP1'} style={{ fontSize: '18px' }} />
                    <span>{item.memberName}</span>
                    <span>{item.endDate}到期</span>
                  </div>)
                })
              }
            </div>
          }
            visible={popoverVisible}
            onVisibleChange={this.handleVisibleChange}
          >
            <p className={styles['parting-line-description']}>{description}</p>
          </Popover>
            : null
        }
      </div>);
  }
}
