import { _ } from 'coa-helper'
import { WxMpService } from './WxMpService'

interface WxMpAccessToken {
  token: string
  expireOn: number
}

interface WxMpJsapiTicket {
  ticket: string
  expireOn: number
}

export class WxMpServiceAuth extends WxMpService {
  // 获取Token
  async getAccessToken() {
    const cacheName = `WxMpAccessToken:${this.bin.config.appId}`

    // 尝试从存储中获取
    let { token = '', expireOn = 1 } =
      (await this.bin.storage.get<WxMpAccessToken>(cacheName)) ?? {}

    // 如果不存在，则从微信获取
    if (!token) {
      const { appId, secret } = this.bin.config
      const query = { grant_type: 'client_credential', appid: appId, secret }
      const data = await this.request('GET', '/cgi-bin/token', query)
      const ms = _.toInteger(data.expiresIn) * 1e3 - 10 * 1e3
      expireOn = _.now() + ms
      token = data.accessToken || ''
      await this.bin.storage.set(cacheName, { token, expireOn }, ms)
    }

    // 返回结果
    return { token, access_token: token, expireOn }
  }

  // 获取Ticket
  async getJsapiTicket() {
    const cacheName = `WxMpJsapiTicket:${this.bin.config.appId}`

    // 尝试从存储中获取
    let { ticket = '', expireOn = 1 } =
      (await this.bin.storage.get<WxMpJsapiTicket>(cacheName)) ?? {}

    // 如果不存在，则从微信获取
    if (!ticket) {
      const { access_token } = await this.getAccessToken()
      const query = { access_token, type: 'jsapi' }
      const data = await this.request('GET', '/cgi-bin/ticket/getticket', query)
      const ms = _.toInteger(data.expiresIn) * 1e3 - 10 * 1e3
      expireOn = _.now() + ms
      ticket = data.ticket || ''
      await this.bin.storage.set(cacheName, { ticket, expireOn }, ms)
    }

    // 返回结果
    return { ticket, expireOn }
  }
}
