// 引入axios
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器设置请求token
axios.interceptors.request.use(function (config) {
  // 在发送请求之前设置请求的token
  var token = localStorage.getItem('shoppro_token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 使用export 暴露
export const login = (obj) => {
  // 返回axios对象,是一个promise对象
  return axios.post('login', obj)
    .then((result) => {
      return result.data
    })
}

// 获取所有用户信息
export const getUserslist = (obj) => {
  return axios.get('users', { params: obj })
    .then((result) => {
      return result.data
    })
}

// 修改用户状态
export const updateUserStautsById = (type, id) => {
  return axios.put(`users/${id}/state/${type}`).then(result => {
    return result.data
  })
}
// 新增用户

export const addUser = (obj) => {
  return axios.post('users', obj).then(result => {
    return result.data
  })
}
// 编辑提交

export const updateUserById = (obj) => {
  return axios.put(`users/${obj.id}`, obj).then(result => {
    return result.data
  })
}

// 根据id删除用户

export const delUserStautsById = (id) => {
  return axios.delete(`users/${id}`).then(result => {
    return result.data
  })
}
