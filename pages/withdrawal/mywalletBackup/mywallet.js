// pages/withdrawal/mywallet/mywallet.js

var dmNetwork = require("../../../utils/network.js");
var dmUtil = require("../../../utils/util.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listSH: false,
    page: 1,
    recordlist: [],
    balance: "",
    total: 0,
    gettotal: 0,
    is_bind_bank_card: "", //是否绑定银行卡
    authentication: false,
    real_name_auth:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let is_bind_bank_card = options.is_bind_bank_card || 0;
    // let mobile = options.mobile;
    let that = this;
    dmNetwork.get(
      dmNetwork.getuserinfo,
      {},
      (res) => {
        if (res.data.errno == 0) {
          that.setData({
            is_bind_bank_card: res.data.data.is_bind_bank_card,
            mobile: res.data.data.mobile,
            real_name_auth:res.data.data.real_name_auth
          });
          console.log("------");
          console.log(that.data);
          that.loading();
          that.getWallet();
          that.getwalletrecord();
        }
      },
      (err) => {
        //网络异常处理
      }
    );
  },
  lower: function () {
    if (this.data.gettotal === this.data.total) return;
    this.loading();
    this.getwalletrecord();
  },
  getWallet: function () {
    var that = this;
    dmNetwork.get(dmNetwork.getwallet, "", (res) => {
      if (res.data.errno == 0) {
        that.setData({ balance: res.data.data.balance });
      } else {
      }
    });
  },
  getwalletrecord: function () {
    var that = this;
    dmNetwork.get(
      dmNetwork.getwalletrecord,
      { page: this.data.page },
      (res) => {
        wx.hideLoading();
        if (res.data.errno == 0) {
          console.log(that.data.page, "page");
          console.log(res.data.data.total, "total");
          that.setData({ total: res.data.data.total });
          if (that.data.total != 0) {
            that.setData({ listSH: true });
          }
          let newTime = new Date().getTime();
          res.data.data.records_data.map((v, i) => {
            let m, d, D;
            D = new Date(v.create_at * 1000);
            m = D.getMonth() + 1;
            m = m < 10 ? "0" + m : m.toString();
            d = D.getDate();
            if (newTime - v.create_at * 1000 > 86400000) {
              v.create_at = m + "-" + d;
            } else {
              v.create_at =
                Math.floor((newTime - v.create_at * 1000) / 3600000) + "小时前";
            }
            v.amount = v.amount && v.amount.toFixed(2);
          });
          let recordList = that.data.recordlist.concat(
            res.data.data.records_data
          );
          that.setData({
            page: ++that.data.page,
            recordlist: recordList,
            gettotal: recordList.length,
          });
        } else {
        }
      }
    );
  },
  failbtn: function () {
    wx.navigateTo({ url: "../failnote/failnote" });
  },

  tapbtn: function () {
    var that = this;
    if(!this.data.real_name_auth){
      wx.showToast({
        title: '请先去【我的工作】完成签约和实名认证',
        icon: 'none'
      })
      return;
    }
    if (this.data.is_bind_bank_card == 0) {
      wx.redirectTo({
        url: "../../bindbankcard/bindbankcard?mobile=" + this.data.mobile,
      });
      return;
    }
    that.loading();
    dmNetwork.get(dmNetwork.getauthentication, "", (res) => {
      if (res.data.errno == 0) {
        if (res.data.data.authenticated == 0) {
          wx.hideLoading();
          wx.navigateTo({ url: "../bindidcard/bindidcard" });
        } else {
          var real_name;
          real_name = res.data.data.real_name;
          dmNetwork.get(
            dmNetwork.withdrawaldetail,
            { account_type: 2 },
            (res) => {
              wx.hideLoading();
              if (res.data.errno == 0) {
                if (!res.data.data.account) {
                  wx.navigateTo({
                    url: "../bindwxpay/bindwxpay?true_name=" + real_name,
                  });
                } else {
                  wx.navigateTo({ url: "../withdrawal/withdrawal" });
                }
              } else {
              }
            }
          );
        }
      } else {
        wx.hideLoading();
      }
    });
  },
  loading: function () {
    wx.showLoading({
      title: "",
      mask: true,
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
