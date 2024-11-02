var config = require('../../config.js')

var app = getApp()
var code;
var encryptedData;
var iv;
var nickName;
var avatarUrl;

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
    showMask:{
      value:false,
      type:Boolean
    },
    title:{
      value:'快速获取手机号',
      type:String
    },
    btnText: {
      value: '微信绑定的手机号',
      type: String
    },
    useOtherPhoneText: {
      value: '使用其他手机号',
      type: String
    },
    closeImageSrc: {
      value: 'http://cdn.doumistatic.com/107,d9fdd10c9c0ad6.png',
      type: String
    },
    caller: {
      value: '', // invite 表示 invite调用   bxinvite(保险) 表示 bxinvite调用
      type: String
    },
    code: {
      value: '', // 扫描项目邀请的二维码，二维码链接带的code,用于获取用户的信息
      type: String
    },
    customEvent: String,
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {

    getPhoneNumber: function (e) {
      var that = this
      
      // console.log(e.detail.errMsg)
      // console.log(e.detail.iv)
      // console.log(e.detail.encryptedData)
      if (e.detail.encryptedData && e.detail.encryptedData != '') {
        //跟斗米服务器交互
        wx.login({
          success: function (res) {
            if (res.code) {
              code = res.code;
              var verify_mobile = { code: code, mobile: JSON.stringify(e.detail) }
//, iv: iv, encryptedData: encryptedData, nickName: nickName, avatarUrl: avatarUrl
              app.getUserInfo(verify_mobile, function (userInfo) {
                that.closeMask()
                that.triggerEvent('customevent', {}) //回调刷新页面事件
              })

            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    },
    closeMask: function () {
      this.setData({
        showMask: false,
      });
      
    },
    useOtherPhone: function () {
      // console.log('../phonelogin/phonelogin?code=' + code + '&iv=' + iv + '&encryptedData=' + encryptedData + '&avatarUrl=' + avatarUrl + '&nickName=' + nickName);
      var that = this
      wx.navigateTo({
        url: '../uc/phonelogin/phonelogin?code=' + that.data.code + '&iv=' + iv + '&encryptedData=' + encryptedData + '&avatarUrl=' + avatarUrl + '&nickName=' + nickName + '&caller=' + that.data.caller
      })
    },
  }
})