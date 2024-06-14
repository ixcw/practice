import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
const RichText = ({ value, onChange }) => {
	// 富文本编辑配置
	const modules = React.useMemo(
		() => ({
			toolbar: {
				container: [
					['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
					['blockquote', 'code-block'], // 字体样式
					['link', 'image'], // 上传图片、上传视频
					[{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
					[{ script: 'sub' }, { script: 'super' }], // 下角标，上角标
					[{ indent: '-1' }, { indent: '+1' }], // 缩进
					[{ align: [] }], // 居中
					// [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
					[{ color: [] }, { background: [] }], // 文字颜色、背景颜色选择
					[{ direction: 'rtl' }], // 文字输入方向
					[{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
					// [{ lineheight: ['1', '1.5', '1.75', '2', '3', '4', '5'] }], // 自定义行高
					['clean'] // 清除样式
				]
			},
			clipboard: {
				matchers: [[]]
			}
		}),
		[]
	)

	const handleChange = content => {
		onChange(content)
		console.log(content)
		console.log(value)
	}

	return <ReactQuill  style={{ height: '200px' }} placeholder='请输入内容' modules={modules} value={value} onChange={handleChange} />
}

export default RichText
