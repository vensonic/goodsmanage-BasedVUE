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

// 获取所有角色
export const getRolelist = () => {
  return axios.get('roles').then(result => {
    return result.data
  })
}

// 根据id设置角色
export const setRoleById = (id, rid) => {
  return axios
    .put(`users/${id}/role`, { rid: rid })
    .then(result => {
      return result.data
    })
}

// 根据角色id和权限id删除角色对应的权限

export const delRoleRightByRid = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`)
}

// 角色授权

export const setRolesRight = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: {
      rids: rids
    }
  })
}

// 添加角色

export const addRole = (obj) => {
  return axios.post('roles', obj)
}

// 删除角色
export const delRoleById = (Rid) => {
  return axios.delete(`roles/${Rid}`)
}

// 编辑角色
export const editRoleById = (obj) => {
  return axios.put(`roles/${obj.id}`, obj)
}
