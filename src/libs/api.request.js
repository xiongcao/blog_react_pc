import HttpRequest from '@/libs/axios'
import { api } from '@/libs/publicPath.js'

const axios = new HttpRequest(api)
export default axios
