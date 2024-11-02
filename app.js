//app.js
var dmNetwork = require("utils/network.js");
var collector = require("utils/collector.js");
import wxApi from "./utils/wxApi";
var util = require("utils/util.js");
App({
  getVersion: function () {
    return "1.3.1";
  },

  onLaunch: async function (obj) {
    //referrerInfo.appId
    console.log("---app.js onLaunch ---");

    //初始化数据
    this.onInit(obj);

    //检查小程序是否有更新
    let [error, result] = await util.awaitWrap(wxApi.doumiUpdateManager());
    if (result) {
      //用户同意更新
      let [err, res] = await util.awaitWrap(
        wxApi.doumiDownLoadAndUpdate(result)
      );
    }
  },

  onInit: function (obj) {
    console.log(obj);
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
    collector.dmLogPV();
    this.globalData.userInfo = wx.getStorageSync("userInfo");
    //检查微信登录是否过期
    this.checkSession(obj.scene, obj.path);
    // wx.setEnableDebug({ enableDebug: true })
  },

  //存储用户信息
  checkSession: function (scene, path) {
    if (!this.globalData.userInfo) {
      wx.login({
        success: function (res) {},
      });
      if (path.indexOf("pages/invite/invite") >= 0) {
      } else if (path.indexOf("pages/bxinvite/bxinvite") >= 0) {
      } else if (path.indexOf("pages/bole/bole") >= 0) {
      } else {
        // wx.reLaunch({
        //   url: "/pages/uc/login/login",
        // });
      }
    }
  },

  //请求斗米服务器登录获取用户信息
  getUserInfo: function (wxlogininfo, cb) {
    var that = this;

    dmNetwork.post(
      dmNetwork.login,
      wxlogininfo,
      (res) => {
        var cookieStr = res.header["Set-Cookie"];

        if (cookieStr && cookieStr.length > 0) {
          var cookie = cookieStr.split(";");
          var userInfo = { cookie: cookie[0] };
          that.globalData.userInfo = userInfo;
          wx.setStorageSync("userInfo", userInfo);
          console.log(cookieStr, "登录成功");
          typeof cb == "function" && cb(userInfo);
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
            mask: true,
            duration: 1500,
          });
        }
      },
      (error) => {
        console.log(error);
        typeof cb == "function" && cb(null);
      }
    );
  },
  //请求斗米服务器登录获取用户信息

  globalData: {
    userInfo: null,
  },
});
