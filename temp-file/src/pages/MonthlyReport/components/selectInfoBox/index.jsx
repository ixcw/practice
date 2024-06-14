/**
 * 选择代理类型盒子组件
 * @author：熊伟
 * @creatTime : 2020年07月1日
 * @version:v1.0.0
 */
import React from 'react';
import styles from './index.less';
export default class SelectInfoBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    render (){
        const {value,selectedType,onChangeSelected}=this.props;
        const {totalNum,typeName,totalMoney,shareMoney,typeId}=value;
        return (
            <div>
                <div className={styles[selectedType == typeId ? 'item-selected' : 'item-no-select']} onClick={() => {
                  onChangeSelected(typeId)
              }}>
                <div className={styles['item-title']}>
                {typeName}
                          <h4>{totalNum}家</h4>
                </div>
                <div className={styles['item-description']}>
                  <p>总收入：{totalMoney}</p>
                  <p>分润：{shareMoney}</p>
                </div>
              </div>
            </div>
        )
    }
}