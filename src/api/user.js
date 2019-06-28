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
    let username = localStorage.getItem('username')
    let userId = localStorage.getItem('userId')
    let avatar = localStorage.getItem('avatar')
    let logo = localStorage.getItem('logo')
    let role = localStorage.getItem('role')
    resolve({
      code: 0,
      data: {
        username,
        avatar,
        logo,
        userId,
        role
      },
      msg: '成功'
    })
  })
}