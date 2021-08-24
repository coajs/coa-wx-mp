import { $ } from 'coa-helper'
import playSnsService from './playSnsService'

$.run(async () => {
  // 在这里写执行方法
  await playSnsService()
})
