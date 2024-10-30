import React, { useMemo, useState } from "react";

function Children({ userInfo }) {
  console.log('Children render', userInfo)

  return <div>this is Children, {userInfo.name} {userInfo.age}</div>
}

function Father() {
  console.log('Father render')
  const [count, setCount] = useState(0)
  const [name, setName] = useState('jack')
  const userInfo = { name, age: 20 }

  return <div>
    <Children userInfo={userInfo} />
    {count}
    <button onClick={() => setCount(count + 1)}>count++</button>
  </div>
}

export default Father