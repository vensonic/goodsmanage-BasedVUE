// 引入axios
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 使用export 暴露
export const login = (obj) => {
  // 返回axios对象,是一个promise对象
  return axios.post('login', obj)
    .then((result) => {
      return result.data
    })
}
