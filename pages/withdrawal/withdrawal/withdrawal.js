// pages/withdrawal/withdrawal/withdrawal.js

var dmNetwork = require('../../../utils/network.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxId: '',
    phone: '',
    getcodetext: '获取验证码',
    codeSw: true,
    timeout: 60,
    code: '',
    imgcode: '',
    showmask: false,
    imgcodeid: '',
    mobile: '',
    configurl: 'sim'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loading()
    this.getUserInfo()
  },
  getUserInfo: function() {
    let that = this;
    dmNetwork.get(dmNetwork.withdrawaldetail, {
      account_type: 2
    }, (res) => {
      wx.hideLoading()
      if (res.data.errno == 0) {
        let data = res.data.data,
          mobile = data.mobile;
        that.setData({
          wxId: data.account,
          mobile: mobile,
          phone: mobile ? mobile.substring(0, 3) + '****' + mobile.substring(7) : ' ',
          balance: data.balance
        })
      } else {}
    })
  },
  unbindwx: function() {
    wx.showModal({
      title: '解绑',
      content: '是否确认解绑微信账户',
      success: function(sm) {
        if (sm.confirm) {
          let that = this;
          dmNetwork.post(dmNetwork.unbindwx, {
            account_type: 2
          }, (res) => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '解绑成功',
                icon: 'succes'
              })
              setTimeout(function() {
                wx.redirectTo({
                  url: '../mywallet/mywallet'
                })
              }, 1500)
            } else {}
          })
        } else {}
      }
    })

  },
  getCode: function() {
    // let that = this;
    // that.setData({ codeSw: false })
    // var cookie = ''
    // if (null != app.globalData.userInfo) {
    //   cookie = app.globalData.userInfo.cookie
    // }
    // wx.request({
    //   url: 'https://jz-c-' + that.data.configurl + '.doumi.com/api/mini/client/validatecode',
    //   method: 'POST',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "Cookie": cookie,
    //     "AccessToken": " LmRlaxA+Ms/BTJMj+vNCVQ1CFshZPgIaEWyzFooW4nDdkhb4nFsHCtRZpjOf41e0zFfT7Zi6",
    //   },
    //   data: { mobile: that.data.mobile, code: that.data.imgcodeid },
    //   success: (res) => {
    //     if (res.data.code == 0) {
    //       that.setData({ codeSw: false, getcodetext: '60s' })
    //       that.counttime()
    //       //this.changeimgcode()
    //     } else {
    //       wx.showToast({ title: res.data.message, icon: 'none' })
    //       that.setData({ codeSw: false, getcodetext: '60s' })
    //       that.counttime()
    //     }
    //   }
    // })

    let that = this;
    dmNetwork.post(dmNetwork.msg_get, {}, (res) => {
      if (res.data.code == 0) {
        that.setData({
          codeSw: false,
          getcodetext: '60s'
        })
        that.counttime()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        that.setData({
          codeSw: false,
          getcodetext: '60s'
        })
        that.counttime()
      }
    })
  },
  counttime: function() {
    let that = this;
    let timeoutFn = setTimeout(function() {
      if (that.data.timeout > 0) {
        that.setData({
          codeSw: false,
          getcodetext: --that.data.timeout + ' s'
        })
        that.counttime()
      } else {
        that.setData({
          codeSw: true,
          getcodetext: '获取验证码'
        })
      }
    }, 1000)
  },
  withdrawalbtn: function() {
    if (this.data.balance == '0.00') {
      wx.showToast({
        title: '提现金额不能小于1元',
        icon: 'none'
      })
      return;
    }
    if (!this.data.code || this.data.code.length < 6) return;
    console.log('zhunbei');
    dmNetwork.post(dmNetwork.new_put_forward, {
      mobile: this.data.mobile,
      msg_code: this.data.code,
      account_type: 2
    }, (res) => {
      console.log(JSON.stringify(res.data));
      if (res.data.code_error == 1) {
        //验证码是否正确 0:是 1:否 
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      } else {
        let status;
        if (res.data.errno == 0) {
          wx.redirectTo({
            url: '../withdrawalstatus/withdrawalstatus?amount=' + res.data.data.amount + '&account=' + res.data.data.account + '&errmsg=' + res.data.errmsg + '&status=' + 1
          })
        } else {
          wx.redirectTo({
            url: '../withdrawalstatus/withdrawalstatus?amount=' + res.data.data.amount + '&account=' + res.data.data.account + '&errmsg=' + res.data.errmsg + '&status=' + res.data.errno
          })
        }
      }
    })



    // dmNetwork.post(dmNetwork.checkcode, {
    //   mobile: this.data.mobile,
    //   msg_code: this.data.code
    // }, (res) => {
    //   if (res.data.errno == 0) {
    //     dmNetwork.post(dmNetwork.confirmwithdrawal, {
    //       account_type: 2
    //     }, (res) => {
    //       console.log("提现结果：" + JSON.stringify(res.data));
    //       //


    //       let status;
    //       if (res.data.errno == 0) {
    //         wx.redirectTo({
    //           url: '../withdrawalstatus/withdrawalstatus?amount=' + res.data.data.amount + '&account=' + res.data.data.account + '&errmsg=' + res.data.errmsg + '&status=' + 1
    //         })
    //       } else {
    //         wx.redirectTo({
    //           url: '../withdrawalstatus/withdrawalstatus?amount=' + res.data.data.amount + '&account=' + res.data.data.account + '&errmsg=' + res.data.errmsg + '&status=' + res.data.errno
    //         })
    //       }
    //       // else {
    //       //   wx.showToast({ title: res.data.errmsg, icon: 'none' })
    //       // }
    //     })
    //   } else {
    //     wx.showToast({
    //       title: res.data.errmsg,
    //       icon: 'none'
    //     })
    //   }
    // })
  },
  codefn: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  changeimgcode: function() {
    let that = this;
    wx.request({
      url: 'https://jz-c-' + that.data.configurl + '.doumi.com/api/mini/client/showCkCode',
      success: (res) => {
        that.setData({
          imgcode: res.data.pic
        })
      }
    })
  },
  imgcodeinput: function(e) {
    this.setData({
      imgcodeid: e.detail.value
    })
    if (e.detail.value.length == 4) {
      this.setData({
        showmask: false
      })
      this.getCode()

    }
  },
  loading: function() {
    wx.showLoading({
      title: '',
      mask: true,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})