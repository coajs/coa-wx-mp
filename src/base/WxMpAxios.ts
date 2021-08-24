import { $, Axios, axios } from 'coa-helper'

export type WxMpAxiosMethod = Axios.Method
export type WxMpAxiosResponse = Axios.AxiosResponse
export type WxMpAxiosRequestConfig = Axios.AxiosRequestConfig

const baseURL = 'https://api.weixin.qq.com'

export class WxMpAxios {
  // 请求并处理错误
  static async request(
    request: WxMpAxiosRequestConfig,
    retryTimes = 0
  ): Promise<any> {
    // 处理返回结果
    try {
      return await axios.request({ baseURL, ...request })
    } catch (e: any) {
      // 触发重试机制
      if (retryTimes < 3 && (e.statusCode !== 200 || e.data?.errcode === -1)) {
        await $.timeout(retryTimes * 200)
        return await this.request(request, retryTimes + 1)
      } else {
        return e
      }
    }
  }
}
