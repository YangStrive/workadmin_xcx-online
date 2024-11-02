var config = require('../../config.js')

var app = getApp()
var code;
var encryptedData;
var iv;
var nickName;
var avatarUrl;
var dmNetwork = require('../../utils/network.js')

Page({})
Component({
  ready: function () {
    console.log('BooleanBooleanBoolean')
    // if (this.data.showMask)
    // {
    //   this.getUserInfo()
    //   // this.getUserInfoSetting()
    // }
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    showMask: {
      value: false,
      type: Boolean
    },
    title: {
      value: '快速获取手机号',
      type: String
    },
    btnText: {
      value: '微信绑定的手机号',
      type: String
    },
    customEvent: String,
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {

    getUserInfo: function (e) {
      var that = this
      console.log('----------');

      if (e.detail.encryptedData && e.detail.encryptedData != '') {
        //跟斗米服务器交互
        that.triggerEvent('customevent', { e: e.detail.userInfo })
        
        dmNetwork.post(dmNetwork.update_account,
          {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
          },
          (res) => {
            if (res.data.errno == 0) {
              
            } else {
              // wx.showToast({
              //   title: res.data.errmsg,
              //   icon: 'none'
              // })
            }
          }, (err) => {
            // wx.showToast({
            //   title: '网络连接失败',
            //   icon: 'none'
            // })
          })        
      }else{
        that.triggerEvent('customevent', { e: ''})
      }
    },
    closeMask: function () {
      this.setData({
        showMask: false,
      });

    }
  }
})