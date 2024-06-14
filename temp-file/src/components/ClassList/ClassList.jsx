/**
 * 班级列表组件
 * @author:张江
 * date:2020年09月09日
 * */
// eslint-disable-next-line
import React from 'react';
import queryString from 'query-string';
import {
  Empty,
  Pagination
} from 'antd';
import paginationConfig from '@/utils/pagination';
import styles from './ClassList.less';
import PropTypes from 'prop-types'
import classNames from 'classnames';

export default class ClassList extends React.Component {

  static propTypes = {
    classList: PropTypes.any,//班级列表
    defaultSelectedClass: PropTypes.any,//默认选中的班级code
    isPaging: PropTypes.bool,//是否分页
    selectedClassCodeChange: PropTypes.func,//班级选中回调以及页码变化函数
    boxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//传入box高度
  };

  constructor(props) {
    super(...arguments);
    this.state = {
      selectedClassCode: '',
      page: 1,

    };
  };

  componentDidMount() {
    const {defaultSelectedClass} = this.props;
    this.setState({
      selectedClassCode: defaultSelectedClass ? defaultSelectedClass : ''
    })

  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const {selectedClassCode} = this.state;
    const {location} = nextProps;
    const {search} = location;
    const query = queryString.parse(search);
    const nextPropsDefaultSelectedClass = query ? query.classId : '';
    if (selectedClassCode != nextPropsDefaultSelectedClass && !!nextPropsDefaultSelectedClass) {
      this.setState({selectedClassCode: nextPropsDefaultSelectedClass})
    }
  }

  /**
   * 选中班级
   * @param learningLevelCode  ：班级code
   */
  handleSelectedClassCodeChange = (selectedClassCode) => {
    const {selectedClassCodeChange} = this.props;
    const {page} = this.state
    if (selectedClassCodeChange && typeof selectedClassCodeChange == 'function') {
      selectedClassCodeChange(selectedClassCode, page)
    }
    this.setState({
      selectedClassCode,
    })
  }

  render() {
    const {classList = [], isPaging, selectedClassCodeChange, boxHeight = '71.5vh'} = this.props;
    const {selectedClassCode, page} = this.state

    const handlePageChange = (page, pageSize) => {
      if (selectedClassCodeChange && typeof selectedClassCodeChange == 'function' && isPaging) {
        selectedClassCodeChange(selectedClassCode, page)
      }
      this.setState({
        page: page
      })
      // this.questionLoadingTip();
      // this.replaceSearch({ p: page, s: pageSize })
    };
    return (
      <div className={styles['class-info']}>
        {
          classList && classList.length > 0 ?
            <div className={styles['class-list-box']} style={{height: isPaging ? '' : boxHeight}}>
              {
                classList.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={selectedClassCode == item.id ? classNames(styles['class-item'], styles['active']) : classNames(styles['class-item'])}
                      onClick={() => {
                        this.handleSelectedClassCodeChange(item.id)
                      }}
                    >
                      {item.fullName || item.name}
                    </div>
                  )
                })
              }
            </div> : <div className={styles['not-data']}>
              <Empty description='暂无班级'/>
            </div>
        }

        {
          classList && classList.length > 0 && isPaging ? <div className={styles['page-box']}>
              <Pagination
                size="small"
                {...paginationConfig({s: 30, p: page}, 50)}
                onChange={handlePageChange}
              />
            </div>
            : null
        }

      </div>
    );
  }
}
