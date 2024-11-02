// components/login/login.js
var code;
var app = getApp()
var timer;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      value: '登 录',
      type: String
    },
    btnText: {
      value: '手机号登录',
      type: String
    },
    showLogin: {
      value: true,
      type: Boolean
    },
    wxLoginEvent: String,
    clickPhoneLogin: String
  },

  /**
   * 组件的初始数据
   */
  data: {
code:''
  },

  ready : function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    })
    timer = setInterval(function () {
      console.log('定时器调用了');
      wx.login({
        success: function (res) {
          if (res.code) {
            that.setData({
              code: res.code
            })
          }
        }
      })
    }, 1000 * 60 * 4);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber: function (e) {
      var that = this

      // console.log(e.detail.errMsg)
      // console.log(e.detail.iv)
      // console.log(e.detail.encryptedData)
      // if (e.detail.encryptedData && e.detail.encryptedData != '') {
      //   //跟斗米服务器交互
      //   wx.login({
      //     success: function (res) {
      //       if (res.code) {
      //         code = res.code;
      //         var verify_mobile = { code: code, mobile: JSON.stringify(e.detail) }
      //         app.getUserInfo(verify_mobile, function (userInfo) {
      //           // that.closeMask()


      //           that.triggerEvent('wxLoginEvent', { result: 0 }) //回调刷新页面事件
      //         })

      //       } else {
      //         that.triggerEvent('wxLoginEvent', { result: 1 })
      //         console.log('获取用户登录态失败！' + res.errMsg)
      //       }
      //     }
      //   });
      // }
      var verify_mobile = { code: this.data.code, mobile: JSON.stringify(e.detail) }
      app.getUserInfo(verify_mobile, function (userInfo) {
        // that.closeMask()

        clearInterval(timer);
        that.triggerEvent('wxLoginEvent', { result: 0 }) //回调刷新页面事件
      })
    },
    closeMask: function () {
      this.setData({
        showLogin: false,
      });

    },
    clickPhoneLogin(e) {

      this.triggerEvent('clickPhoneLogin', {})
    }
  }
})
