/**
 *@Author:xiongwei
 *@Description:ChartsTitle
 *@Date:Created in  2021/3/9
 *@Modified By:
 */
import React from 'react'
import styles from './index.less'
export default class ChartsTitle extends React.Component {
    constructor(props) {
        super(...arguments);
        this.state = {
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
    render() {
        const {name = '', subTitle = ''} = this.props;
        return (
            <div className={styles['studentChartsTitleBox']}>
                <div className={styles['chartsTitle']}>
                    <div className={styles['colorLine']} />
                    <div className={styles['name']}>
                        {name}<span className={styles['subTitle']}>{subTitle}</span>
                    </div>
                    {/* <div className={styles['subTitle']}>{subTitle}</div> */}
                </div>
                <div className={styles['chart']}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}