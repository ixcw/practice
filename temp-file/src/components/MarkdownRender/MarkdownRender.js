import ReactMarkdown from "react-markdown";
// import ReactMarkdown from "react-markdown/with-html";
import RemarkMathPlugin from "remark-math";
import { InlineMath, BlockMath } from 'react-katex-yingqi';
import 'katex/dist/katex.min.css';

export const MarkdownRender = (props) => {
    const newProps = Object.assign({}, props, {
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: Object.assign({}, props.renderers, {
            math: (props) => <BlockMath>{props.value}</BlockMath>,
            inlineMath: (props) => <BlockMath>{props.value}</BlockMath>
            // inlineMath: (props) => <InlineMath>{props.value}</InlineMath>
        })
    });
    return (<ReactMarkdown {...newProps} />);
};
export default MarkdownRender;
