import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器设置请求token
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前设置请求的token
    var token = localStorage.getItem('shoppro_token')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 获取分类目录数据
export const getCategories = (obj) => {
  return axios.get('categories', { params: obj })
}
