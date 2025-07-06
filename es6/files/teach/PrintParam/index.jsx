import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import styles from "./index.less";

/**
 * 打印参数组件
 */
export default function PrintParam({
  value,
  onChange,
}) {
  
  const defaultParams = {
    format: 'A4',
    orientation: 'portrait',
    column: '1',
  }

  const [params, setParams] = useState(value || defaultParams)

  useEffect(() => {
    if (value) setParams(value)
  }, [value])

  const handleChange = (key, val) => {
    const newParams = { ...params, [key]: val }
    setParams(newParams)
    onChange && onChange(newParams)
  }

  return (
    <div className={styles.printBox}>
      <span className={styles.printLabel}>打印尺寸：</span>
      <Radio.Group
        value={params.format}
        onChange={e => handleChange('format', e.target.value)}
      >
        <Radio value="A4">A4</Radio>
        <Radio value="A3">A3</Radio>
      </Radio.Group>
      <span className={styles.printLabel}>打印排版：</span>
      <Radio.Group
        value={params.orientation}
        onChange={e => handleChange('orientation', e.target.value)}
      >
        <Radio value="portrait">竖版</Radio>
        <Radio value="landscape">横版</Radio>
      </Radio.Group>
      <span className={styles.printLabel}>打印列数：</span>
      <Radio.Group
        value={params.column}
        onChange={e => handleChange('column', e.target.value)}
      >
        <Radio value="1">单列</Radio>
        <Radio value="2">双列</Radio>
        <Radio value="3">三列</Radio>
        <Radio value="4">四列</Radio>
      </Radio.Group>
    </div>
  );
}
