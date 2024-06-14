/**
 * 学生分组选择框组件
 * @author:熊伟
 * date:2021年09月24日
 * */
import React, { Component } from 'react';
import { connect } from "dva";
import queryString from 'query-string';
import {
    Spin
} from 'antd';
import PropTypes from 'prop-types';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import studentGroupInfoCache from "@/caches/generalCacheByKey";
import styles from './inputSelect.less';
export default class inputSelect extends Component {

    static propTypes = {
        showStudentGroupModal: PropTypes.bool || false,//是否显示
        setFatherState: PropTypes.func,
        onCloseStudentGroupModal: PropTypes.func,
        studentList: PropTypes.array,
    }
    constructor(props) {
        super(...arguments);
        this.state = {
            isOpen: false,
            defaultSelectedList: [],//默认选中列表
            notChoose: [],//不可选中列表
            optional: [],//可选中,
            defaultSelectedName: []//默认选中列表NAME
        };
    };

    /**
* 页面组件即将卸载时：清空数据
*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidMount() {
        let { defaultSelectedList, notChoose, optional, defaultSelectedName } = this.state;
        const { id, studentList } = this.props;
        //当前组ID
        const currentGroupId = id;
        //为防止刷新不清缓存-
        this.ClearTheCache()
        setTimeout(() => {
            studentList.map((item) => {
                if (item.groupId) {
                    if (currentGroupId == item.groupId) {
                        //默认选中列表
                        defaultSelectedList.push(item.id)
                        defaultSelectedName.push(item.userName)
                        this.setState({
                            defaultSelectedList,
                            defaultSelectedName
                        })
                        studentGroupInfoCache(currentGroupId + 'defaultSelectedList', defaultSelectedList)
                        studentGroupInfoCache(currentGroupId + 'defaultSelectedName', defaultSelectedName)
                    } else {
                        //不可选中列表
                        notChoose.push(item.id)
                        this.setState({
                            notChoose
                        })
                        studentGroupInfoCache(currentGroupId + 'notChoose', notChoose)
                    }
                } else {
                    //可选中
                    optional.push(item.id)
                    this.setState({
                        optional
                    })
                    studentGroupInfoCache(currentGroupId + 'optional', optional)
                }
            })
        })

    }
    //清除缓存
    ClearTheCache() {
        const { findStudentGroup } = this.props;
        findStudentGroup.map((item) => {
            studentGroupInfoCache.clear(item.id + 'defaultSelectedList')
            studentGroupInfoCache.clear(item.id + 'notChoose')
            studentGroupInfoCache.clear(item.id + 'optional')
            studentGroupInfoCache.clear(item.id + 'defaultSelectedName')
        })
    }
    //点击学生
    onClickStudent(studentId, studentName) {
        let { defaultSelectedList, defaultSelectedName } = this.state;
        const {  findStudentGroup, id } = this.props;
        const notChoose = studentGroupInfoCache(id + 'notChoose') || []
        // 判断学生是否不在选中列表中且不在不可选中中（其他组已选）
        if (defaultSelectedList.indexOf(studentId) <= -1 && notChoose.indexOf(studentId) <= -1) {
            defaultSelectedList.push(studentId)
            defaultSelectedName.push(studentName)
            this.setState({
                defaultSelectedList: defaultSelectedList,
                defaultSelectedName: defaultSelectedName
            })
            studentGroupInfoCache(id + 'defaultSelectedList', defaultSelectedList)
            findStudentGroup.map((item) => {
                if (item.id != id) {
                    let arr = studentGroupInfoCache(item.id + 'optional') || []
                    let arr1 = studentGroupInfoCache(item.id + 'notChoose') || []
                    arr.splice(arr.indexOf(studentId), 1)
                    arr1.push(studentId)
                    studentGroupInfoCache(item.id + 'optional', arr)
                    studentGroupInfoCache(item.id + 'notChoose', arr1)
                }
            })
        } else if (defaultSelectedList.indexOf(studentId) > -1) {
            defaultSelectedList.splice(defaultSelectedList.indexOf(studentId), 1)
            defaultSelectedName.splice(defaultSelectedName.indexOf(studentName), 1)
            this.setState({
                defaultSelectedList: defaultSelectedList,
                defaultSelectedName: defaultSelectedName
            })
            studentGroupInfoCache(id + 'defaultSelectedList', defaultSelectedList)
            findStudentGroup.map((item) => {
                if (item.id != id) {
                    let arr2 = studentGroupInfoCache(item.id + 'optional') || []
                    let arr3 = studentGroupInfoCache(item.id + 'notChoose') || []
                    arr2.push(studentId)
                    arr3.splice(arr3.indexOf(studentId), 1)
                    studentGroupInfoCache(item.id + 'optional', arr2)
                    studentGroupInfoCache(item.id + 'notChoose', arr3)
                }
            })
        }
    }
    render() {
        const { isOpen, defaultSelectedName } = this.state;
        const { id, name, studentList } = this.props;
        //当前组ID
        const currentGroupId = id;
        const optional = studentGroupInfoCache(currentGroupId + 'optional') || []
        const defaultSelectedList = studentGroupInfoCache(currentGroupId + 'defaultSelectedList') || []
        const notChoose = studentGroupInfoCache(currentGroupId + 'notChoose') || []

        return (
            <div>
                <div className={styles['Select']} key={id}>
                    <span className={styles['Select-title']}>{name}:&nbsp;&nbsp;&nbsp;</span>
                    <div className={styles['Select-content']} onMouseLeave={() => { this.setState({ isOpen: false }) }} >
                        <span onClick={() => { this.setState({ isOpen: !isOpen }) }} className={styles['span']}>
                            {defaultSelectedName.length > 0 ? defaultSelectedName.join(";") : <span style={{ color: '#9c9c9c' }}>请选择该组学生</span>}
                        </span>
                        <div onClick={() => { this.setState({ isOpen: !isOpen }) }}>
                            {isOpen ? <DownOutlined /> : <UpOutlined />}
                        </div>
                        {
                            isOpen ?
                                <div className={styles['Select-content-item']}>
                                    {studentList.map(({ userName,  id}) => {
                                        return (
                                            <div
                                                className={styles[defaultSelectedList.indexOf(id) > -1 ? 'tag' : notChoose.indexOf(id) > -1 ? 'tag-1' : "Select-content-name"]}
                                                key={id}
                                                onClick={() => { this.onClickStudent(id, userName) }}
                                                title={notChoose.indexOf(id) > -1 ? '该学生已在其他组中' : ''}
                                            >
                                                {userName}
                                            </div>)
                                    })}
                                </div> : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}
