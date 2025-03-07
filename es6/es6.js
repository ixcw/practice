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

const text = "阅读材料，回答问题。\n材料一 中共十一届三中全会以前，农村存在经营管理过于集中和分配中的平均主义等弊端。$\\underline{“创新不是完成一篇小论文，它需要经过实践的检验，这个过程需要反复，成功取决于我们能坚持不懈地为之努力。”}$1978年，全国还有2.5亿农村人口没有解决温饱问题。他们的故事[strong]鲜为人知[strong]，安徽一些地方的基层干部和农民突破旧体制的限制，开始包干到组、包产到户……1980年，邓小平肯定了农民的改革创举，在党中央支持下，家庭联产承包责任制迅速推广。许多地方一年见成效，地方粮食产量明显提高，几年就变了样。如图,在$R$$t$△$A$$B$$C$中,$\\angle C={{90}^{\\circ }},\\angle B={{30}^{\\circ }},AB=2\\sqrt{3},$$A$$D$是$ABC$的角平分线.\n--摘编自《中国共产党简史》\n材料二\n[myImgCur]\n";
const regex = /([^\n$[]+)|(\n)|(\$\\underline\{[^}]+\}\$)|(\[strong\][^[]*\[strong\])|(\[myImgCur\])/g;
const result = [];
let match;

while ((match = regex.exec(text)) !== null) {
  // 按顺序匹配，先遇到什么就匹配什么
  if (match[1]) result.push(match[1]);      // 普通文本
  else if (match[2]) result.push(match[2]); // 换行符
  else if (match[3]) result.push(match[3]); // LaTeX公式
  else if (match[4]) result.push(match[4]); // [strong]内容[strong]
  else if (match[5]) result.push(match[5]); // [myImgCur]
}

console.log(result);