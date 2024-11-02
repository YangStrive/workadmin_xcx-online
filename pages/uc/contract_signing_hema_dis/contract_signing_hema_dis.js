// pages/uc/contract_signing/contract_signing.js
var dmNetwork = require("../../../utils/network.js");
var util = require("../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    aaa: "xxxxx",
    isShowSendCodeView: false,
    getcodetext: "获取验证码",
    getcodestatus: false,
    agingetcode: true,
    msmcode: "",
    team_id: "",
    project_id: "",
    protocol_order_id: "",
    cont_protocol_order_id: "",
    is_full_time_work_flag: false,
    is_part_time_work_flag: false,
    isNewcontract: false,
    start_date: "",
    end_data: "",
    can_send_code_flag: true,
    latitude: "",
    longitude: "",
    singData: {
      protocol_info: {
        project_type: "",
        cont_protocol_order_id: "",
        city_name: "",
        station_name: "",
        start_date: "",
        end_date: "",
        probation: "",
        wage_day: "",
      },
      member_info: {
        real_name: "",
        idnumber: "",
        mobile: "",
        detail_address: "",
      },
      company_info: {
        name: "",
        address: "",
      },
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      team_id: options.team_id,
      project_id: options.project_id,
      cont_protocol_order_id: options.protocol_order_id.split(",")[0],
      agreement_num: options.agreement_num,
      protocol_type: options.protocol_type,
      protocol_order_id: options.protocol_order_id,
    });
  },
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: "wgs84",
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
        console.log(latitude, longitude);
      },
      fail(err) {
        console.log(err);
        wx.showToast({
          title: "授权位置后才可签约",
          icon: "none",
          duration: 2000,
        });
      },
    });
  },
  next: function (options) {
    let that = this;
    wx.getSetting({
      success(res) {
        console.log("@@@!!!");
        console.log(res.authSetting);
        if (!res.authSetting["scope.userLocation"]) {
          wx.openSetting({
            success(res) {
              console.log(res.authSetting);
            },
          });
        } else {
          that.setData({
            isShowSendCodeView: true,
            msmcode: "",
          });
          if (that.data.can_send_code_flag) {
            that.getcode();
          }
        }
      },
    });
  },

  confirm_next: function (options) {
    console.log(JSON.stringify(options));
    if (this.data.msmcode.length !== 6) return;
    var that = this;
    var request_data = {
      protocol_order_id: that.data.protocol_order_id,
      team_id: that.data.team_id,
      project_id: that.data.project_id,
      lat: that.data.latitude,
      lng: that.data.longitude,
      code: that.data.msmcode,
    };
    console.log(request_data);
    // return
    dmNetwork.post(dmNetwork.protocol_sign, request_data, (res) => {
      if (res.data.errno == 0) {
        wx.showToast({
          title: "签订已生效，请在我的合同中查看",
          icon: "none",
          duration: 2000,
        });

        setTimeout(function () {
          wx.switchTab({
            url: "../../index/index",
          });
        }, 2000);
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
      }
    });
  },

  cancel: function (options) {
    this.setData({
      isShowSendCodeView: false,
      msmcode: "",
    });
  },

  bindCodeInput: function (e) {
    var value = e.detail.value;
    var newVal = value.replace(/\D/g, "").replace(/\s/g, "");
    if (typeof +newVal != "number") {
      return newVal;
    }
    if (newVal.length === 6) {
      this.setData({
        msmcode: newVal,
      });
    }
  },

  // 获取验证码请求
  getcode: function () {
    if (!this.data.can_send_code_flag) {
      return;
    }
    var that = this;
    that.setData({
      can_send_code_flag: false,
    });
    var request_data = {
      team_id: that.data.team_id,
      project_id: that.data.project_id,
    };
    dmNetwork.get(dmNetwork.protocol_msg_get, request_data, (res) => {
      if (res.data.errno == 0) {
        wx.showToast({
          title: "发送成功!",
          success: () => {
            var time = 60;
            that.setData({
              getcodetext: "60s",
              getcodestatus: true,
              agingetcode: false,
            });
            var thetimer = setInterval(function () {
              that.setData({
                getcodetext: --time + "s",
              });
              if (time === -1) {
                clearInterval(thetimer);
                that.setData({
                  getcodetext: "重新获取",
                  getcodestatus: true,
                  agingetcode: true,
                  can_send_code_flag: true,
                });
              }
            }, 1000);
          },
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
