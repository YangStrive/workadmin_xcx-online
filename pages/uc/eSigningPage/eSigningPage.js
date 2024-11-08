// pages/uc/eSigningPage/eSingingPage.js

var dmNetwork = require("../../../utils/network.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    team_id: 0,
    project_id: 0,
		timer: null,
		sign_url:'',
    count: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      team_id: options.team_id,
      project_id: options.project_id,
    });

    this.init();
  },

  init() {
		//每三秒调用一次getNewESinging，调用20次后停止
		wx.showLoading({
			title: "加载中",
		})
		let count = 0;
    this.getNewESinging();

		this.data.timer = setInterval(() => {
			count++;
      this.setData({
        count: count
      })
			if(count >= 5){
				wx.hideLoading();
				clearInterval(this.data.timer);
        wx.showModal({
          title: '提示',
          content: '获取签署文件失败,请稍后重试',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }
        })
			}else{
        this.getNewESinging();
      }
		}, 4000);
  },

	getNewESinging(){
    let request_data = {
      project_id: this.data.project_id,
      team_id: this.data.team_id,
    };

    dmNetwork.post(dmNetwork.newESinging, request_data, (res) => {

      if (res.data.errno == 0) {
				if(res.data.data && res.data.data.sign_url){
					//停止定时器
					clearInterval(this.data.timer);
					if(!this.data.sign_url){
						this.setData({
							sign_url:res.data.data.sign_url
						})

					}
				}
        //
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
      }
    });
  },

	handleGetMessage:function(e){
		if(e.detail.data[0].result=='success'){
			wx.navigateTo({
				 url:'/pages/minework/minework'
			})
		}
	},

  handleSignPageLoad: function (e) {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    wx.hideLoading();
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
