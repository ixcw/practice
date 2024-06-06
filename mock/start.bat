@echo off
set /p fileName=json file name: 
set suffix=.json
set fullFileName=%fileName%%suffix%
json-server -p 3001 %fullFileName%
