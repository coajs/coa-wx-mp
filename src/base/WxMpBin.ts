import { CoaError } from 'coa-error'
import { $, _ } from 'coa-helper'
import {
  WxMpAxios,
  WxMpAxiosRequestConfig,
  WxMpAxiosResponse,
} from './WxMpAxios'
import { WxMpStorage } from './WxMpStorage'

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
  readonly storage: WxMpStorage

  constructor(config: WxMpConfig, storage?: WxMpStorage) {
    this.config = config
    this.storage = storage ?? new WxMpStorage()
  }

  // 请求并处理错误
  async request(request: WxMpAxiosRequestConfig): Promise<any> {
    // 错误配置
    const res = await WxMpAxios.request({ baseURL, ...request }).catch((e) => e)

    // 处理返回结果
    try {
      return this.handleResponse(res)
    } catch (e: any) {
      // 触发错误事件
      this.onRequestError(e, res)
      throw e
    }
  }

  // 当错误时触发
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onRequestError(_error: Error, _res: WxMpAxiosResponse): void {
    // do something on error
  }

  private handleResponse(res: WxMpAxiosResponse): any {
    const data = res.data ?? {}
    const errorCode = _.toNumber(data.errcode) ?? 0

    if (errorCode > 0) {
      // 默认错误处理
      const errorMessage =
        DefaultErrorMessage[errorCode] ??
        _.toString(data.errmsg).replace(/rid: [0-f-]+$/, '') ??
        DefaultErrorMessage.default

      CoaError.throw(`CoaWxMp.WxReturnError.${errorCode}`, errorMessage)
    }

    // 返回结果
    return _.isPlainObject(data) ? $.camelCaseKeys(data) : data
  }
}
