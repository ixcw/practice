const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const groupList = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'es6/json/preview/question/q16.json'),
  'utf-8'
));
const paperPreview = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'es6/json/preview/template/t16.json'),
  'utf-8'
));
const mergedDb = {
  local: {
    groupList,
    paperPreview
  }
};

const server = jsonServer.create();
const router = jsonServer.router(mergedDb);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(6666, () => {
  console.log('JSON Server is running on port 6666');
});