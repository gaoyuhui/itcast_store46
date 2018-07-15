import axios from 'axios'
var MyAxios = {}
MyAxios.install = function(Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  })
  // 路由守卫
  instance.interceptors.request.use(function (config) {
    if (config.url.toLowerCase() !== 'login') {
      const token = sessionStorage.getItem('token')
      config.headers.Authorization = token
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  instance.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    return Promise.reject(error)
  })
  Vue.prototype.$http = instance
}
export default MyAxios
