import { useState, useEffect } from "react"

export const ClickCounter = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('james')

  function clickHandler() {
    setCount(count + 1)
    setName(name + 2024)
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      console.log(Date.now())
    }, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  return <div>
    <p>{name} 点击了 {count} 次</p>
    <button onClick={clickHandler}>点击</button>
  </div>
}