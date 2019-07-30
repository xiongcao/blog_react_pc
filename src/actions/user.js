import * as Fetch from '@/libs/fetch'

export const login = (formVal, history) => {
  return (dispatch) => {
    // dispatch(loadingActions.showLoading());

    Fetch.get(`user/loginIn?username=${formVal.username}&password=${formVal.password}`).then((res) => {
      // dispatch(loadingActions.hideLoading());
      if (res.code === 0) {
        dispatch(heandlLogin(res.data))
        // 没有发生异常，跳转至主页
        history.push("/admin/home")
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