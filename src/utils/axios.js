import axios from 'axios' // 引用axios
import config from '../config'
import qs from 'querystring'

// axios 配置
axios.defaults.timeout = 3000
axios.defaults.baseURL = config.API_URL

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token_info') // 获取存储在本地的token
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded' // axios会自动封装为json。这种做法让后端可以用request.getParams可以获得
    }
    if (token) {
      config.headers.Authorization = 'Token ' + token // 携带权限参数
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default axios
