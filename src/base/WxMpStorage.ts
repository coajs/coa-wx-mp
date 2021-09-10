export class WxMpStorage {
  private DATA: { [index: string]: { value: any; expire: number } } = {}

  async get<T>(key: string): Promise<T | undefined> {
    const { value, expire } = this.DATA[key] || { expire: 0 }
    if (expire < Date.now()) return undefined
    return value as T
  }

  async set(
    key: string,
    value: Record<string, any>,
    ms: number
  ): Promise<void> {
    const expire = Date.now() + ms
    this.DATA[key] = { value, expire }
  }
}
