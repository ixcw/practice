@echo off
set /p message=please input commit message: 
git pull
git cmp %message%
echo %message% update successfully
pause