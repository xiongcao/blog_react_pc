  /** *************** 部署环境 *************** */

  // const requestApi ='https://www.cwsoy.com:81/'
  // const oss ='https://www.cwsoy.com/images/' // 官网
  // const replaceHttp = true

  // const requestApi ='http://192.168.1.24/'
  // const oss ='http://192.168.1.87:8899/'
  const oss ='http://192.168.1.239:8899/'
  const replaceHttp =false

  /** *************** 开发环境 *************** */
  // const devRequestApi ='https://api.wantianqing.com/'
  // const devRequestApi ='http://192.168.1.24/'
  // const devRequestApi ='http://192.168.1.87:8899/' // 小熊
  const devRequestApi ='http://192.168.1.239:8899/' // 小熊
  const api = process.env.NODE_ENV === 'production' ? requestApi : devRequestApi

export {
  api,
  oss,
  replaceHttp
}
