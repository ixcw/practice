import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.less';

export interface FlexItemProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties,
}

export default class FlexItem extends React.Component<FlexItemProps, any> {
  static defaultProps = {
    prefixCls: 'flex-wrapper-item',
  };

  static propTypes = {
    prefixCls: PropTypes.string,
  };

  render() {
    const { prefixCls, className, style, children } = this.props;
    return (
      <main className={classnames(prefixCls, className)} style={style}>
        {children}
      </main>
    );
  }
}

