import { CoaError } from 'coa-error'
import { $, _ } from 'coa-helper'
import {
  WxMpAxios,
  WxMpAxiosRequestConfig,
  WxMpAxiosResponse,
} from './WxMpAxios'

export interface WxMpConfig {
  appId: string
  secret: string
}

export interface WxMpErrorMessage {
  default: string
  [code: string]: string
}

const baseURL = 'https://api.weixin.qq.com'

const DefaultErrorMessage: WxMpErrorMessage = {
  default: '微信服务返回错误',
  '-1': '微信系统繁忙，请重试',
}

export class WxMpBin {
  readonly config: WxMpConfig

  constructor(config: WxMpConfig) {
    this.config = config
  }

  // 请求并处理错误
  async request(request: WxMpAxiosRequestConfig): Promise<any> {
    // 错误配置
    const res = await WxMpAxios.request({ baseURL, ...request }).catch((e) => e)

    // 处理返回结果
    try {
      return this.handleResponse(res)
    } catch (e) {
      // 触发错误事件
      this.onRequestError(e, res)
      throw e
    }
  }

  // 当错误时触发
  protected onRequestError(_error: Error, _res: WxMpAxiosResponse): void {}

  private handleResponse(res: WxMpAxiosResponse): any {
    const data = res.data ?? {}
    const errorCode = _.toNumber(data.errcode) ?? 0

    if (errorCode > 0) {
      // 默认错误处理
      const errorMessage =
        DefaultErrorMessage[errorCode] ??
        _.toString(data.errmsg) ??
        DefaultErrorMessage.default

      CoaError.throw(`CoaWxMp.WxReturnError.${errorCode}`, errorMessage)
    }

    // 返回结果
    return _.isPlainObject(data) ? $.camelCaseKeys(data) : data
  }
}
