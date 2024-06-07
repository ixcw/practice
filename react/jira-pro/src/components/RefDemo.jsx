import React, { useEffect, useRef, useContext } from "react"

export const RefDemo = () => {
  const btnRef = useRef(null)

  const ThemeContext = React.createContext('light')
  const theme = useContext(ThemeContext)
  
  useEffect(() => {
    console.log(btnRef.current)  // <button>ref</button>
    console.log(theme)  // light
  }, [])

  return <div>
    <button ref={btnRef}>ref</button>
  </div>
}