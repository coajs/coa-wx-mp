import { _ } from 'coa-helper'

export class WxMpImage {
  static fieldEncode(object: any, field: string, renameField?: string): void {
    if (typeof object[field] === 'string')
      object[renameField ?? field] = WxMpImage.encode(object[field])
  }

  static encode(uri: string = ''): string {
    return _.toString(uri)
      .replace(/https?:\/\//, 'bs_wx/')
      .replace(/\/\d{1,3}$/, '')
      .replace(/\/$/, '')
  }

  static decode(uri: string = ''): string {
    uri = _.toString(uri)
      .replace(/^bs_wx\//, '')
      .replace(/\/\d{1,3}$/, '')
      .replace(/\/$/, '')
    return 'https://' + uri + '/0'
  }
}
