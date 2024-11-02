// pages/uc/phonelogin/phonelogin.js
// dataform.js

var dmNetwork = require("../../../utils/network.js");
var dmUtil = require("../../../utils/util.js");
var dmUtil = require("../../../utils/util.js");
var dmCollector = require("../../../utils/collector.js");

let app = getApp();

var pagetype;
var caller; // 哪个页面加载了getphonemask
var inviteCode;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getcodestatus: false,
    checkTxcodestatus: false, //图形验证码验证
    getcodetext: "获取验证码",
    //gettxcodetext: "图形验证码",
    txCodeUrl : '../../../image/wage-vip.png',
    phone: "",
    msmcode: "",
    txcode: "",  //图形验证码
    agingetcode: true,
    is_modal_Hidden: false,
    is_modal_Msg: "我是一个自定义组件",
    text: "",
    loginbtnStr: "",
    title: "",
    code: "",
    iv: "",
    encryptedData: "",
    nickName: "",
    avatarUrl: "",
    // inviteCode:''
  },
  onLoad: function (options) {
    pagetype = options.pagetype;
    caller = options.caller;

    inviteCode = options.code;

    // console.log("登录页面onLoad---options",options);

    if (pagetype == 1) {
      this.setData({ loginbtnStr: "确认更换", title: "更换手机号" });
    } else {
      // console.log(options.iv, options.encryptedData)
      this.setData({
        loginbtnStr: "登录",
        title: "登录",
        encryptedData: options.encryptedData,
        iv: options.iv,
        code: options.code,
        nickName: options.nickName,
        avatarUrl: options.avatarUrl,
      });
    }

    wx.setNavigationBarTitle({
      title: this.data.title,
    });
  },
  bindPhoneInput: function (e) {
    var value = e.detail.value;
    var newVal = value.replace(/\D/g, "").replace(/\s/g, "");
    if (typeof +newVal != "number") {
      return newVal;
    }
    if (newVal.length === 11) {
      this.setData({ checkTxcodestatus: true, phone: newVal });
      this.getTxcode();

    } else {
      this.setData({ checkTxcodestatus: false, phone: "" });
    }
  },
  bindTxCode: function (e) {
    var value = e.detail.value;
    var newVal = value.trim();
    if (newVal.length === 4) {
      this.setData({ getcodestatus: true, txcode: newVal });
    } else {
      this.setData({ getcodestatus: false, txcode: "" });
    }
  },
  bindCodeInput: function (e) {
    var value = e.detail.value;
    var newVal = value.replace(/\D/g, "").replace(/\s/g, "");
    if (typeof +newVal != "number") {
      return newVal;
    }
    if (newVal.length === 6) {
      this.setData({ msmcode: newVal });
    } else {
      this.setData({ msmcode: "" });
    }
  },
  confirmlogin: function () {
    if (this.data.phone.length !== 11 || this.data.msmcode.length !== 6 ||  this.data.txcode.length !=4 ) return;
    wx.login({
      success: (res) => {
        this.setData({ code: res.code });
        this.onLogin();
      },
      fail: () => {
        wx.showToast({
          title: "获取登录信息失败",
          icon: "none",
        });
      },
    });
  },
  onLogin: function () {
    var that = this;
    if (pagetype == 1) {
      wx.showModal({
        title: "",
        content: "确定将手机号更换为" + this.data.phone,
        success: function (res) {
          if (res.cancel) {
          } else if (res.confirm) {
            var model = wx.getSystemInfoSync().system;
            dmNetwork.post(
              dmNetwork.change_phone,
              {
                mobile: that.data.phone,
                msg_code: that.data.msmcode,
                system_version: model,
              },
              (res) => {
                if (res.data.errno == 0) {
                  wx.showToast({
                    title: "修改成功",
                    icon: "none",
                    duration: 1500,
                    success: () => {
                      wx.reLaunch({
                        url: "../account/account",
                      });
                    },
                  });
                } else {
                  wx.showToast({
                    title: res.data.errmsg,
                    icon: "none",
                  });
                }
              },
              (err) => {}
            );
          }
        },
      });
    } else {
      //手机号登陆
      var verify_mobile = {
        code: this.data.code,
        verify_mobile: JSON.stringify({
          mobile: this.data.phone,
          code: this.data.msmcode,
        }),
      };
      //, iv: this.data.iv, encryptedData: this.data.encryptedData, nickName: this.data.nickName, avatarUrl: this.data.avatarUrl
      var that = this;
      //跟斗米服务器交互
      app.getUserInfo(verify_mobile, function (userInfo) {
        if (null != userInfo && null != userInfo.cookie) {
          // wx.reLaunch({
          //   url: '../../minework/minework'
          // })

          if ("invite" == caller) {
            // console.log('77777777', that.data.inviteCode);
            wx.reLaunch({
              url: "/pages/invite/invite?code=" + inviteCode,
            });
          } else if ("bxinvite" == caller) {
            wx.reLaunch({
              url: "/pages/bxinvite/bxinvite?code=" + inviteCode,
            });
          } else if ("login" == caller) {
            wx.reLaunch({
              url: "../../index/index",
            });
          } else {
          }
        } else {
          wx.showToast({
            title: "登录失败",
            icon: "none",
            mask: true,
            duration: 1500,
          });
        }
      });
    }
  },

  getTxcode: function () {
      if(!this.data.phone && this.data.phone.length < 11){
          //console.log('getTxcode=s1', this.data.phone);
          return;
      }
        //dmCollector.getUUid();
        //console.log('getTxcode=s2', dmNetwork.getTxcode, dmCollector.uuid);
        var txcodeUrl = dmNetwork.getTxcode + '?dmclient=weixinxcx' + '&mobile=' + this.data.phone + '&r=' +  Math.random() + '&uuid=' + dmCollector.uuid;
        //console.log('getTxcode=s3', txcodeUrl);
        this.setData({ txCodeUrl: txcodeUrl});
  },
 
  getcode: function () {
    if (!this.data.getcodestatus || !this.data.agingetcode || this.data.txcode.length != 4) return;
    this.setData({ agingetcode: false });
    if (pagetype == 1) {
      this.getcodeToChangePhone();
    } else {
      this.getcodeToLogin();
    }
  },
  getcodeToLogin() {
    var that = this;
    dmNetwork.get(
      dmNetwork.getcode,
      { mobile: that.data.phone, txcode: this.data.txcode, uuid: dmCollector.uuid },
      (res) => {
        if (res.data.errno == 0) {
          this.getTxcode();
          wx.showToast({
            title: "发送成功!",
            success: () => {
              var time = 60;
              that.setData({ getcodetext: "60s", getcodestatus: false });
              var thetimer = setInterval(function () {
                that.setData({ getcodetext: --time + "s" });
                if (time === -1) {
                  clearInterval(thetimer);
                  var switchCk = false;
                  if (that.data.phone.length < 11) {
                    switchCk = false;
                  } else {
                    switchCk = true;
                  }
                  that.setData({
                    getcodetext: "重新获取",
                    getcodestatus: switchCk,
                    agingetcode: switchCk,
                  });
                }
              }, 1000);
            },
          });
        } else {
          that.setData({ getcodestatus: true, agingetcode: true });
          this.getTxcode();
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      },
      (res) => {
        that.setData({ getcodestatus: true, agingetcode: true });
      }
    );
  },
  getcodeToChangePhone() {
    var that = this;
    dmNetwork.get(
      dmNetwork.change_phone_getcode,
      { mobile: that.data.phone },
      (res) => {
        if (res.data.errno == 0) {
          wx.showToast({
            title: "发送成功!",
            success: () => {
              var time = 60;
              that.setData({ getcodetext: "60s", getcodestatus: false });
              var thetimer = setInterval(function () {
                that.setData({ getcodetext: --time + "s" });
                if (time === -1) {
                  clearInterval(thetimer);
                  var switchCk = false;
                  if (that.data.phone.length < 11) {
                    switchCk = false;
                  } else {
                    switchCk = true;
                  }
                  that.setData({
                    getcodetext: "重新获取",
                    getcodestatus: switchCk,
                    agingetcode: switchCk,
                  });
                }
              }, 1000);
            },
          });
        } else {
          that.setData({ getcodestatus: true, agingetcode: true });
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      },
      (res) => {
        that.setData({ getcodestatus: true, agingetcode: true });
      }
    );
  },
});
