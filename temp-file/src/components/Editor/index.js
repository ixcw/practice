/**
 * Editor
 * @author:熊伟
 * @date:2022年4月26日
 * @version:v1.0.0
 * */
import React, { Component } from 'react';
import E from 'wangeditor';
import { connect } from 'dva';
import AlertMenu from './submitmenu';
import { SchoolNoticeHistory as namespace } from "@/utils/namespace";
//import { inject, observer } from 'mobx-react'
//import { withRouter } from 'react-router-dom'

//@withRouter @inject('appStore') @observer
@connect(state => ({
}))
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: ''
        };
    }
    UNSAFE_componentWillMount() {

    }
    componentDidUpdate(){
        const { editorContent } = this.state
        if(this.editor.txt.html()==editorContent){
            return
        }
        this.editor.txt.html(editorContent) // 重新设置编辑器内容
    }
    componentDidMount() {
        const {
            dispatch
        } = this.props;
        // const { editorContent } = this.state
        const elemMenu = this.refs.editorElemMenu;
        const elemBody = this.refs.editorElemBody;
        const editor = new E(elemMenu, elemBody)
        this.editor = editor
        // 菜单 key ，各个菜单不能重复
        const menuKey = 'submitmenu'
        this.props.onRef(this);
        // 注册菜单
        // E.registerMenu(menuKey, AlertMenu)
        editor.config.zIndex = 1
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.config.onchange = html => {
            // console.log(editor.txt.html())
            this.setState({
                // editorContent: editor.txt.text()
                editorContent: editor.txt.html()
            })
        }
        // editor.config.html='<p>sfasdfasdf</p>'
        //  设置图片最大尺寸
        editor.config.uploadImgMaxSize = 3 * 1024 * 1024;

        //  是否显示网络图片入口
        editor.config.showLinkImg = false;

        //  
        editor.config.customUploadImg = function (resultFiles, insertImgFn) {
            // resultFiles 是 input 中选中的文件列表
            // insertImgFn 是获取图片 url 后，插入到编辑器的方法
            // 此处调接口可使用filereader.onload、
            // console.log(file)
            let formData = new FormData();
            formData.append('files', resultFiles[0]);
            dispatch({
                type: namespace + '/uploadPictures',
                payload: {
                    formData: formData,
                },
                callback: (result) => {
                    insertImgFn(result)
                }
            });

            // 回调链图片接插入到富文本中
            // insertImgFn(imgUrl)
        }
        //  是否显示网络视频入口
        editor.config.showLinkVideo = false;
        //上传视频
        editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
            // resultFiles 是 input 中选中的文件列表
            // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
            // client.put('myVideo', resultFiles[0])
            //   .then(function (res) {
            //     // 上传视频，返回结果，将视频插入到编辑器中
            //     insertVideoFn(res.url)
            //   }).catch(function (err) {
            //     console.log(err)
            //   })
        }
        editor.config.linkCheck = function (text, link) {
            console.log(text) // 插入的文字
            console.log(link) // 插入的链接

            return true // 返回 true 表示校验成功
            // return '验证失败' // 返回字符串，即校验失败的提示信息
        }
        // 隐藏菜单栏提示
        // editor.config.showMenuTooltips = true
        // 菜单栏提示为下标
        editor.config.menuTooltipPosition = 'down'
        editor.config.menus = [
            'head',
            'bold',
            'fontSize',
            'fontName',
            'italic',
            'underline',
            'strikeThrough',
            'indent',
            'lineHeight',
            'foreColor',
            'backColor',
            // 'link',
            'list',
            'todo',
            'justify',
            'quote',
            'emoticon',
            'image',
            // 'video',
            'table',
            'code',
            'splitLine',
            'undo',
            'redo',
        ]
        editor.config.uploadImgShowBase64 = true
        editor.create()
        
    };

    render() {
        return (
            <div>
                <div className="text-area" >
                    <div ref="editorElemMenu"
                        style={{ backgroundColor: '#f1f1f1', border: "1px solid #ccc" }}
                        className="editorElem-menu">

                    </div>
                    <div
                        style={{
                            padding: "0 10px",
                            overflowY: "scroll",
                            height: 500,
                            border: "1px solid #ccc",
                            borderTop: "none"
                        }}
                        // dangerouslySetInnerHTML = {{ __html: editorContent }}
                        ref="editorElemBody" className="editorElem-body">
                    </div>
                </div>
            </div>
        );
    }
}

export default Editor;

