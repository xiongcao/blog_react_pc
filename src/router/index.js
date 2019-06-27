/**
 * 处理路由数据
 */

import routerConfig from '@/router/router'

export const handleJoinPath = (router, path) => {
  router.children && router.children.forEach((item) => {
    handleJoinPath(item, path + item.path)
  })
  router.path1 = path
}

export const filterLayout = (type) => {
  let router
  try {
    routerConfig.forEach((item, i) => {
      if(item.layout == type){
        router = item
        throw new Error("EndIterative");
      }
    })
  } catch (e) {
    if(e.message!='EndIterative'){
      throw e;
    }
  }
  return router
}