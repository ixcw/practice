import { useEffect, useState } from "react"

export const SearchPanel = () => {
  const [param, setParam] = useState({  // 参数状态
    name: '',
    personId: ''
  })
  const [users, setUsers] = useState([])  // 用户状态
  const [list, setList] = useState([])  // 列表状态
  useEffect(() => { // 请求接口
    fetch('').then(async res => {
      if(res.ok) {
        setList(await res.json())
      }
    })
  }, [param])  // 在 param 改变的时候请求
  return <form>
    <div>
      <input type="text" value={param.name} onChange={e => setParam({
        ...param,
        name: e.target.value
      })} />
      <select value={param.personId} onChange={e => setParam({
        ...param,
        personId: e.target.value
      })}>
        <option value="">负责人</option>
        {
          users.map(user => <option value={user.id}>{user.name}</option>)
        }
      </select>
    </div>
  </form>
}