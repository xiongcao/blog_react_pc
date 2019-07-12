export const handleLogin = user => {
  console.log(user, '处理登录的action')
  return {
    type: 'LOGIN',
    user
  }
}