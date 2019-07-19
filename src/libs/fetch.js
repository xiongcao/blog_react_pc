import { message } from 'antd';
import { api } from '@/libs/publicPath.js'
const request = (url, config) => {
  return fetch(api + url, config).then((res) => {
    return res.json();
  }).then((res) => {  // 所有成功失败都走这儿
    if (res.code || res.code === 0) {  // 即使请求失败，只要有code就是服务端给处理了异常
      if (res.code !== 0) {
        message.error(res.msg);
        if (res.code === -1) {
          localStorage.clear()
          console.log('跳login页')
          // window.location.replace('/#/login')
          // window.location.reload()
        }
      }
      return res;
    } else {  // 服务器异常 400 404 500
      throw Error(res.status + ": " +res.error);
    }
  }).catch((e) => {
    message.error(e.message);
  });
};

// GET请求
export const get = (url, data) => {
  if (data) {
    let i = 0
    for(let key in data) {
      if (data.hasOwnProperty(key)) {
        if (i === 0) {
          url += `?${key}=${data[key]}`
        } else {
          url +=  `&${key}=${data[key]}`
        }
        i++
      }
    }
  }
  return request(url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    }
  );
};

// POST请求
export const post = (url, data) => {
  return request(url, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    credentials: 'include',
    mode: 'cors'
  });
};

// DELETE请求
export const del = (url) => {
  return request(url, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'DELETE',
    credentials: 'include',
    mode: 'cors'
  });
};