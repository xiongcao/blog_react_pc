export const handleLogin = user => (dispatch, getState) => {
  console.log(dispatch, getState, '处理登录的action')
  return {
      type: 'LOGIN',
      user
  }
}