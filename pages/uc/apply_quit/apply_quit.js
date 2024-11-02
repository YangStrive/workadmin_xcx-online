// pages/uc/apply_quit/apply_quit.js
var dmNetwork = require("../../../utils/network.js");
var thetimer=null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    project_id: "",
    real_name: "",
    idnumber: "",
    contract: "",
    ifRecommend: [
      {
        name: "是",
        value: 1,
        checked: "true",
      },
      {
        name: "否",
        value: 0,
      },
    ],
    startDate: "",
    endDate: "",
    leaveDate: "", // 离职时间
    reason_options: [],
    leaveReason: "",
    reason_id: "", // 离职原因id
    recommendIndex: 1, // 是否选中推荐的Index
    canSubmit: true, // 是否可以提交
    leave_reason: "",
    leave_reason_id: "",
    plan_leave_date: "",
    rangeIndex: 0,
    isShowSendCodeView: false,
    getcodestatus: false,
    agingetcode: true,
    getcodetext: "获取验证码",
    msmcode: "",
    can_send_code_flag: true,
  },
  onLoad: function (options) {
    this.initData(options);
    this.getInfo();
  },
  onShow: function () {
    this.computeDate();
  },
  initData: function (options) {
    var project_id = options.project_id;
    console.log(project_id);
    this.setData({
      project_id,
    });
  },
  getInfo: function () {
    var that = this;
    dmNetwork.get(
      dmNetwork.get_myquit_info,
      {
        project_id: that.data.project_id,
        dmclient: "weixinxcx",
      },
      (res) => {
        console.log(res);
        if (res.data.errno == 0) {
          var data = res.data.data;
          var rangeIndex = 0;
          for (var i = 0; i < data.reason_options.length; i++) {
            if (data.leave_reason_id == data.reason_options[i].reason_id) {
              rangeIndex = [i];
              break;
            }
          }
          if (data.is_rec_job == 0) {
            this.setData({
              ifRecommend: [
                {
                  name: "是",
                  value: 1,
                },
                {
                  name: "否",
                  value: 0,
                  checked: "true",
                },
              ],
            });
          }
          this.setData({
            real_name: data.real_name,
            idnumber: data.idnumber,
            contract: data.contract,
            reason_options: data.reason_options,
            leaveReason: data.leave_reason ? data.leave_reason : "",
            reason_id: data.leave_reason_id ? data.leave_reason_id : "",
            leaveDate: data.plan_leave_date ? data.plan_leave_date : "",
            is_rec_job: data.is_rec_job ? data.is_rec_job : "",
            rangeIndex,
          });
        }
      }
    );
  },
  computeDate: function () {
    var nowdate = new Date();
    var ny = nowdate.getFullYear();
    var nm = nowdate.getMonth() + 1;
    var nd = nowdate.getDate();
    var formatnowdate = ny + "-" + nm + "-" + nd;
    nowdate.setMonth(nowdate.getMonth() + 1);
    var ly = nowdate.getFullYear();
    var lm = nowdate.getMonth() + 1;
    var ld = nowdate.getDate();
    var formatwdate = ly + "-" + lm + "-" + ld;
    this.setData({
      startDate: formatnowdate,
      endDate: formatwdate,
    });
  },
  bindDateChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      leaveDate: e.detail.value,
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      leaveReason: this.data.reason_options[e.detail.value].reason,
      reason_id: this.data.reason_options[e.detail.value].reason_id,
    });
  },
  radioChange: function (res) {
    console.log("选中的标签：" + res.detail.value);
    var arrs = this.data.ifRecommend;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].value == res.detail.value) {
        arrs[x].checked = true;
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      ifRecommend: arrs,
      recommendIndex: res.detail.value,
    });
  },
  submit: function () {
    var that = this;
    // if (!this.data.canSubmit) {
    //   return;
    // }

    var leaveDate = that.data.leaveDate;
    var reason_id = that.data.reason_id;

    if (!leaveDate || !reason_id) {
      wx.showToast({
        title: "请选择日期及原因",
        icon: "none",
      });
      return;
    }
    this.setData(
      {
        canSubmit: false,
        isShowSendCodeView: true,
        msmcode: "",
      },
      () => {
        this.getcode();
      }
    );
  },
  // 获取验证码请求
  async getcode() {
    var that = this;
    // if (!that.data.can_send_code_flag) {
    //   return;
    // }
    // that.setData({
    //   can_send_code_flag: false,
    // });
    try {
      const mobile = await that.getuserinfofromsaas();
      const res = await this.sendCode(mobile);
      console.log("cdoeeeeee", res);
      this.countdown();
    } catch (err) {
      console.log("errrrrrrrrr", err);
    }
  },
  //发送验证码
  sendCode: function (mobile) {
    return new Promise((resolve, reject) => {
      dmNetwork.get(
        dmNetwork.apply_quit_code,
        {
          dmclient: "weixinxcx",
          mobile,
          type:1
        },
        (res) => {
          //发送短信，获取验证码
          if (res.data.errno == 0) {
            resolve(res);
          }else{
            wx.showToast({
              title: res.data.errmsg,
              icon: "none",
            });
          }
        }
      );
    });
  },
  //倒计时
  countdown: function () {
    const that = this;
    wx.showToast({
      title: "发送成功!",
      success: () => {
        var time = 60;
        that.setData({
          getcodetext: "60s",
          getcodestatus: true,
          agingetcode: false,
        });
        thetimer = setInterval(function () {
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
  },
  //输入验证码
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
  // 提交验证码
  async confirm_next(options) {
    if (this.data.msmcode.length !== 6) return;
    var that = this;
    that.setLeaveApplication();
  },
  //发送离职申请
  setLeaveApplication: function () {
    var that = this;
    var leaveDate = that.data.leaveDate;
    var reason_id = that.data.reason_id;
    dmNetwork.get(
      dmNetwork.create_recommend,
      {
        project_id: that.data.project_id,
        leave_date: leaveDate.replace(/[-]/g, ""),
        reason_id: reason_id,
        is_rec_job: that.data.recommendIndex,
        dmclient: "weixinxcx",
        code: that.data.msmcode,
      },
      (res) => {
        console.log(res);
        if (res.data.errno == 0) {
          wx.redirectTo({
            url:
              "/pages/uc/feedback_page/feedback_page?project_id=" +
              that.data.project_id,
          });
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
        this.setData({
          canSubmit: true,
        });
      }
    );
  },
  //获取用户信息
  getuserinfofromsaas: function () {
    return new Promise((reslove, reject) => {
      dmNetwork.get(
        dmNetwork.getuserinfo,
        {},
        (res) => {
          console.log("个人信息" + JSON.stringify(res));
          if (res.data.errno == 0) {
            reslove(res.data.data.mobile);
          }
        },
        (err) => {
          //网络异常处理
        }
      );
    });
    var that = this;
  },
  cancel: function (options) {
    // clearInterval(thetimer);
    this.setData({
      isShowSendCodeView: false,
      msmcode: "",
    });
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isShowSendCodeView: false,
      msmcode: "",
    });
    if(thetimer){
      clearInterval(thetimer);
    }
  },

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
