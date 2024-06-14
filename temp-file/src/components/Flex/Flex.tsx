import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import './index.less';

export interface FlexProps {
  prefixCls?: string;
  className?: string;
  direction?: string,
  justify?: string,
  align?: string,
  isItem?: boolean,
  style?: React.CSSProperties,
}

export default class Flex extends React.Component<FlexProps, any>{

  static Item;

  static defaultProps = {
    prefixCls: 'flex-wrapper',
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    direction: PropTypes.string,
    justify: PropTypes.string,
    align: PropTypes.string,
    isItem: PropTypes.bool,
  };

  render() {
    const { className, children, direction, style, isItem, justify, align, prefixCls } = this.props;
    const _className = classname(className, prefixCls, {
      [prefixCls + '-direction-' + direction]: direction,
      [prefixCls + '-justify-' + justify]: justify,
      [prefixCls + '-align-' + align]: align,
      [prefixCls + '-item']: isItem
    });

    return (
      <section className={_className} style={style}>
        {children}
      </section>
    );
  }
}


