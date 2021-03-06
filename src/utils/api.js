import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router'
import {t} from '../i18n/i18n'
import store from '../store'

axios.interceptors.request.use(config => {
  return config
}, err => {
  Message.error({message: t('message.sys_request_timeout')})
  return Promise.resolve(err)
})
axios.interceptors.response.use(data => {
  if (data.status && data.status === 200) {
    if (data.data && data.data.status === '-12') {
      Message.error({message: t('message.sys_request_need_login')})
      // 跳转到登录页面
      // TODO
      router.replace({path: '/login'})
      return
    } else if (data.data && data.data.status === '-11') {
      Message.error(data.data.msg)
    } else if (data.data && data.data.status === '403') {
      Message.error(data.data.msg)
    } else if (data.data && data.data.status === '401') {
      Message.error(data.data.msg)
    }
  }
  return data.data
}, err => {
  if (err.response.status === 504) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'})
  } else if (err.response.status === 404) {
    Message.error({message: '走错了'})
    // 跳转到404页面
    // TODO
  } else if (err.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'})
  } else if (err.response.status === 500) {
    console.log(err.response)
    Message.error({message: '系统错误，请联系客服人员!'})
  } else {
    console.log(err.response)
    Message.error({message: '未知错误！'})
  }
  return Promise.resolve(err)
})

let base = ''

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}
export const postJsonRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}

export const getRequestParams = (url, params) => {
  var ret = '?'
  var uri = ''
  for (let it in params) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
  }
  uri = `${base}${url}` + ret
  uri = uri.substr(0, uri.length - 1)
  return axios({
    method: 'get',
    url: uri,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + store.state.token
    }
  })
}
