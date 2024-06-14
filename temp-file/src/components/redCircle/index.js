/**
 *@Author:ChaiLong
 *@Description:
 *@Date:Created in  2021/8/18
 *@Modified By:
 */
import React from "react";
import styles from './redCircle.less'
import propTypes from 'prop-types'


export default function RedCircle({number}) {
  return (<>
    {number ? <div className={styles['redCircle']}>
      {number}
    </div> : ''}
  </>)
}

RedCircle.prototype = {
  number: propTypes.number
}
