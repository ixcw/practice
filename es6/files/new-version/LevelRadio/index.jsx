import React, { useState } from 'react';
import { Button } from 'antd';
import styles from './index.less';

const LevelRadio = ({ 
  options = ['A类', 'B类', 'C类', 'D类', 'E类'], 
  value, 
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(value || options[0]);

  const handleOptionClick = (option) => {
    const newValue = option;
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={styles['level-radio-container']}>
      {options.map((option, index) => (
        <Button
          block
          key={index}
          type={selectedValue === option ? 'primary' : 'default'}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default LevelRadio;
