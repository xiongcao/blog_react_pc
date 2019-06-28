import axios from '@/libs/api.request'

export const loginIn = (username, password) => {
  return axios.request({  
    url: 'user/loginIn',
    params: {
      username,
      password
    },
    method: 'get'
  })
}

export const getUserInfo = () => {
  return new Promise((resolve) => {
    resolve()
  })
}