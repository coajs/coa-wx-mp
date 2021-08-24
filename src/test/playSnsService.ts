import { WxMpBin, WxMpSnsService } from '..'

export default async (): Promise<void> => {
  // 公众号配置
  const config = {
    appId: 'wxe4fe827f00000000',
    secret: '04277da11000000000000000ddc25c063',
  }

  // 初始化Bin实例
  const bin = new WxMpBin(config)

  // 根据Bin实例，初始化一个服务
  const service = new WxMpSnsService(bin)

  // 从前端获取一个code
  const code = 'XXXXXXXXX'

  // 调用服务 获取Token
  const { accessToken, openid } = await service.getOAuthToken(code)

  console.log({ accessToken, openid })

  // 调用服务 获取用户信息
  const { nickname, unionid } = await service.getUserInfo(accessToken, openid)

  console.log({ nickname, unionid })
}
