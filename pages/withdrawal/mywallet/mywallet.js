// pages/withdrawal/mywallet/mywallet.js

var dmNetwork = require("../../../utils/network.js");
var dmUtil = require("../../../utils/util.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    balance: "",
    total: 0,
    gettotal: 0,
    is_bind_bank_card: "", //是否绑定银行卡
    authentication: false,
    real_name_auth: false,
    /********************* new */
    userInfo: {},
    mobile: "",
    amount: "",
    totalBalance: {
      //总额、微信及银行卡余额
      total: 0.0,
      balance: 0.0,
      bank_balance: 0.0,
    },
    card_no: "",
    tabIndex: 1,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    bankPage: 1,
    bankTotalPage: 0,
    tabList: [
      {
        id: 0,
        title: "可微信提现",
        tabType: "wechat",
        balanceOutstanding: "0.00",
      },
      {
        id: 1,
        title: "可银行卡提现",
        tabType: "bank",
        balanceOutstanding: "0.00",
      },
    ],
    bankTabIndex: 0,
    bankTabId: 1,
    bankTabList: [
      { id: 1, title: "可提现/提现中", tabType: "bank" },
      { id: 2, title: "提现成功", tabType: "bank" },
      { id: 0, title: "全部", tabType: "bank" },
    ],
    bankList: [
      // {
      //   id: 1,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 2,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 3,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 4,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 5,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 6,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 7,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 8,
      //   title: "斗米平台发工资",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
    ],
    wechatList: [
      // {
      //   id: 1,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 2,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 3,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 4,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 5,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 6,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 7,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
      // {
      //   id: 8,
      //   title: "斗米平台发工资wechat",
      //   balanceType: "入账",
      //   remark: "斗米平台发工资wechat",
      //   balance: "893.12",
      //   time: "07-30",
      //   staus: "提现成功",
      // },
    ],
    contentHeight: 0,
    withdrawalAmountFail: false,
    showBindBankModal: false,
    withdrawalAmount: false,
    withdrawalAmountType: false,
    statusTips: "当前未绑定银行卡，不可提现请绑定银行卡",
    statusBtnTips: "去绑定",
    withdrawalFailReason: "",
    listingStatus: "",
    orderId: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const that = this;
    const [userInfoErr, userInfo] = await dmUtil.awaitWrap(that.getUserInfo());
    await that.dSetData({ userInfo: userInfo });
    //获取总的余额
    that
      .getWallet()
      .then((totalBalance) => {
        that.setData({
          totalBalance,
        });
      })
      .catch((err) => {
        that.toast({ title: err });
      });
    that.getwalletrecord(that.data.tabIndex);
    // that.getwalletrecord(1);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    // 先取出页面高度 windowHeight
    const windowHeight = await this.getSystemInfo();
    let query = wx.createSelectorQuery().in(this);
    query.select("#mywallet-header").boundingClientRect();
    query.select("#total-balance").boundingClientRect();
    query.select("#mywallet-tabs").boundingClientRect();
    query.exec((res) => {
      let headerHeight = res[0].height;
      let balanceHeight = res[1].height;
      let tabsHeight = res[2].height;
      let scrollViewHeight =
        windowHeight - headerHeight - balanceHeight - tabsHeight;
      this.setData({
        contentHeight: scrollViewHeight,
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {},
  //获取个人信息
  getUserInfo: function () {
    return new Promise((reslove, reject) => {
      dmNetwork.get(
        dmNetwork.getuserinfo,
        {},
        (res) => {
          if (res.data.errno == 0) {
            reslove(res.data.data);
          } else {
            reject(res.data.errmsg);
          }
        },
        (err) => {
          reject(err);
        },
        true
      );
    });
  },
  //获取总余额
  getWallet: function () {
    return new Promise((reslove, reject) => {
      dmNetwork.get(
        dmNetwork.getwallet,
        "",
        (res) => {
          if (res.data.errno == 0) {
            reslove(res.data.data);
          } else {
            reject();
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  },
  //获取钱包流水明细
  getwalletrecord: function (type = 0) {
    let that = this;
    dmNetwork.get(
      dmNetwork.getwalletrecord,
      {
        page: type == 0 ? that.data.page : that.data.bankPage,
        type,
        status: that.data.bankTabId,
        per_page: that.data.pageSize,
      },
      (res) => {
        if (
          res.data.errno == 0 &&
          res.data.data &&
          res.data.data.records_data.length > 0
        ) {
          const data = res.data.data;
          console.log(type, data);
          if (type == 0) {
            that.wechatListhandler(data);
          } else {
            that.bankListhandler(data);
          }
        }
      },
      (err) => {}
    );
  },
  //处理微信钱包列表
  wechatListhandler: function (data) {
    const that = this;
    const wechatList = that.timeHandler(data.records_data, 0);
    that.setData({
      wechatList: that.data.wechatList.concat(wechatList),
      page: ++that.data.page,
      totalPage: data.total,
    });
  },
  //处理银行卡钱包列表
  bankListhandler: function (data) {
    const that = this;
    const bankList = that.timeHandler(data.records_data, 1);
    that.setData({
      bankList: that.data.bankList.concat(bankList),
      bankPage: ++that.data.bankPage,
      bankTotalPage: data.total,
      card_no: data.bank_card_number,
    });
  },
  //处理钱包的时间
  timeHandler: function (data, type) {
    let wechatList;
    let newTime = new Date().getTime();
    wechatList = data.map((v, i) => {
      let y, m, d, D;
      D = new Date(v.create_at * 1000);
      y = D.getFullYear();
      m = D.getMonth() + 1;
      m = m < 10 ? "0" + m : m.toString();
      d = D.getDate();
      if (newTime - v.create_at * 1000 > 86400000) {
        v.create_at = type == 0 ? m + "-" + d : y + "年" + m + "月" + d + "日";
      } else {
        v.create_at =
          Math.floor((newTime - v.create_at * 1000) / 3600000) + "小时前";
      }
      // v.amount = v.amount && Number(v.amount).toFixed(2);
      return v;
    });
    return wechatList;
  },
  //处理银行卡时间
  bankTimeHandler: function (data) {
    return data.map((v, i) => {
      let date = new Date(Number(v.create_at));
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      v.create_at = year + "年" + month + "月" + day + "日";
      return v;
    });
  },
  //切换tabs
  switchTabs: async function (e) {
    const { id } = e.currentTarget.dataset.item;
    if (id == this.data.tabIndex) {
      return;
    }
    await this.dSetData({ tabIndex: id });
    await this.initTabData(id);
    this.getwalletrecord(id);
  },
  //初始化tab数据
  initTabData: function (tabIndex) {
    return new Promise(async (reslove, reject) => {
      if (tabIndex == 0) {
        await this.dSetData({
          page: 1,
          totalPage: 0,
          wechatList: [],
        });
        reslove();
      } else {
        await this.dSetData({
          bankPage: 1,
          bankTotalPage: 0,
          bankList: [],
          bankTabId: 1,
        });
        reslove();
      }
    });
  },
  //银行卡tab切换
  switchBankTab: function (e) {
    const bankTabIndex = e.currentTarget.dataset.banktabindex;
    const bankTabId = e.currentTarget.dataset.banktabid;
    if (this.data.bankTabIndex == bankTabIndex) {
      return;
    }
    this.setData(
      {
        bankTabIndex,
        bankTabId,
        bankPage: 1,
        bankTotalPage: 0,
        bankList: [],
      },
      () => {
        this.getwalletrecord(this.data.tabIndex);
      }
    );
  },
  // 滚动加载
  lower: function () {
    console.log("到底部了。。。");
    if (
      this.data.tabIndex == 0 &&
      this.data.totalPage == this.data.wechatList.length
    ) {
      return;
    }
    if (
      this.data.tabIndex == 1 &&
      this.data.bankTotalPage == this.data.bankList.length
    ) {
      return;
    }
    this.getwalletrecord(this.data.tabIndex);
  },
  // 微信钱包提现
  withdrawalWechat: async function () {
    var that = this;
    const [userInfoErr, userInfo] = await dmUtil.awaitWrap(that.getUserInfo());
    if (userInfoErr) {
      that.toast({ title: userInfoErr });
      return;
    }
    const { is_bind_bank_card, mobile, real_name_auth } = userInfo;
    if (!real_name_auth) {
      wx.showToast({
        title: "请先去【我的工作】完成签约和实名认证",
        icon: "none",
      });
      return;
    }
    if (is_bind_bank_card == 0) {
      wx.redirectTo({
        url: "../../bindbankcard/bindbankcard?mobile=" + mobile,
      });
      // wx.showToast({
      //   title: "请先去绑定银行卡",
      //   icon: "none",
      // });
      return;
    }
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
  // 微信提现跳转失败页面
  goFailPage: function (e) {
    const listingStatus = e.currentTarget.dataset.listingstatus;
    if (listingStatus !== "提现失败") {
      return;
    }
    wx.navigateTo({ url: "../failnote/failnote" });
  },
  // 银行卡提现
  withdrawalBank: async function (e) {
    const that = this;
    const { listing_status, amount,withdraw_amount, tips, order_id } =
      e.currentTarget.dataset.item;
    await that.dSetData({
      listingStatus: listing_status,
      withdrawalFailReason: tips,
      orderId: order_id,
    });
    if (listing_status == "提现成功") {
      return;
    }
    if (listing_status == "提现失败") {
      that.setData({
        withdrawalAmountFail: !that.data.withdrawalAmountFail,
        amount:withdraw_amount
      });
      return;
    }
    if (listing_status === "待提现") {
      // const [userInfoErr, userInfo] = await dmUtil.awaitWrap(
      //   that.getUserInfo()
      // );
      // if (userInfoErr) {
      //   that.toast({ title: userInfoErr });
      //   return;
      // }
      const { is_bind_bank_card, mobile, real_name_auth } = that.data.userInfo;
      if (!real_name_auth) {
        wx.showToast({
          title: "请先去【我的工作】完成签约和实名认证",
          icon: "none",
        });
        return;
      }
      if (is_bind_bank_card == 0) {
        that.setData({
          statusTips: "当前未绑定银行卡，不可提现。请绑定银行卡",
          statusBtnTips: "去绑定",
          mobile,
          showBindBankModal: !that.data.showBindBankModal,
        });
        return;
      }
      that.setData({
        amount:withdraw_amount,
        withdrawalAmount: !that.data.withdrawalAmount,
      });
      return;
    }
    if (listing_status == "提现中") {
      that.setData({
        statusTips:
          "提现操作后，状态会变为提现中，银行结果返回时间约5-30分钟，请您耐心等待提现结果",
        statusBtnTips: "知道了",
        showBindBankModal: !that.data.showBindBankModal,
      });
      return;
    }
    if (listing_status == "已撤回") {
      that.setData({
        statusTips:
          "该笔工资可能因为错误发放，已经被项目经理撤回。如有疑问请与项目经理联系",
        statusBtnTips: "知道了",
        showBindBankModal: !that.data.showBindBankModal,
      });
      return;
    }
  },
  submitWithdrawalAmount: async function () {
    const that = this;
    that.setData({
      withdrawalAmount: !that.data.withdrawalAmount,
    });
    dmNetwork.get(
      dmNetwork.bankWithdrawalway,
      { order_id: that.data.orderId },
      (res) => {
        if (res.data.errno == 0) {
          that.toast({ title: "提现成功" });
        } else {
          that.toast({ title: res.data.errmsg });
        }
      }
    );
  },
  goBindBank: function () {
    const mobile = this.data.mobile;
    if (this.data.listingStatus == "待提现"||this.data.listingStatus == "提现失败") {
      if (!mobile) {
        this.toast({ title: "未获取到手机号，请退出重试！" });
        return;
      }
      this.setData({
        showBindBankModal: !this.data.showBindBankModal,
      });
      wx.redirectTo({
        url: "../../bindbankcard/bindbankcard?mobile=" + mobile,
      });
    } else {
      this.setData({
        showBindBankModal: !this.data.showBindBankModal,
      });
    }
  },
  withdrawalBankAgain: function () {
    const that = this;
    const { is_bind_bank_card, mobile, real_name_auth } = that.data.userInfo;
    if (!real_name_auth) {
      wx.showToast({
        title: "请先去【我的工作】完成签约和实名认证",
        icon: "none",
      });
      return;
    }
    if (is_bind_bank_card == 0) {
      that.setData({
        statusTips: "当前未绑定银行卡，不可提现。请绑定银行卡",
        statusBtnTips: "去绑定",
        mobile,
        showBindBankModal: !that.data.showBindBankModal,
        withdrawalAmountFail: !that.data.withdrawalAmountFail,
      });
      return;
    }
    that.setData({
      withdrawalAmountFail: !that.data.withdrawalAmountFail,
    },res=>{
      that.setData({
        withdrawalAmount: !that.data.withdrawalAmount,
      })
    });
    // dmNetwork.get(
    //   dmNetwork.bankWithdrawalway,
    //   { order_id: that.data.orderId },
    //   (res) => {
    //     if (res.data.errno == 0) {
    //       that.toast({ title: "提现成功" });
    //     } else {
    //       that.toast({ title: res.data.errmsg });
    //     }
    //   }
    // );
  },
  closeBindBankModal: function () {
    this.setData({
      showBindBankModal: !this.data.showBindBankModal,
    });
  },
  closeWithdrawalAmountModal: function () {
    this.setData({
      withdrawalAmount: !this.data.withdrawalAmount,
    });
  },
  closeWithdrawalAmountFailModal: function () {
    this.setData({
      withdrawalAmountFail: !this.data.withdrawalAmountFail,
    });
  },
  closeWithdrawalTypeModal: function () {
    this.setData({
      withdrawalAmountType: !this.data.withdrawalAmountType,
    });
  },
  loading: function () {
    wx.showLoading({
      title: "",
      mask: true,
    });
  },
  getSystemInfo: function () {
    return new Promise((resloce, reject) => {
      wx.getSystemInfo({
        success: function (res) {
          resloce(res.windowHeight ? res.windowHeight : "");
        },
      });
    });
  },
  toast: function ({
    title = "加载失败，请重试!",
    icon = "none",
    mask = true,
    duration = 2000,
  }) {
    wx.showToast({
      title,
      icon,
      mask,
      duration,
    });
  },
  dSetData: function (data) {
    return new Promise((reslove, reject) => {
      const that = this;
      that.setData(
        {
          ...data,
        },
        (res) => {
          reslove();
        },
        (err) => {
          reject();
        }
      );
    });
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
