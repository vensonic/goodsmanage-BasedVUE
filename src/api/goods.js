import axios from './myaxios'

// 获取所有商品
export const getAllgoods = (obj) => {
  return axios.get('goods', { params: obj })
}

// 添加商品

export const addGoods = (obj) => {
  return axios.post('goods', obj)
}
