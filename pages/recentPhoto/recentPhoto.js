var dmNetwork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tiuploadTexttle:'',
    uploadRecentImage:'',
    biz_id:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getuserinfo().then(res=>{
      let biz_id=wx.getStorageSync('biz_id')[0];
      let recent_image=res.recent_image;
      if(biz_id&&!recent_image){
        this.getFaceResult(biz_id);
        this.setData({
          biz_id
        })
      }
    });
  },
  //获取个人相信信息
  getuserinfo: function () {
    const that = this
    return new Promise((reslove,reject)=>{
      dmNetwork.get(dmNetwork.getuserinfo, {}, (res) => {
        console.log("个人信息" ,res)
        if (res.data.errno == 0) {
          let data=res.data.data;
          let {upload_text,recent_image }=data;
          this.setData({
            uploadText:upload_text,
            uploadRecentImage:recent_image
          });
          reslove(data);
        }else{
          reject();
        }
      }, (err) => {
        //网络异常处理
        reject();
      })
    })
  },
  getFaceResult(biz_id) {
    var that = this;
    let params={
      biz_id
    };
    dmNetwork.get(dmNetwork.getFaceResult, params, (res) => {
      console.log("活体认证信息" ,res)
      wx.removeStorageSync('biz_id');
      const data=res.data;
      if(data.errno=='0'&&data.data.faceid_status=='PASS'){
        const uploadRecentImage = data.data.images ? data.data.images.image_best : "";
        that.setData({
          uploadRecentImage
        })
      }else if(data.errno=='0'&&data.data.faceid_status!='PASS'){
        wx.showToast({
          title: data.data.error_msg,
          icon: "none",
          duration: 1500,
        });
        return
      }
    }, (err) => {
      //网络异常处理
    })
  },
  goFace(){
    wx.navigateTo({
      url: "/pages/soterAuthentication/soterAuthentication",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
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