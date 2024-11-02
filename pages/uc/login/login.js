var util = require('../../../utils/util.js')
var dmNetwork = require('../../../utils/network.js')
var config = require('../../../config.js')
var app = getApp()


var code;
var encryptedData;
var iv;
var nickName;
var avatarUrl;
var timer;
Page({
  data: {
    code: '',
    isSelected:false
  },
  onLoad: function (options) {
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

    wx.setNavigationBarTitle({
      title: '登录',
    })
    // this.getUserInfoSetting()
    // this.getUserInfo()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loginCheckbox:function(){
    if(!this.data.isSelected){
      wx.showToast({
        title:'请先阅读协议，并选择同意！',
        icon:'none'
      })
      return
    }
  },
  selectedAgreement:function(){
    this.setData({
      isSelected:!this.data.isSelected
    })
  },

  getUserInfo: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          code = res.code;
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log('************');
              console.log(res)
              iv = res.iv;
              encryptedData = res.encryptedData;
              if (res.userInfo && res.userInfo.avatarUrl) {
                avatarUrl = res.userInfo.avatarUrl;
              }
              if (res.userInfo && res.userInfo.nickName) {
                nickName = res.userInfo.nickName;
              }
              wx.setStorageSync("accountinfo", {
                logo_thumb_url: avatarUrl,
                real_name: nickName
              })
            },
            fail: function (res) {
              that.getUserInfoSetting()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getUserInfoSetting: function () {
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {} else {
          wx.showModal({
            title: '您已拒绝授权',
            showCancel: false,
            content: '如果继续使用,点击确定进行设置',
            success: function (res) {
              that.gotoSetting()
            }
          })
        }
      }
    })

  },
  otherlogin: function () {
    if(!this.data.isSelected){
      wx.showToast({
        title:'请先阅读协议，并选择同意！',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '../phonelogin/phonelogin?code=' + code + '&iv=' + iv + '&encryptedData=' + encryptedData + '&avatarUrl=' + avatarUrl + '&nickName=' + nickName + '&caller=' + 'login'
    })
  },
  gotoSetting: function (e) {
    var that = this
    wx.openSetting({
      success: function (data) {
        console.log(data);
        if (data.authSetting["scope.userInfo"] == true) {
          //再次授权，调用getLocationt的API
          that.getUserInfo()
        } else {
          wx.showModal({
            title: '您已拒绝授权',
            showCancel: false,
            content: '如果继续使用,点击确定进行设置',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");
              } else if (res.confirm) {
                that.gotoSetting()
              }
            }
          })
        }
      }
    })
  },
  goAgreement(){
    wx.navigateTo({
      url: '../../protocol/protocol?type=agreement'
    })
  },
  goPrivacy(){
    wx.navigateTo({
      url: '../../privacy/privacy?type=privacy'
    })
  },
  getPhoneNumber: function (e) {
    //     var that = this
    //     if (e.detail.encryptedData && e.detail.encryptedData != '') {
    //       //跟斗米服务器交互
    //       wx.login({
    //         success: function (res) {
    //           if (res.code) {
    //             code = res.code;
    //             var verify_mobile = { code: code, mobile: JSON.stringify(e.detail) }
    // // , iv: iv, encryptedData: encryptedData, nickName: nickName, avatarUrl: avatarUrl
    //             app.getUserInfo(verify_mobile, function (userInfo) {
    //               wx.reLaunch({
    //                 url: '../../minework/minework'
    //               })
    //             })

    //           } else {
    //             console.log('获取用户登录态失败！' + res.errMsg)
    //           }
    //         }
    //       });
    //     } 
    var verify_mobile = {
      code: this.data.code,
      mobile: JSON.stringify(e.detail)
    }
    // , iv: iv, encryptedData: encryptedData, nickName: nickName, avatarUrl: avatarUrl
    app.getUserInfo(verify_mobile, function (userInfo) {
      clearInterval(timer);
      console.log("定时器停止了");
      wx.reLaunch({
        url: '../../index/index'
      })
    })
  }

})