'use strict'

import '../_lib/event'

const _global = require('global')
const _utils = require('utils')

let store = new EventEmitter()
let cache = {}

let api = {
  // 国际化
  i18n: {
    // 语言包
    lang: 'http://localhost/damai/mobile/english/server/i18n/lang.php'
    // lang: 'http://www.veli.com.cn/h5/damai/mobile/english/server/i18n/lang.php'
  },
  // 项目列表接口
  item: {
    getList: 'http://localhost/damai/mobile/english/server/model/getItemList.php'
    // getList: 'http://www.veli.com.cn/h5/damai/mobile/english/server/model/getItemList.php'
  }
}


/**
 *
 * 获取国际化包
 *
 * @return { Promise }
 *
 */

store.fetchI18n = () => {
  const url = api.i18n.lang
  const opt = {
    method: 'POST',
    // 跨域携带 cookie
    credentials: 'include'
  }
  
  /**
   *  本地 localStorage 数据结构
   *
   *  damai.mobile.overseas.i18n
   *
   *  {
   *    "lang": "zh-CN",
   *    "locals": {
   *      "en": { ... }
   *      "jp": { ... }
   *    },
   *    "version": "0.0.1"
   *  }
   *  
   */

  /**
   *  判断是否支持本地存储
   *
   *  支持本地存储则 body 携带参数 localstorage = true, version = damai.mobile.overseas.i18n.version
   *
   *  本地版本号和服务器不一致会返回语言包 locals，此时更新本地缓存
   *  版本号一致则不会返回语言包，直接从本地缓存读取
   *
   *  如果不支持本地存储，body 不携带任何参数，直接从服务器返回值中读取
   *
   */
  let support_localstorage = _utils.browser.detection( 'localstorage' )

  let params = {}

  params.localstorage = support_localstorage

  if ( support_localstorage ) {
    let version = _utils.storage.get('i18n') ? _utils.storage.get('i18n').version : undefined

    params.version = version;
  }

  opt.body = JSON.stringify( params )

  return fetch(url, opt)
    .then(res => res.json())
    .then(res => {
      // 每次获取国际化包后设置 cookie 语言字段
      // _utils.cookie.set('lang', res.lang)

      let result = {}
      
      if ( support_localstorage ) {
        // 支持本地存储

        // 如果版本号不一致，返回语言包，更新本地语言包
        if ( res.locals ) {
          _utils.storage.set('i18n', res)
        }

        result = _utils.storage.get('i18n').locals[res.lang]
      } else {
        // 不支持本地存储
        result = res.locals[res.lang]
      }

      return result
    })
}


/**
 *
 * 获取项目列表接口
 *
 * @return { Promise }
 *
 */

store.fetchItemList = key => {
  let form = new FormData()

  form.append('key', key)

  const url = api.item.getList
  const opt = {
    // 跨域携带 cookie
    credentials: 'include'
  }

  return fetch(url, opt)
    .then(res => res.json())
    .then(res => {
      if (res.status.code === 200) {
        return res.data
      } else {
        return res.message
      }
    })
    .catch(e => {
      return e
    })
}

module.exports = store