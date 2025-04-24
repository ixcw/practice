from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
  return {"message": "Hello, 宝子们！欢迎来到花姐的 FastAPI 课程"}