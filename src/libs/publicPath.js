  /** *************** 部署环境 *************** */

  // const requestApi ='https://www.cwsoy.com:81/'
  // const oss ='https://www.cwsoy.com/images/' // 官网
  // const replaceHttp = false

  // const requestApi ='http://192.168.1.24/'
  // const oss ='http://192.168.1.87:8899/'

  const oss ='http://192.168.1.240:8899/'
  const replaceHttp =false

  /** *************** 开发环境 *************** */
  // const devRequestApi ='http://192.168.1.87:8899/'
  const devRequestApi ='http://192.168.1.240:8899/'
  // const devRequestApi ='https://www.cwsoy.com:81/'
  const api = process.env.NODE_ENV === 'production' ? requestApi : devRequestApi

export {
  api,
  oss,
  replaceHttp
}
