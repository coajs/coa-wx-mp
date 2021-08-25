import { WxMpImage } from '../base/WxMpImage'
import { WxMpService } from '../base/WxMpService'

interface OAuthTokenResult {
  accessToken: string
  expiresIn: number
  refreshToken: string
  openid: string
  scope: string
}

interface UserInfoResult {
  openid: string
  nickname: string
  sex: number
  province: string
  city: string
  country: string
  headimgurl: string
  privilege: string[]
  unionid: string
}

/**
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export class WxMpSnsService extends WxMpService {
  /**
   * 通过code换取网页授权access_token
   * @param code
   * @returns OAuthTokenResult
   */
  async getOAuthToken(code: string): Promise<OAuthTokenResult> {
    const query = {
      appid: this.config.appId,
      secret: this.config.secret,
      grant_type: 'authorization_code',
      code,
    }
    return await this.request('GET', '/sns/oauth2/access_token', query)
  }

  /**
   * 刷新access_token
   * @param refresh_token
   * @returns OAuthTokenResult
   */
  async refreshOAuthToken(refreshToken: string): Promise<OAuthTokenResult> {
    const query = {
      appid: this.config.appId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }
    return await this.request('GET', '/sns/oauth2/refresh_token', query)
  }

  /**
   * 拉取用户信息
   * @param accessToken 网页授权接口调用凭证
   * @param openId 用户的唯一标识
   * @param lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   * @returns UserInfoResult
   */
  async getUserInfo(
    accessToken: string,
    openId: string,
    lang: 'zh_CN' | 'zh_TW' | 'en' = 'zh_CN'
  ): Promise<UserInfoResult> {
    const query = {
      access_token: accessToken,
      openid: openId,
      lang,
    }
    const userInfo = await this.request('GET', '/sns/userinfo', query)
    WxMpImage.fieldEncode(userInfo, 'headimgurl')
    return userInfo
  }
}
