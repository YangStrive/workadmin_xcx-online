// pages/bxinvite/bxinvite.js
var util = require("../../utils/util.js");
var dmNetwork = require("../../utils/network.js");
var app = getApp();
var codeTimer = true;
var getcode = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // vCodeActive: false,
    isCounting: false,
    countingTxt: "获取验证码",
    countingTxt2: "",
    myphone: "", //被邀请人手机号
    bxinviteData: [],
    userName: "", //被邀请人姓名
    userIdnumber: "", //被邀请人身份证号
    vCode: "", //验证码
    vCodeshow: false, //验证码是否显示
    newsuccessShow: false, //未激活用户领取成功
    oldsuccessShow: false, //已激活用户领取成功
    statusId: "", //状态ID
    isshow: true,
    failedShow: false,
    protocolData: "", //电子协议返回数据
    protocol_user_id: "", //协议用户ID
    protocol_order_id: "", //协议流水号
    showMask: false,
    hasPhone: false, //手机号是否可修改
    isRealname: false, //是否实名认证
    caller: "bxinvite", //getphonemask 调用者
    code: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var src = decodeURIComponent(options.q)
    // var index = src.indexOf('code=')
    // getcode = src.substr(index + 5)

    if (options.code) {
      //APP分享
      getcode = options.code;
      this.setData({
        code: options.code,
      });
    } else {
      var src = decodeURIComponent(options.q);
      var index = src.indexOf("code=");
      getcode = src.substr(index + 5);
      this.setData({
        code: src.substr(index + 5),
      });
    }

    var that = this;
    if (!app.globalData.userInfo) {
      //未登录
      that.setData({
        showMask: true,
      });
    } else {
      that.initAjax();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  initAjax: function () {
    var that = this;
    dmNetwork.get(
      dmNetwork.bxInvite,
      { code: getcode },
      (res) => {
        console.log("保险邀请------" + JSON.stringify(res));
        if (res.data.errno == 0) {
          that.setData({
            bxinviteData: res.data.data[0].data,
            statusId: res.data.data[0].data.status,
          });
          if (res.data.data[0].data.real_name) {
            that.setData({
              isRealname: true,
            });
          }
          if (res.data.data[0].data.mobile != "") {
            that.setData({
              hasPhone: true,
            });
          }
          //0未激活
          if (res.data.data[0].data.status == 0) {
            that.setData({
              vCodeshow: true,
            });
          }
          //1已激活
          else if (res.data.data[0].data.status == 1) {
            that.setData({
              vCodeshow: false,
            });
            if (
              res.data.data[0].data.id_number &&
              res.data.data[0].data.isBuy
            ) {
              that.setData({
                oldsuccessShow: true,
                isshow: false,
              });
            } else {
              that.setData({
                userName: res.data.data[0].data.name,
                myphone: res.data.data[0].data.mobile,
                userIdnumber: res.data.data[0].data.id_number,
              });
            }
          }
        } else if (res.data.errno == 25008) {
          // that.setData({
          //   failedShow: true
          // })
          wx.showToast({
            title: "领取失败!保险已过期，如有问题请联系管理员!",
            icon: "none",
          });
        } else {
          //弹出提示
        }
      },
      (err) => {
        //网络异常处理
      }
    );
  },
  // 实时获取input
  myphoneInput: function (e) {
    this.setData({
      myphone: e.detail.value,
    });
  },
  usernameInput: function (e) {
    this.setData({
      userName: e.detail.value,
    });
  },
  useridnumberInput: function (e) {
    this.setData({
      userIdnumber: e.detail.value,
    });
  },
  vcodeInput: function (e) {
    this.setData({
      vCode: e.detail.value,
    });
  },
  getVCode: function (e) {
    console.log(JSON.stringify(this.data.myphone));
    if (!codeTimer) return;
    var mobile = this.data.myphone;
    var regMobile = /^1\d{10}$/;
    if (mobile == "") {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
      });
      return;
    } else if (!regMobile.test(mobile)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "none",
      });
      return;
    }
    dmNetwork.get(
      dmNetwork.bxVcode,
      { mobile: mobile },
      (res) => {
        console.log("验证码" + JSON.stringify(res));
        if (res.data.errno == 0) {
          console.log(34234234);
          this.setData({
            isCounting: true,
          });
          this.countDown(60);
        } else if (res.data.errno == 25017) {
          wx.showToast({
            title: "获取验证码次数已达上限",
            icon: "none",
          });
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      },
      (err) => {
        //网络异常处理
        wx.showToast({
          title: "服务器异常",
          icon: "none",
        });
      }
    );
  },
  countDown(seconds) {
    codeTimer = false;
    this.setData({
      isCounting: true,
      countingTxt2: "60秒后重发",
    });
    var _seconds = seconds;
    var tId;
    tId = setInterval(() => {
      if (_seconds == 0) {
        clearInterval(tId);
        this.setData({
          isCounting: false,
          countingTxt: "重新获取",
        });
        codeTimer = true;
      } else {
        _seconds = _seconds - 1;
        this.setData({
          countingTxt2: `${_seconds}秒后重发`,
        });
      }
    }, 1000);
  },
  //领取保险（检测二维码）
  getInsurance: function (e) {
    console.log(123 + JSON.stringify(this.data));
    var userName = this.data.userName;
    var userIdnumber = this.data.userIdnumber;
    var mobile = this.data.myphone;
    var vCode = this.data.vCode;
    var statusId = e.currentTarget.dataset.statusid;
    if (userName == "") {
      wx.showToast({
        title: "请输入真实姓名",
        icon: "none",
      });
      return;
    }
    if (userIdnumber == "") {
      wx.showToast({
        title: "请输入身份证号",
        icon: "none",
      });
      return;
    }
    if (mobile == "") {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
      });
      return;
    }
    //未激活用户校验验证码
    if (statusId == 0) {
      if (vCode == "") {
        wx.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return;
      }
    }
    if (this.data.vCodeshow) {
      dmNetwork.get(
        dmNetwork.bxVcodeCheck,
        { mobile: mobile, msg_code: vCode },
        (res) => {
          console.log("验证码检查" + JSON.stringify(res));
          if (res.data.errno == 0) {
            if (res.data.data) {
              this.getInsuranceafter();
            } else {
              wx.showToast({
                title: "验证码填写错误",
                icon: "none",
              });
              return;
            }
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: "none",
            });
          }
        },
        (err) => {
          //网络异常处理
          wx.showToast({
            title: "服务器异常",
            icon: "none",
          });
        }
      );
    } else {
      //已登录用户直接领取保险
      this.getInsuranceafter();
    }
  },
  getInsuranceafter: function () {
    var inseranceInfo = {};
    inseranceInfo.name = this.data.userName;
    inseranceInfo.mobile = this.data.myphone;
    inseranceInfo.id_number = this.data.userIdnumber;
    inseranceInfo.msg_code = this.data.vCode;
    var jsonData = JSON.stringify(inseranceInfo);
    var params = {};
    params.code = getcode;
    // params.code = 'WjN0QndJbXgyK2hFUWVrT0dmRzV4V2FKV3Y5WTV3WlU1dmVaR2g5UXNDMjFwblFHbWZXZTJ4UkR2RXVjd0t1MDdR';
    params.info = jsonData;
    params.dmclient = "weixinxcx";
    params = JSON.stringify(params);
    console.log("传入", params);
    dmNetwork.post(
      dmNetwork.bxprotocol,
      {
        url: "sea/api/1.0/client/v1/insurance/order/user_info/set",
        params: params,
      },
      (res) => {
        if (res.data.errno == 0) {
          wx.showToast({
            title: "领取成功",
            icon: "success",
          });
          var timeout;
          timeout = setTimeout(() => {
            wx.reLaunch({
              url: "../minework/minework",
            });
          }, 1000);
        } else if (res.data.errno == 25016) {
          wx.showToast({
            title: "验证码填写错误",
            icon: "none",
          });
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      },
      (err) => {
        //网络异常处理
        wx.showToast({
          title: "服务器异常",
          icon: "none",
        });
      }
    );
  },
  //领取成功
  successBack: function () {
    wx.reLaunch({
      url: "../minework/minework",
    });
  },
  //跳转到保险说明
  gotointroduce: function () {
    wx.navigateTo({ url: "../bxintroduce/bxintroduce" });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
});
