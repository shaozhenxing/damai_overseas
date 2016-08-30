'use strict'

// utils

const _global = require('global')

let _module = {}

_module = window.utils = {
  // 浏览器
  browser: {
    // 特性检测
    detection: function ( key ) {
      const features = {
        localstorage: window.localStorage ? true : false
      }

      if ( key ) {
        return features[key]
      } else {
        return features
      }
    }
  },
  // cookie
  cookie: {
    // 设置 cookie
    set: function(key, value, path, times) {
      var date = new Date(),
        time = times || 30 * 24 * 60 * 60 * 1000 // 榛樿瀛樺偍30澶�

      date.setTime(date.getTime() + time)

      document.cookie = key + '=' + encodeURI(value) + ';expires=' + date.toGMTString() + (path ? (';path=' + path) : ';path=/')
    },
    // 获取 cookie
    get: function(key) {
      var cookies = document.cookie.split('; ')

      for (var i = 0, len = cookies.length; i < cookies.length; i++) {
        var tmp = cookies[i].split('=')

        if (tmp[0] == key) {
          return decodeURI(tmp[1])
        }
      }
    },
    // 删除 cookie
    remove: function(key) {
      this.set(key, 1, -1)
    },
    // 更新 cookie
    update: function(key, val) {
      this.remove(key)

      this.set(key, val)
    }
  },
  /* 深度克隆 */
  clone: function ( source ) {
    var str, target = source.constructor === Array ? [] : {}

    if ( typeof source !== 'object' ) {
      return
    } else if( window.JSON ) {
      str = JSON.stringify( source ),  // 系列化对象
      target = JSON.parse( str )  // 还原
    } else {
      for ( var key in source ) {
        target[key] = typeof source[key] === 'object' ? this.clone(source[key]) : source[key] 
      }
    }

    return target
  },

  /**
   *  空间解析
   *
   *  通过 damai.mobile 解析成 json 对象 { damai: { mobile: {} } }
   */   
  provide: function ( namespace, context, val ) {
    var spaces = namespace.split( '.' ), pointer = {}, result = context || {}

    pointer = this.clone( result )

    for ( var i = 0, len = spaces.length; i < len; i++ ) {
      if ( pointer[spaces[i]] ) {
        pointer = pointer[spaces[i]]
      } else {
        pointer = pointer[spaces[i]] = {}
      }

      if ( i === 0 ) {
        result[spaces[i]] = pointer
      }
    }

    return result
  },
  // 本地存储
  storage: {
    set: function ( key, val ) {
      let space = [ _global.config.namespace, key ].join( '.' )
      let local = window.localStorage[ space ]

      if ( local === undefined ) window.localStorage[ space ] = JSON.stringify({})
      
      window.localStorage[ space ] = JSON.stringify( val )
    },
    get: function ( key ) {
      let space = [ _global.config.namespace, key ].join( '.' )
      let local = window.localStorage[ space ]

      if ( local === undefined ) return undefined

      return JSON.parse( local )
    }
  }
}

module.exports = _module