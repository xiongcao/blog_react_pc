import * as Fetch from '@/libs/fetch'

export const login = (formVal, history, type) => {
  return (dispatch) => {
    // dispatch(loadingActions.showLoading());

    Fetch.get(`user/loginIn?username=${formVal.username}&password=${formVal.password}`).then((res) => {
      // dispatch(loadingActions.hideLoading());
      if (res.code === 0) {
        dispatch(heandlLogin(res.data))
        if (type === 1) { // 前台登录弹窗
          location.reload()
        } else {
          // 没有发生异常，跳转至主页
          history.push("/admin/home")
        }
      }
    });
  };
};

export const heandlLogin = user => {
  return {
    type: 'LOGIN',
    user
  }
}

export const heandlOutLogin = () => {
  return {
    type: 'OUT_LOGIN'
  }
}