require('../../_less/core.less')
require('../../_less/components/common/_hdbar.less')
require('../../_less/components/common/_sellst.less')

const _utils = require('utils')
const _store = require('store')

const vm = avalon.define({
  $id: 'app',
  data: {
    // 语言
    lang: '',
    // 国际化
    i18n: {},
    // 语言列表
    items: [
      {
        'lang': 'en',
        'txt': 'English'
      }, {
        'lang': 'zh-CN',
        'txt': '中文（简体）'
      }, {
        'lang': 'zh-HK',
        'txt': '中文（繁体）'
      }, {
        'lang': 'jp',
        'txt': '日本語'
      }
    ]
  },
  // 获取国际化包
  fetchI18n: function () {
    _store.fetchI18n().then(res => {
      this.data.i18n = res.i18n

      this.data.lang = res.lang
    })
  },
  onLangClick: function (item) {
    _utils.cookie.set('lang', item.lang)

    this.fetchI18n()
  },
  onInit: function () {
    this.fetchI18n()
  }
})

vm.onInit()