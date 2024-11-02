// pages/citylist/citylist.js
var util = require('../../utils/util.js')
var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: true,
    isshow: true,
    pid: '',
    pname: '',
    cid: '',
    cname: '',
    did: '',
    dname: '',
    showname: '',
    addressKey: {},
    addressVal: {},
    cityArr: [],
    districtArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pid: options.province_id,
      pname: options.province_name
    })
    that.getPosition()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getPosition: function () {
    console.log(JSON.stringify(this.data.pid))
    var that = this;
    wx.getStorage({
      key: 'localityData',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (that.data.pid == res.data[i].province_id) {
            var _cityArr = res.data[i].child
            var p_name = res.data[i].short_name
            for (var k = 0; k < _cityArr.length; k++) {
              if (p_name == _cityArr[k].short_name) {
                that.setData({
                  cid: _cityArr[k].city_id,
                  cname: _cityArr[k].short_name,
                  districtArr: _cityArr[k].child
                })
              } else {
                that.setData({
                  cityArr: _cityArr
                })
              }
            }
          }
        }
      }
    })
  },
  //前往区列表
  gotoDistrictList: function (e) {
    wx.navigateTo({
      url: '../districtlist/districtlist?province_id=' + this.data.pid + '&province_name=' + this.data.pname + '&city_id=' + e.currentTarget.dataset.item.city_id + '&city_name=' + e.currentTarget.dataset.item.short_name,
    })
  },
  //获取地址返回
  getCurrAddress: function (e){
    // console.log('获取地址返回'+JSON.stringify(e))
    // wx.navigateTo({
    //   url: '../invite/invite?province_id=' + this.data.pid + '&province_name=' + this.data.pname + '&city_id=' + this.data.pid + '&city_name=' + this.data.pname + '&district_id=' + e.currentTarget.dataset.itemdata.district_id + '&district_name=' + e.currentTarget.dataset.itemdata.short_name,
    // })
    var pages = getCurrentPages();//当前页面
    var prevPage = pages[pages.length - 3];//上一页面
    prevPage.setData({//直接给上移页面赋值
      province_id: this.data.pid,
      province_name: this.data.pname,
      city_id: this.data.pid,
      city_name: this.data.pname,
      district_id: e.currentTarget.dataset.itemdata.district_id,
      district_name: e.currentTarget.dataset.itemdata.short_name
    });
    wx.navigateBack({
      delta: 2
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