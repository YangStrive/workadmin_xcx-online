// pages/uc/protocol_detail/protocol_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.downloadFile({
    //   // 示例 url，并非真实存在
    //   url: 'http://saas-test.doumi.com/sea/api/1.0/client/v1/protocol/download?dmclient=pcweb&X-Doumi-Agent=weixinqy&protocol_order_id=DMWB-QZ-0000013',
    //   success: function(res) {
    //     const filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath: filePath,
    //       fileType: 'pdf',
    //       success: function(res) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   }
    // })

    wx.downloadFile({
      url: 'http://saas-test.doumi.com/sea/api/1.0/client/v1/protocol/download?dmclient=pcweb&X-Doumi-Agent=weixinqy&protocol_order_id=DMWB-QZ-0000013',
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开成功');
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})