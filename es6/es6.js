const input = "关于函数$f(x)=\\left\\{ \\begin{matrix}\n   x\\text{sin}\\frac{1}{x}\\,\\,,\\,\\,x\\ne 0  \\\\\n   \\quad 0\\,,\\,\\,\\quad x=0  \\\\\n\\end{matrix} \\right.$的下列说法中，不正确的是(    ). \n"
// 正则匹配并去除 $...$ 之间的换行符，但保留文本中的 \n
const output = input.replace(/\$([\s\S]*?)\$/g, (match, content) => {
  // 只在公式部分移除换行符（\n），保留文本中的 \n
  const sanitizedContent = content.replace(/\\n/g, '\\n').replace(/\n/g, ' ');
  return `$${sanitizedContent}$`;
});

console.log(input);
console.log(output);

