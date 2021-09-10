import { WxMpBin, WxMpServiceAuth } from '..'

export default async (): Promise<void> => {
  // 公众号配置
  const config = {
    appId: 'wx6243719a1c817905',
    secret: 'e5999c13940bb5305fd166807b674d0b',
  }

  // 初始化Bin实例
  const bin = new WxMpBin(config)

  // 根据Bin实例，初始化一个服务
  const service = new WxMpServiceAuth(bin)

  // 获取 AccessToken
  const { access_token } = await service.getAccessToken()
  console.log({ access_token })

  // 获取 JsapiTicket
  const { ticket } = await service.getJsapiTicket()
  console.log({ ticket })
}
