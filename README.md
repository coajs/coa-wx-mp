# coa-wx-mp

一个超简单的微信公众号 SDK for Node.js

## 特征

根据日常实际项目使用情况：

- 覆盖了常用使用场景
- 统一了异步表现形式，全部返回 Promise
- 内置类型引用，无需额外查看文档，开箱即用，IDE 友好

## 快速开始

### 安装

```shell
yarn add coa-wx-mp
```

### 直接使用

```typescript
import { WxMpBin, WxMpSnsService } from 'coa-wx-mp'

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
```

### 记录错误信息

```typescript
import { WxMpBin, WxMpSnsService } from 'coa-wx-mp'

// 自定义bin实例
class MyWxMpBin extends WxMpBin {
  // 自定义请求异常的事件
  onRequestError(error, res) {
    // 在这里记录错误
    console.log(error)
    console.log(res)
  }
}

// 初始化自定义的Bin实例
const myBin = new MyWxMpBin(config)

// 根据自定义的Bin实例，初始化一个服务
const service = new WxMpSnsService(myBin)

// 从前端获取一个code
const code = 'XXXXXXXXX'

// 调用服务 获取Token
const { accessToken, openid } = await service.getOAuthToken(code)

// 错误地调用服务 获取Token
const { accessToken, openid } = await service.getOAuthToken() // onRequestError 会记录这条错误信息
```
