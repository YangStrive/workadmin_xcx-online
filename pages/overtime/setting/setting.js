// pages/overtime/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseWage: 0.00,
    normalMultiple: 1,
    weekendMultiple: 1.5,
    holidayMultiple: 2,
    baseHourMoney:0,
    normalWage: 0.00,
    weekendWage: 0.00,
    holidayWage: 0.00,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  saveWageSetting: function (e) {


    wx.navigateBack({
      delta: '1'
    })
  },
  cleanStr(value) {
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
    if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
      value = parseFloat(value);
    }
    return value
  },
  inputBaseWage: function (e) {

    var str = e.detail.value
    if(str.length > 0){
      var money = this.cleanStr(str)
      var baseHourMoney = (money * 100)/8/100
      this.setData({
        baseHourMoney: baseHourMoney,
        baseWage:money,
        normalWage: (this.data.normalMultiple * baseHourMoney).toFixed(2),
        weekendWage: (this.data.weekendMultiple * baseHourMoney).toFixed(2),
        holidayWage: (this.data.holidayMultiple * baseHourMoney).toFixed(2),
      })
    }
  },
  inputNormalMultiple:function(e){
    var str = e.detail.value
    if (str.length > 0) {
      var multiple = this.cleanStr(str)
      this.setData({
        normalMultiple:multiple,
        normalWage: (this.data.baseHourMoney * multiple).toFixed(2)
      })
    }
  },
  inputWeekendMultiple: function (e) {
    var str = e.detail.value
    if (str.length > 0) {
      var multiple = this.cleanStr(str)
      this.setData({
        weekendMultiple: multiple,
        weekendWage: (this.data.baseHourMoney * multiple).toFixed(2)
      })
    }
  },
  inputHolidayMultiple: function (e) {
    var str = e.detail.value
    if (str.length > 0) {
      var multiple = this.cleanStr(str)
      this.setData({
        holidayMultiple: multiple,
        holidayWage: (this.data.baseHourMoney * multiple).toFixed(2)
      })
    }
  },
  inputNormalWage: function (e) {
    var str = e.detail.value
    if (str.length > 0) {
      var money = this.cleanStr(str)
      this.setData({
        normalWage: money
      })
    }
  },
  inputWeekendWage: function (e) {
    var str = e.detail.value
    if (str.length > 0) {
      var money = this.cleanStr(str)
      this.setData({

        weekendWage: money
      })
    }
  },
  inputHolidayWage: function (e) {
    var str = e.detail.value
    if (str.length > 0) {
      var money = this.cleanStr(str)
      this.setData({

        holidayWage: money
      })
    }
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