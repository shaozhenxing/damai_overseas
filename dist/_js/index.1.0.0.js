webpackJsonp([1],{0:function(t,n,i){t.exports=i(26)},26:function(t,n,i){"use strict";i(27);var e=(i(31),i(103)),a=(i(102),avalon.define({$id:"app",data:{i18n:{},key:"",items:[]},fetchI18n:function(){var t=this;e.fetchI18n().then(function(n){t.data.i18n=n.i18n})},fetchItems:function(){var t=this;e.fetchItemList(this.data.key).then(function(n){t.data.items=n})},onCancelClick:function(){this.data.key=""},onInit:function(){this.fetchI18n(),this.fetchItems()}}));a.onInit()}});