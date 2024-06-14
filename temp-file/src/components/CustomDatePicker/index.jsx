/*
 * @Author: 韦靠谱 weikaopu@qq.com
 * @Date: 2024-05-22 10:18:57
 * @LastEditors: 韦靠谱 weikaopu@qq.com
 * @LastEditTime: 2024-05-24 17:53:02
 * @Description: 日期选择器中添加“至今”文本
 */
import React, { useEffect, useState } from 'react'
import { DatePicker, Button, Input } from 'antd'
import moment from 'moment'

const CustomDatePicker = ({ initialValue, onChange }) => {
  const [extraDatePicker, setExtraDatePicker] = useState(true)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  
  useEffect(() => {
    if (initialValue === '至今') {
      setExtraDatePicker(false)
      setInputValue(initialValue)
    } else if (moment(initialValue, 'YYYY-MM')?.isValid()) {
      setExtraDatePicker(true)
      setInputValue(moment(initialValue?.substring(0, 7), 'YYYY-MM'))
    } else {
      setExtraDatePicker(true)
    }
  }, [initialValue])

  const handleRenderDatePickerExtraFooter = () => {
    const newValue = !extraDatePicker
    setExtraDatePicker(newValue)
    setDatePickerOpen(true)
    onChange(newValue ? null : '至今')
    setInputValue(newValue ? null : '至今')
  }

  const handleDatePickerChange = (date, dateString) => {
    onChange(dateString)
    setInputValue(date)
  }

  return (
    <>
      {extraDatePicker ? (
        <DatePicker
          picker='month'
          open={datePickerOpen}
          value={inputValue}
          onOpenChange={open => setDatePickerOpen(open)}
          onChange={handleDatePickerChange}
          renderExtraFooter={() => (
            <Button type='link' block onClick={handleRenderDatePickerExtraFooter}>
              至今
            </Button>
          )}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          style={{ width: '100%' }}
        />
      ) : (
        <Input value={inputValue} onClick={handleRenderDatePickerExtraFooter} />
      )}
    </>
  )
}

export default CustomDatePicker
