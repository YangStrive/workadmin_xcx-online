// pages/theform/editreportinfo/editreportinfo.js

var dmNetwork = require('../../../utils/network.js')
var dmUtil = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc: '',
    lists: [],
    options:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var options = dmUtil.getQueryString();
    this.setData({ options: options })
    this.getFormItemList()
  },
  getFormItemList: function () {
    var data = this.data.options;
    var that = this;
    dmNetwork.post(dmNetwork.formdetail, data, (res) => {
      if (res.data.errno == 0) {
        wx.setNavigationBarTitle({
          title: res.data.data.title,
        })
        that.setData({lists:res.data.data})
      }
      else {
      }
    })
  },
  onDeleteform:function(){
    var that = this;
    wx.showModal({
      title:'删除',
      content	:'是否删除',
      success:(data)=>{
        if (data.confirm) {
          var data = that.data.options;
          dmNetwork.post(dmNetwork.delform, data, (res) => {
            if (res.data.errno == 0) {
              wx.showToast({
                title: '删除成功', 'icon': 'success', success: function () {
                  wx.setStorageSync("needRefresh", 1)
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2];  //上一个页面
                  prevPage.setData({ countinfopersonal:[], page_no:1})
                  prevPage.onLoad()
                  wx.navigateBack()
              }})
            } else {
              wx.showToast({
                title: res.data.errmsg == '记录不能被删除' ? '该表单不可被删除' : res.data.errmsg,
                icon: 'none',
              })
            }
          })

        }
      }
    })
  },
  omPreviewImage:function(ev){
    var imgfiles = ev.currentTarget.dataset.imgfiles,
        imgPreview = [];
    imgfiles.map((val,index)=>{
      imgPreview.push(val)
    })
    dmUtil.previewImage(imgPreview,ev.currentTarget.dataset.imgvalue);
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },
})