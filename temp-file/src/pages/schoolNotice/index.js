/**
 * 消息通知
 * @author:熊伟
 * @date:2022年4月26日
 * @version:v1.0.0
 * */
import React from 'react';
import { connect } from 'dva';
import { Input, Upload, notification, Table, Space, Button, Modal } from 'antd'
import { SchoolNoticeHistory as namespace } from '@/utils/namespace';
import { existArr } from '@/utils/utils';
import { InboxOutlined } from '@ant-design/icons';
import styles from './index.less';
import queryString from 'query-string';
import Editor from '@/components/Editor'
import { getKeyThenIncreaseKey } from 'antd/lib/message';
const { confirm } = Modal;
const { Dragger } = Upload;
@connect(state => ({
}))
export default class SchoolNotice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            visible: false,
            title: '',
            attachment: [],//附件
        };
    }
    componentDidMount() {
        const {
            dispatch,
            location,
        } = this.props;
        const { search } = location;
        const query = queryString.parse(search) || {};
        query.id && dispatch({
            type: namespace + '/checkSchoolMessage',
            payload: {
                id: query.id,
            },
            callback: (result) => {
                const { content, title, annex } = result
                this.setState({
                    title,
                    attachment: annex ? annex.split(';') : '',//附件
                })
                this.detailRef.setState({
                    editorContent: content
                })
            }
        })
    }
    /**
* 获取detailRef
* @param ref
*/
    getDetailRef = (ref) => {
        this.detailRef = ref;
    }
    //修改标题
    titleOnChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }
    //保存通知
    saveNotice = () => {
        const { dispatch, location } = this.props;
        const { search } = location;
        const query = queryString.parse(search) || {};
        const { title, attachment } = this.state;
        const { editorContent, } = this.detailRef.state;
        const annex = Array.isArray(attachment) ? attachment.join(';') : ''
        const resetState = () => {
            this.setState({
                title: '',
                attachment: []
            })
            this.detailRef.editor.txt.clear()
        }
        //保存
        dispatch({
            type: namespace + '/schoolMessageSave',
            payload: {
                id: query.id ? query.id : null,
                title: title,
                content: editorContent,
                annex,
            },
            callback: (result) => {
                resetState()
                notification.success({ message: '保存成功', description: '' });
            }
        })

    }
    //发送通知
    sendNotice = () => {
        const { dispatch,location } = this.props;
        const { title, attachment } = this.state;
        const { editorContent, } = this.detailRef.state;
        const { search } = location;
        const query = queryString.parse(search) || {};
        let annexContent = '<p>附件：<p>'
        Array.isArray(attachment) && attachment.map((item, index) => {
            annexContent += `<p key=${index}><a download=${item.name} href=${item.url}>
        ${index + 1}:${item.name}
        </a></p>;`})
        const resetState = () => {
            this.setState({
                title: '',
                attachment: []
            })
            this.detailRef.editor.txt.clear()
        }
        confirm({
            title: '确认发送通知？',
            content: '确认发送之后信息无法修改并发送到接收端。',
            onOk() {
                dispatch({
                    type: namespace + '/saveAndPushMessage',
                    payload: {
                        id:query.id?query.id:null,
                        title: title,
                        content: editorContent,
                        annex: annexContent,
                    },
                    callback: (result) => {
                        resetState()
                        notification.success({ message: '发送成功', description: '' });
                    }
                })
                //   notification.success({ message: '发送成功', description: '' });
            },
            onCancel() { },
        });
    }
    //接收file对象
    handleReturn = (file) => {
        const { dispatch } = this.props;
        const { attachment } = this.state
        if (JSON.stringify(file) === "{}") {
            notification.warn({
                message: '警告信息',
                description: '请先上传文件！',
            })
            return
        }
        const fileSize = file.size / 1024 / 1024 < 20;
        if (!fileSize) {
            notification.warn({
                message: '警告信息',
                description: `${file.name}文件大小超出20M，请修改后重新上传`,
            })
            return;
        }
        if (JSON.stringify(file) !== "{}" && file.name) {
            let formData = new FormData();
            formData.append('file', file);
            dispatch({
                type: namespace + '/uploadFile',
                payload: {
                    formData,
                },
                callback: (result) => {
                    this.setState({
                        attachment: [...attachment, `<span><a download=${file.name} href=${result}>${file.name} </a></span>`,]
                    })
                }
            })
            // const fileSuffixA = file.name.split('.');
            // console.log(file.name)
            // const fileSuffix = fileSuffixA[fileSuffixA.length - 1];
            // if (fileSuffix === 'pdf') {
            //     this.setState({ file })
            // } else {
            //     notification.warn({
            //         message: '警告信息',
            //         description: '请上传文件扩展名必须为：pdf等！',
            //     })
            // }
        }
    };
    //删除attachment
    deleteAttachment = (index) => {
        let { attachment } = this.state;
        attachment.splice(index, 1)
        this.setState({
            attachment,
        })
    }
    render() {
        const { file, visible, title, attachment } = this.state;
        const uploadProps = {
            beforeUpload: this.handleReturn,
            multiple: false,
            showUploadList: false,
        };
        return (
            <div className={styles['schoolNotice']}>
                <div className={styles['head']}>
                    <div className={styles['headmain']}>
                        <h1>编辑您要发送的通知</h1>
                        <div className={styles['btn']}>
                            <Button onClick={() => { this.saveNotice() }}>保存</Button>
                            <Button onClick={() => { this.sendNotice() }}>发送通知</Button>
                        </div>
                    </div>
                    <div>
                        <Input
                            placeholder="请输入标题"
                            title='标题'
                            value={title}
                            onChange={this.titleOnChange}
                        // onPressEnter={this.onInputPressEnter}
                        />
                    </div>
                    <div>
                        <Editor onRef={this.getDetailRef} />
                    </div>
                    {existArr(attachment) ? <div>
                        <h1>附件：</h1>
                        <div>
                            {attachment.map((item, index) =>
                                <p key={index}>
                                    <span>{index + 1}:</span>
                                    <span dangerouslySetInnerHTML={{ __html: item }}></span>
                                    <Button onClick={() => { this.deleteAttachment(index) }}>删除</Button>
                                </p>
                            )}
                        </div>
                    </div> : ''}
                    <div>
                        <div className='upload-pdf-box'>
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">--添加附件--</p>
                                {
                                    file ? <span style={{ color: '#1890ff' }}>{file.name}</span> : ''
                                }
                            </Dragger>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
