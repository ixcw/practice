/**
 *@Author:xiongwei
 *@Description:报告banner图
 *@Date:Created in  2021/4/28
 *@Modified By:
 */
import styles from "./ReportBaner.less";


export  default (props) => {
  const {url=''} = props;
  return (
    <div className={styles['ReportBaner']} style={{backgroundImage:`url(${url})`}}>
    </div>
  )
}