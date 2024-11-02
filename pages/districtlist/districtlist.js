// pages/districtlist/districtlist.js
var util = require('../../utils/util.js')
var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: true,
    showname: '',
    cid: '',
    cname: '',
    pid: '',
    pname: '',
    did: '',
    dname: '',
    districtArr: [],
    addressKey: {},
    addressVal: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      cid: options.city_id,
      cname: options.city_name,
      pid: options.province_id,
      pname: options.province_name
    })
    that.getPosition();
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getPosition: function () {
    var that = this;
    wx.getStorage({
      key: 'localityData',
      success: function (res) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          var datachild = res.data[i].child
          for (var k = 0; k < datachild.length; k++){
            if (that.data.cid == datachild[k].city_id) {
              that.setData({
                districtArr: datachild[k].child
              })
            }
          }
        }
      }
    })
    console.log(JSON.stringify(that.data.districtArr) )
  },
  //获取地址返回
  getCurrAddress: function (e) {
    console.log('获取地址返回'+JSON.stringify(e))
    var pages = getCurrentPages();//当前页面
    var prevPage = pages[pages.length - 4];//上一页面
    prevPage.setData({//直接给上移页面赋值
      province_id: this.data.pid,
      province_name: this.data.pname,
      city_id: this.data.cid,
      city_name: this.data.cname,
      district_id: e.currentTarget.dataset.itemdata.district_id,
      district_name: e.currentTarget.dataset.itemdata.short_name
    });
    wx.navigateBack({
      delta: 3
    })
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})