/**
 * 个人中心-关联
 * @author:熊伟
 * @date:2020年8月22日
 * @version:v1.0.0
 * */
import React from 'react';
import styles from './index.less';
import {  Button,Menu,Pagination } from 'antd';
import { getIcon } from "@/utils/utils";
const IconFont = getIcon();
export default class MyRelevance extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    render (){
        const myRelevanceList=[
            {
                id:1,
                state:1,
                guanxi:'父亲',
                zhanghao:'18212764913',
                mingc:'熊伟',
                time:'2020-08-25',
                icon:'tongzhi1'
            },
            {
                id:2,
                state:2,
                guanxi:'父亲',
                zhanghao:'18212764913',
                mingc:'熊伟',
                time:'2020-08-25',
                icon:'tongguo'
            },
            {
                id:3,
                state:3,
                guanxi:'父亲',
                zhanghao:'18212764913',
                mingc:'熊伟',
                time:'2020-08-25',
                icon:'jujue'
            },
        ]
        const clickOff=(id)=>{
            console.log('点击拒绝',id)
        }
        const clickOpen=(id)=>{
            console.log('点击通过',id)
        }
        return (
            <div className={styles['myRelevance']}>
                {
                    myRelevanceList&&myRelevanceList.map(({id,state,guanxi,zhanghao,mingc,time,icon},index)=>{
                        return (
                            <div className={styles['myRelevance-content']} key={index}>
                                <h1><IconFont type={state==1?'icon-tongzhi1':state==2?'icon-tongguo':state==3&&'icon-jujue'} style={{ fontSize: '25px' }}/>{state==1?'您有一条关联申请':state==2?'您已通过申请':state==3&&'您已拒绝申请'}</h1>
                                <p>关系：{guanxi}</p>
                                <p>申请账号：{zhanghao}</p>
                                <p>账号名称：{mingc}</p>
                                <p>申请时间：{time}</p>
                                {
                                state==1?
                                    <div className={styles['myRelevance-content-btn']}>
                                        <Button  className={styles['myRelevance-content-btn-item1']} onClick={()=>{clickOff(id)}}>拒绝</Button>
                                        <Button  className={styles['myRelevance-content-btn-item2']} onClick={()=>{clickOpen(id)}}>通过</Button>
                                    </div>:null
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}