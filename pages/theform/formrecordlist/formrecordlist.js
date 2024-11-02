// pages/theform/formrecordlist/formrecordlist.js
var dmNetwork = require('../../../utils/network.js')
var dmUtil = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    page_no:1,
    page_size:20,
    showEmpty:true,
    countinfopersonal:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var options = dmUtil.getQueryString()
    this.setData({ options: options })
    this.getStatisticsInit();  
  },
  getStatisticsInit: function () {
    let data = this.data.options;
    data.page_no = this.data.page_no;
    data.page_size = this.data.page_size;
    dmNetwork.post(
      dmNetwork.getformlist, 
      data, 
      (res) => {
        var data = res.data;
        if (data.errno == 0) {
          var listArr = data.data;
          if (listArr.length == 0 && this.data.countinfopersonal.length == 0) {
            this.setData({ showEmpty:true});
            // return
          } else {
            var loadingCk;
            if (listArr.length == 0) {
              loadingCk = true;
            } else {
              loadingCk = false;
            }
            this.setData({ showEmpty: false, countinfopersonal: this.data.countinfopersonal.concat(listArr), loading: loadingCk });
          }
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none',
          })

        }
      },
      () => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
      })
    })

  },
  gotoPersonal:function(e){
    wx.navigateTo({ url: '../formdetail/formdetail?team_id=' + this.data.options.team_id + '&project_id=' + this.data.options.project_id + '&record_id=' + e.currentTarget.dataset.countid})
  },
  onReachBottom:function(){
    if(this.data.loading) return;
    this.setData({ page_no: this.data.page_no+1,loading:true})
    this.getStatisticsInit()
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})