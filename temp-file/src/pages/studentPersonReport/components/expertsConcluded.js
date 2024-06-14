/**
 *@Author:ChaiLong
 *@Description:专家总结
 *@Date:Created in  2020/10/13
 *@Modified By:
 */
import React from 'react'
import PropTypes from "prop-types";
import styles from './expertsConcluded.less'
import {DownOutlined, UpOutlined} from '@ant-design/icons';

export default class ExpertsConcluded extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//折叠开关
    }
  }

  static propTypes = {
    isVisible: PropTypes.bool,//是否能展开
    style: PropTypes.object,//自定义样式
    textData: PropTypes.object,//展示的文本
  };

  render() {
    const {style = {}, isVisible = true, textData = {}} = this.props;
    const {visible} = this.state;
    //折叠开关
    const setVisible = () => {
      this.setState({visible: !visible})
    }
    return (
      <div style={style} className={styles['expertsConcluded']}>
        <div className={styles['titleName']}>{textData.title}</div>
        <div className={`${styles['textBox']} ${visible ? styles['foldOff'] : ''}`}>
          {
            textData.textArr.map((re,index) =>
              <div key={index}>
                <div className={styles['subtitle']}>
                  {re.subTitle}
                </div>
                <div className={styles['text']}>
                  {re.depict}
                </div>
              </div>)
          }
        </div>
        {isVisible ? <div onClick={setVisible} className={styles['fold']}>
          {visible ? <UpOutlined width={500}/> : <DownOutlined width={500}/>}
        </div> : ''}
      </div>
    )
  }
}
