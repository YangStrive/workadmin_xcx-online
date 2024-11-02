var dmNetwork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    protocol_download_url: '',
    list_array: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    dmNetwork.get(dmNetwork.protocol_list, {}, (res) => {
      console.log(res)
      if (res.data.errno == 0) {
        var protocol = res.data.data;
        if (protocol.length > 0) {
          that.setData({
            list_array: protocol
          })
        } else {
          wx.showToast({
            title: '暂无合同',
            icon: 'none'
          })
        }

      }
    })
  },

  protocol_detail: function (event) {
    // console.log(JSON.stringify(event.currentTarget.dataset.itemdata));
    // console.log(dmNetwork.protocol_download + '?dmclient=weixinxcx&X-Doumi-Agent=weixinqy&protocol_order_id=' + event.currentTarget.dataset.itemdata.jump_data.protocol_order_id);

    // var that = this;
    // var request_data = {
    //   protocol_order_id: event.currentTarget.dataset.itemdata.jump_data.protocol_order_id,
    // }
    // dmNetwork.get(dmNetwork.protocol_download, request_data, (res) => {
    //   if(res.data.errno == 0) {
    //     that.setData({ protocol_download_url:res.data})
    //   }
    // })

    var url = dmNetwork.protocol_download + '?dmclient=weixinxcx&X-Doumi-Agent=weixinqy&protocol_order_id=' + event.currentTarget.dataset.itemdata.jump_data.protocol_order_id + '&protocol_user_id=' + event.currentTarget.dataset.itemdata.jump_data.protocol_user_id + '&protocol_sign=' + event.currentTarget.dataset.itemdata.jump_data.protocol_sign;
    // var url = 'https://saas-test.doumi.com/7a2df6a0bc3ad1e2c0352b79ac849566.pdf';
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用


        // setTimeout(()=>wx.openDocument({
        //   filePath: Path,
        //   success: function (res) {
        //     console.log('打开成功');
        //   }
        // }), 1000);


        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开成功');
          }
        })
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: 'error',
        })
      }
    })
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