/**
 *@Author:xiongwei
 *@Description:报告布局
 *@Date:Created in  2021/4/28
 *@Modified By:
 */
import styles from "./ReportLayout.less";
import React from 'react';
import classNames from 'classnames';
import ReportBaner from './ReportBaner.js'


export default class ReportLayout extends React.Component {
    render() {
        const { url,children } = this.props
        return (
            <div>
                <div className={styles['ReportLayout']}>
                    <ReportBaner url={url} />
                    <div className={classNames(styles['Report-content'], 'Report-sprin-Box')}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}