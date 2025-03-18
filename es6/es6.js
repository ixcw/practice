// const text = `也是他对年轻人的期许。$\\underline{“创新不是完成一篇小论文，它需要经过实践的检验，这个过程需要反复，成功取决于我们能坚持不懈地为之努力。”}$
// “我人生的最大乐趣是成为一名教师”`;

// // 正则表达式匹配 \underline{...}
// const regex = /\$\\underline\{([^}]+)\}\$/g;

// // 替换为 HTML 结构
// const result = text.replace(regex, '<span style="text-decoration: underline;color:green;">$1</span>');

// console.log(result);

// function transformText(text) {
//   return text.split(/(\$\\underline{[^}]*}\$)/g) // 仅拆分 $\underline{...}$
//       .map(part => 
//           part.startsWith('$\\underline{') 
//               ? `<span style="text-decoration: underline;color:green;">${part.slice(12, -2)}</span>` // 去掉 $\underline{ 和 }$
//               : part
//       );
// }

// // 测试
// let text = '也是他对年轻人的期许。$\\underline{“创新不是完成一篇小论文，它需要经过实践的检验，这个过程需要反复，成功取决于我们能坚持不懈地为之努力。”}$\n“我人生的最大乐趣是成为一名教师”\n⑧1978年，国家恢复研究生招生。39岁的李德仁再次回到恩师王之卓身边，攻读研究生。 随后，他拿到珍贵的留学资格，投身到国际著名摄影测量与遥感学家阿克曼教授$\\underline{“创新不是完成一篇小论文”}$门下攻读博士。\n⑨“阿克曼教授给了我一个航空测量领域世界性的难题。”';

// console.log(transformText(text));

// const text = "<span class=\"katex\"><span class=\"katex-mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><munder accentunder=\"true\"><mtext>“创新不是完成一篇小论文，它需要经过实践的检验，这个过程需要反复，成功取决于我们能坚持不懈地为之努力。成功取决于我们能坚持不懈地为之努力。成功取决于我们能坚持不懈地为之努力。”</mtext><mo stretchy=\"true\">‾</mo></munder></mrow><annotation encoding=\"application/x-tex\">\\underline{“创新不是完成一篇小论文，它需要经过实践的检验，这个过程需要反复，成功取决于我们能坚持不懈地为之努力。成功取决于我们能坚持不懈地为之努力。成功取决于我们能坚持不懈地为之努力。”}</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.8944em;vertical-align:-0.2em;\"></span><span class=\"mord underline\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.6944em;\"><span style=\"top:-2.84em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"underline-line\" style=\"border-bottom-width:0.04em;\"></span></span><span style=\"top:-3em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"mord\"><span class=\"mord\">“</span><span class=\"mord cjk_fallback\">创新不是完成一篇小论文，它需要经过实践的检验，这个过程需要反复，成功取决于我们能坚持不懈地为之努力。成功取决于我们能坚持不懈地为之努力。成功取决于我们能坚持不懈地为之努力。</span><span class=\"mord\">”</span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.2em;\"><span></span></span></span></span></span></span></span></span>";

// const match = text.match(/\\underline\{([^}]+)\}/)
// const result = match ? match[1] : '未匹配到内容'
// console.log(result)

// const token = 'Bearer%2BeyJraWQiOiI0NWJjNzE1ZC0wMjQwLTRiNjAtOWVhMS1iMDk1NTMyYTIyODAiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNTM0NDQ0NDQ0NCIsImF1ZCI6ImJ1cmVhdV9zY2hvb2xfd2ViX2NsaWVudCIsIm5iZiI6MTc0MTc3Njg4OSwic2Nob29sX2lkIjoiNzciLCJ1c2VyX2lkIjoiMzA5ODE2Iiwic2NvcGUiOlsic3lzdGVtX2VudHJ5Iiwib3BlbmlkIiwicHJvZmlsZSIsImNsaWVudF93ZWIiXSwiaXNzIjoiaHR0cHM6Ly9nZzY2LmNuIiwiZXhwIjoxNzQxNzk4NDg5LCJpYXQiOjE3NDE3NzY4ODksImF1dGhvcml0aWVzIjpbIkNMQVNTX0hFQUQiLCJURUFDSEVSIl19.MjqCmwaXYMYl737NQwqwJD50-1fAY5Rua8Sy1TEJV1Mh-KDD7nTF80T4-idFmR8SDa6TuCzDDTTKvo5VbxgGrbimKAJGTtNHAgIMeqcI_gObEsaVx95buAsoxTP7AAdck7xxt06Mwv3iDmmy9FDHm9Nn79C9qPPhks28srfNgdtMWTZo7wLmpe5CsvwK1WvBnhrDSCIwRWW2QKvOhYQRnHXv3WjtxUMdhXpjTaGkzft3wUd8sQoJb2kQUeGH5lgIISRQQ8DAJO53vv08YwR93QjdYIkPrb228-nDN2k89OtJS1LnKxi1fBEO4n-aOk89580gJrBXxx-XMYrjcVF1BQ'

// const newToken = decodeURIComponent(token).replace('+', ' ')
// console.log('newToken: ', newToken)