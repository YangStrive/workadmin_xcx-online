// components/checkcode/checkcode.js
var dmNetwork = require('../../utils/network.js')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      value: '手机号登录',
      type: String
    },
    btnText: {
      value: '登 录',
      type: String
    },
    showCheck: {
      value: false,
      type: Boolean
    },
    onClickClose: String,
    onLoginResult: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    getcodestatus: false,
    getcodetext: '获取验证码',
    agingetcode: true,
    phone: '',
    msmcode: '',
    canClick:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPhoneInput: function (e) {
      var value = e.detail.value;
      var newVal = (value.replace(/\D/g, '')).replace(/\s/g, '');
      if (typeof + newVal != 'number') {
        return newVal;
      }
      if (newVal.length === 11) {
        this.setData({ getcodestatus: true, phone: newVal })
      } else {
        this.setData({ getcodestatus: false, phone: '' })
      }
    },
    bindCodeInput: function (e) {
      var value = e.detail.value;
      var newVal = (value.replace(/\D/g, '')).replace(/\s/g, '');
      if (typeof + newVal != 'number') {
        return newVal;
      }
      if (newVal.length === 6) {
        this.setData({ msmcode: newVal })
      } else {
        this.setData({ msmcode: '' })
      }
    },
    getcode: function () {
      if (!this.data.getcodestatus || !this.data.agingetcode) return;
      this.setData({ agingetcode: false });
      this.getcodeToLogin()
      this.updateTime()
    },
    onLogin: function () {
      var that = this

      //手机号登陆
      var verify_mobile = { code: this.data.code, verify_mobile: JSON.stringify({ mobile: this.data.phone, code: this.data.msmcode }) }
      //, iv: this.data.iv, encryptedData: this.data.encryptedData, nickName: this.data.nickName, avatarUrl: this.data.avatarUrl
      var that = this
      //跟斗米服务器交互

      app.getUserInfo(verify_mobile, function (userInfo) {
        if (null != userInfo && null != userInfo.cookie) {
          that.triggerEvent('onLoginResult', { result: 0 })
        } else {
          console.log(this.data.onLoginResult, 1111111)

          wx.showToast({
            title: '登录失败',
            icon: 'none',
            mask: true,
            duration: 1500
          })
          that.triggerEvent('onLoginResult', { result: 1 })
        }
      })


    },
    getcodeToLogin() {
      if (!this.data.canClick){
        return
      }
      this.setData({
        canClick:false
      })
      var that = this;
      dmNetwork.get(
        dmNetwork.getcode,
        { mobile: that.data.phone },
        (res) => {
          if (res.data.errno == 0) {
            wx.showToast({
              title: '发送成功!',
              success: () => {
                var time = 60;
                that.setData({ getcodetext: '60s', getcodestatus: false });
                var thetimer = setInterval(function () {
                  that.setData({ getcodetext: --time + 's' });
                  if (time === -1) {
                    clearInterval(thetimer);
                    var switchCk = false;
                    if (that.data.phone.length < 11) {
                      switchCk = false;
                    } else {
                      switchCk = true;
                    }
                    that.setData({ getcodetext: '重新获取', canClick: true,getcodestatus: switchCk, agingetcode: switchCk });
                  }
                }, 1000)
              }
            })
          } else {
            that.setData({ getcodestatus: true, canClick:true, agingetcode: true })
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
            })
          }
        },
        (res) => {
          that.setData({ getcodestatus: true, agingetcode: true });
        }
      )
    },
    updateTime() {
      var that = this
      var time = 60;
      that.setData({ getcodetext: '60s', getcodestatus: false });
      var thetimer = setInterval(function () {
        that.setData({ getcodetext: --time + 's' });
        if (time === -1) {
          clearInterval(thetimer);
          var switchCk = false;
          if (that.data.phone.length < 11) {
            switchCk = false;
          } else {
            switchCk = true;
          }
          that.setData({ getcodetext: '重新获取', getcodestatus: switchCk, agingetcode: switchCk });
        }
      }, 1000)
    },
    closeMask() {
      this.triggerEvent('onClickClose', {})
    },
    onClickLogin(e) {

      if (this.data.phone.length !== 11 || this.data.msmcode.length !== 6) return;
      wx.login({
        success: (res) => {
          this.setData({ code: res.code })
          this.onLogin()
        },
        fail: () => {
          wx.showToast({
            title: '获取登录信息失败',
            icon: 'none',
          })

        }
      })
    }
  }
})
