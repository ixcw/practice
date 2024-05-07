// 只要包含有abc就行
var rg = /^abc$/
console.log(rg.test('1abc'))
console.log(rg.test('aabcdabc123abc'))
console.log(rg.test('abc'))