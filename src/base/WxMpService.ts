import { WxMpAxiosMethod } from './WxMpAxios'
import { WxMpBin, WxMpConfig } from './WxMpBin'

export class WxMpService {
  protected readonly bin: WxMpBin
  protected readonly config: WxMpConfig

  constructor(bin: WxMpBin) {
    this.bin = bin
    this.config = bin.config
  }

  async request(
    method: WxMpAxiosMethod,
    url: string,
    query: {},
    body = {}
  ): Promise<any> {
    return await this.bin.request({ method, url, params: query, data: body })
  }
}
