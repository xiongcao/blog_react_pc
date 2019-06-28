import HttpRequest from '@/libs/axios'
import publicPath from '@/libs/publicPath.js'

const baseUrl = process.env.NODE_ENV === 'development' ? publicPath.devRequestApi : publicPath.requestApi

const axios = new HttpRequest(baseUrl)
export default axios
