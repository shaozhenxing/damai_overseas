require('../_less/core.less')

const _utils = require('utils')
const _store = require('store')
const _global = require('global')

// console.log(utils.provide('damai.mobile.locals.zh-CN', { damai: { mobile: { c: 3 }, a: { b: 2 } } }))



const vm = avalon.define({
  $id: 'app',
  data: {
    // 国际化
    i18n: {},
    // 搜索关键字
    key: '',
    // 项目列表
    items: []
  },
  // 获取国际化包
  fetchI18n: function () {
    _store.fetchI18n().then(res => {
      this.data.i18n = res.i18n
    })
  },
  // 获取项目列表
  fetchItems: function () {
    _store.fetchItemList(this.data.key).then(res => {
      this.data.items = res
    })
  },
  onCancelClick: function () {
    this.data.key = ''
  },
  onInit: function () {
    this.fetchI18n()
    this.fetchItems()
  }
})

vm.onInit()