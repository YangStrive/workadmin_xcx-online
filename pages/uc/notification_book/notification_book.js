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
    notifi_protocol_order_id: "",
    is_full_time_work_flag: false,
    is_part_time_work_flag: false,
    isNewcontract: false,
    start_date: "",
    end_data: "",
    can_send_code_flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(util.js_date_time("1539920235"));

    // wx.downloadFile({
    //   // 示例 url，并非真实存在
    //   url: 'http://saas-test.doumi.com/7a2df6a0bc3ad1e2c0352b79ac849566.pdf',
    //   success: function (res) {
    //     const filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath: filePath,
    //       fileType: 'pdf',
    //       success: function (res) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   }
    // })
    if (options.agreement_num == 1) {
      this.setData({
        team_id: options.team_id,
        project_id: options.project_id,
        notifi_protocol_order_id: options.protocol_order_id,
        agreement_num: options.agreement_num,
        protocol_type: options.protocol_type,
      });
    } else if (options.agreement_num == 2) {
      let notifi_protocol_order_id =
        options.protocol_type.split(",")[0] == 10
          ? options.protocol_order_id.split(",")[0]
          : options.protocol_order_id.split(",")[1];
      this.setData({
        team_id: options.team_id,
        project_id: options.project_id,
        notifi_protocol_order_id: notifi_protocol_order_id,
        protocol_order_id: options.protocol_order_id,
        agreement_num: options.agreement_num,
        protocol_type: options.protocol_type,
      });
    } else if (options.agreement_num == 4) {
      let notifi_protocol_order_id = options.protocol_order_id.split(",")[2];
      this.setData({
        team_id: options.team_id,
        project_id: options.project_id,
        notifi_protocol_order_id: notifi_protocol_order_id,
        protocol_order_id: options.protocol_order_id,
        agreement_num: options.agreement_num,
        protocol_type: options.protocol_type,
      });
      console.log("!!!!!!!!!!!!");
      console.log(notifi_protocol_order_id);
      console.log(options.protocol_order_id);
      console.log(options.protocol_type);
    }
    var that = this;
    var request_data = {
      // protocol_order_id: localTeamId,
      protocol_order_id: that.data.notifi_protocol_order_id,
      team_id: that.data.team_id,
      project_id: that.data.project_id,
    };
    //获取合同详情
    dmNetwork.get(dmNetwork.protocol_detail, request_data, (res) => {
      if (res.data.errno == 0) {
        that.setData({
          singData: res.data.data,
          start_date: util.js_date_time(res.data.data.protocol_info.start_date),
          end_data: util.js_date_time(res.data.data.protocol_info.end_date),
        });
        //2:外包兼职 3外包全职
        // # 1：外包兼职# 2：居间全职# 3：外包全职 # 4：居间全职# 5：外包兼职# 6：居间兼职

        if (
          res.data.data.protocol_info.project_type == 2 ||
          res.data.data.protocol_info.project_type == 3 ||
          res.data.data.protocol_info.project_type == 4
        ) {
          that.setData({
            is_full_time_work_flag: true,
            is_part_time_work_flag: false,
            isNewcontract: false,
          });
        } else {
          if (res.data.data.protocol_info.b_company_id == 10) {
            that.setData({
              is_full_time_work_flag: false,
              is_part_time_work_flag: true,
              isNewcontract: true,
            });
          } else {
            that.setData({
              is_full_time_work_flag: false,
              is_part_time_work_flag: true,
              isNewcontract: false,
            });
          }
        }
      }
    });
  },

  next: function (options) {
    this.setData({
      isShowSendCodeView: true,
      msmcode: "",
    });
    if (this.data.can_send_code_flag) {
      this.getcode();
    }
  },

  confirm_next: function (options) {
    console.log(JSON.stringify(options));
    if (this.data.msmcode.length !== 6) return;
    var that = this;
    var request_data = {
      protocol_order_id:
        that.data.agreement_num == 1
          ? options.currentTarget.dataset.itemdata
          : that.data.protocol_order_id,
      team_id: that.data.team_id,
      project_id: that.data.project_id,
      code: that.data.msmcode,
    };
    dmNetwork.post(dmNetwork.protocol_sign, request_data, (res) => {
      if (res.data.errno == 0) {
        wx.showToast({
          title: "合同已生效，请在我的合同中查看",
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
    // clearInterval(thetimer);
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
  onShow: function () {},

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
