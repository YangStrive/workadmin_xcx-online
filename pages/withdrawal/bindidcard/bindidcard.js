// pages/withdrawal/bindidcard/bindidcard.js
var dmNetwork = require('../../../utils/network.js')
var dmUtil = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idnumber: '',
    checked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  tapBtn: function () {
    let that = this;
    if (!this.data.name || !this.data.idnumber) return;
    this.loading()
    dmNetwork.get(dmNetwork.doauthentication, { name: that.data.name, idnumber: that.data.idnumber, }, (res) => {
      wx.hideLoading()
      if (res.data.errno == 0) {
        wx.showToast({ title: '绑定成功', icon: 'success' })
        setTimeout(function () {
          wx.redirectTo({ url: '../bindwxpay/bindwxpay?true_name=' + that.data.name})
        }, 1500)
      }
      else {
        wx.showToast({ title: res.data.errmsg, icon: 'none' })
      }
    })

  },
  namechange: function (ev) {
    let name = ev.detail.value
    this.setData({ name: name, checked: this.data.idnumber.length == 18 && name })

  },
  idchange: function (ev) {
    let num = ev.detail.value;
    //let checkid = false;
    this.setData({ idnumber: num, checked: num.length == 18 && this.data.name })
  },
  identityCodeValid: function (code) {
    let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    let tip = "";
    let pass = true;
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
      tip = "身份证号格式错误";
      pass = false;
    }
    else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    }
    else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        if (code[17] === 'x') code[17] = 'X'
        //∑(ai×Wi)(mod 11)
        //加权因子
        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        let ai = 0;
        let wi = 0;
        for (let i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        let last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "校验位错误";
          pass = false;
        }
      }
    }
    // if(!pass) alert(tip);
    return tip;
  },
  loading: function () {
    wx.showLoading({
      title: '',
      mask: true,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})