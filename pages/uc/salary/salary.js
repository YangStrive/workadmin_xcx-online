var dmNetwork = require('../../../utils/network.js')
var dmConfig = require('../../../config')
var app = getApp()
Page({
  data: {
    webUrl : '',
  },

  onLoad() {
    var cookie = ''
    if (null != app.globalData.userInfo) {
      cookie = app.globalData.userInfo.cookie
    }

    console.log(cookie)
    var qf_host = dmConfig.qf_host;

    this.setData({
      webUrl:  `${qf_host}/salary/salaryList?webCookies=${cookie}` ,
    })
  },

  onShow: function () {
  
  },

  
})