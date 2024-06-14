/**
 *@Author:xiongwei
 *@Description:年级报告右上选择---
 *@Date:Created in  2021/4/30
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
import { DownOutlined, UpOutlined, CloseOutlined } from '@ant-design/icons';
import { existArr } from "@/utils/utils";
import { GradeReport as namespace } from '@/utils/namespace'
import { Button, Checkbox } from "antd";
import { connect } from 'dva'
@connect(state => ({
  GradeReportClassInfoList: state[namespace].findGradeReportClassInfo,
}))
export default class SelectModal extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      ModalOnOff: false,
      value: [],
    }
  }
  /**
* 页面组件即将卸载时：清空数据
*/
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {

  }
  //
  onChange = (value) => {
    this.setState({
      value
    })
  }
  //点击确认
  onClickOk = () => {
    const { outputParameter, defaultValue = [] } = this.props;
    const { value } = this.state;
    this.setState({
      ModalOnOff: false,
    })
    if (existArr(value)) {
      outputParameter(value);
    } else {
      outputParameter(defaultValue);
    }
  }
  render() {
    const { ModalOnOff } = this.state;
    const { GradeReportClassInfoList = [], defaultValue = [], } = this.props;
    const GradeReportClassInfoLists = [{ id: -1, className: '全校' }, ...GradeReportClassInfoList];
    const checkboxOptions = []
    let titleStr = ''
    GradeReportClassInfoLists.map(({ id, className }) => {
      checkboxOptions.push({ value: id, label: className, })
      defaultValue.map((item) => {
        if (item == id) {
          if (titleStr == '') {
            titleStr = titleStr + className
          } else {
            titleStr = titleStr + 'VS' + className
          }
        }
      })
    })
    return (
      <div className={styles['SelectModal']}>
        <div className={styles['SelectModal-absolute']}>
          <div className={styles['Select-leve']}>
            {this.props.children}
          </div>
          <div className={styles['Select']}>

            <div className={styles['Select-title']} onClick={() => { this.setState({ ModalOnOff: !ModalOnOff }) }}>
              <span title={titleStr}>班级：{titleStr}</span>
              <div className={styles['icon']}>{ModalOnOff ? <DownOutlined /> : <UpOutlined />}</div>
            </div>

            {
              ModalOnOff ?
                <div className={styles['Modal']}>
                  <div className={styles['Modal-title']}>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;选择班级</p>
                    <Button className={styles['Modal-title-btn']} onClick={() => { this.setState({ ModalOnOff: false }) }}><CloseOutlined /></Button>
                  </div>
                  <div className={styles['Modal-Checkbox']}>
                    {
                      existArr(checkboxOptions) ?
                        <Checkbox.Group onChange={(value) => { this.onChange(value) }} defaultValue={defaultValue} options={checkboxOptions} />
                        : ''
                    }
                  </div>
                  <div className={styles['Modal-btns']}>
                    <Button type="primary" onClick={() => { this.onClickOk() }}>确定</Button>
                    <Button style={{ marginLeft: '20px' }} onClick={() => { this.setState({ ModalOnOff: false }) }}>取消</Button>
                  </div>
                </div> : ''
            }
          </div>
        </div>
      </div>
    )
  }
}