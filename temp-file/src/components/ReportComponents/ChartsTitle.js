/**
 *@Author:ChaiLong
 *@Description:title模板
 *@Date:Created in  2021/3/8
 *@Modified By:
 */
import styles from "./chartsTitle.less";


export  default (props) => {
  const {name = '', subTitle = ''} = props;
  return (
    <div className={styles['studentChartsTitleBox']}>
      <div className={styles['chartsTitle']}>
        <div className={styles['colorLine']}/>
        <div className={styles['name']}>
          {name}
        </div>
        <div className={styles['subTitle']}>{subTitle}</div>
      </div>
      <div className={styles['chart']}>
        {props.children}
      </div>
    </div>
  )
}
