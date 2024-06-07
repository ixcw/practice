import { useEffect, useState } from "react"

export const FriendStatus = ({ friendId }) => {
  const [status, setStatus] = useState(false)

  useEffect(() => {
    console.log(`开始监听 ${friendId} 的在线状态`)
    
    return () => {
      console.log(`结束监听 ${friendId} 的在线状态`)
    }
  })

  return <div>
    好友 {friendId} 在线状态：{status.toString()}
  </div>
}