// pages/uc/contract_signing_new/contract_signing_new.js
var dmNetwork = require("../../utils/network");
Page({
  data: {
    contractTxt: "",
    isShowSendCodeView: false,
    getcodetext: "获取验证码",
    getcodestatus: false,
    agingetcode: true,
    msmcode: "",
    cont_protocol_order_id: "",
    can_send_code_flag: true,
    latitude: "",
    longitude: "",
    team_id: "",
    project_id: "",
    contract_list: [],
    currentContract: {},
    protocol_order_ids: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   protocol_order_id: options.protocol_order_id
    // });
    this.getStep();
  },
  getStep () {
    const that = this;
    dmNetwork.post(dmNetwork.advance_check, {}, (res) => {
      if (res.data.errno == 0) {
        const data = res.data.data;
        const contractList = data.protocol_order_ids;
        const currentContract = contractList.shift();
        const protocol_order_ids = that.data.protocol_order_ids;
        protocol_order_ids.push(currentContract.protocol_order_id);
        that.setData({
          contract_list: contractList,
          currentContract: currentContract,
          protocol_order_ids: protocol_order_ids,
        });
        that.getTemplate(currentContract);
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
      }
    });
  },
  getTemplate (currentContract) {
    const that = this;
    let request_data = {
      dmclient: "weixinxcx",
      sign: "",
      team_id: this.data.team_id,
      contract_no: currentContract.protocol_order_id,
    };
    dmNetwork.post(dmNetwork.get_template, request_data, (res) => {
      if (res.data.errno == 0) {
        const data = res.data.data;
        that.setData({
          contractTxt: data.content,
        });
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
      }
    });
  },
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: "wgs84",
      success (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
      },
      fail (err) {
        wx.showToast({
          title: "授权位置后才可签约",
          icon: "none",
          duration: 2000,
        });
      },
    });
  },
  next: function (options) {
    if (this.data.contract_list.length > 0) {
      const contractList = this.data.contract_list;
      const protocol_order_ids = this.data.protocol_order_ids;
      let currentContract = contractList.shift();
      protocol_order_ids.push(currentContract.protocol_order_id);
      this.setData({
        contract_list: contractList,
        currentContract: currentContract,
        protocol_order_ids: protocol_order_ids,
      });
      this.getTemplate(currentContract);
      wx.pageScrollTo({
        scrollTop: 0,
      });
    } else {
      this.setData({
        isShowSendCodeView: true,
        msmcode: "",
      });
      if (this.data.can_send_code_flag) {
        this.getcode();
      }
    }
  },

  confirm_next: function (options) {
    if (this.data.msmcode.length !== 6) return;
    var that = this;
    const protocol_order_ids = this.data.protocol_order_ids.join(",");
    var request_data = {
      protocol_order_id: protocol_order_ids,
      team_id: 0,
      project_id: 0,
      lat: 0,
      lng: 0,
      code: that.data.msmcode,
      type: 1
    };
    dmNetwork.post(dmNetwork.protocol_sign, request_data, (res) => {
      if (res.data.errno == 0) {
        wx.showToast({
          title: "签订已生效，请在我的合同中查看",
          icon: "none",
          duration: 2000,
        });
        setTimeout(function () {
          wx.navigateTo({
            url: `/pages/advancePayroll/advancePayroll`,
            success: (result) => { },
            fail: () => { },
            complete: () => { },
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
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (this.data.currentContract.is_authorize_location === 1) {
    //   this.getLocation();
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
});
