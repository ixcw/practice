// 1. 导入express模块
const express = require('express')
// 2. 创建web服务器
const app = express()
// 3. 启动服务器
app.listen(80, () => {
  console.log('express is running at localhost')
})

// 监听get请求，响应json数据
app.get('/user', (req, res) => {
  let user = {
    name: 'zs',
    age: 20,
    gender: '男'
  }
  res.send(user)
})

app.post('/user', (req, res) => {
  console.log(req.query)
  res.send('post请求成功')
})

app.use(express.static('./statics'))
app.use(express.static('./statics2'))