// pages/flexwork/rewardlist/rewardlist.js
var dmNetwork = require('../../../utils/network.js')
const util = require('../../../utils/util.js')
var allThat
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team_id: '',
    project_id: '',
    isShowRewardBtn: false,
    rewardlist: [],
    scroll_vh: 0,
    page: 1,
    page_size: 7,
    startTime: '',
    endTime: '',
    logo: '',
    name: '',
    hasMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      team_id: wx.getStorageSync('team_id'),
      project_id: wx.getStorageSync("project_id")
    })
    this.getList()
    allThat = this
  },
  getList() {
    dmNetwork.getInBackground(dmNetwork.rewardlist, {
      team_id: this.data.team_id,
      project_id: this.data.project_id,
      page: this.data.page,
      page_size: this.data.page_size
    },
      (res) => {
        wx.stopPullDownRefresh()
        if (res.data.errno == 0) {
          var resultData = []
          if (this.data.page != 1) {
            resultData = this.data.rewardlist
          }
          var btnShow = res.data.data.view_reward_rules_btn_show == 1

          var sStr = res.data.data.date.start
          var eStr = res.data.data.date.end

          var startS = sStr.split('-')
          var endS = eStr.split('-')

          for (var i = 0; i < res.data.data.list.length; i++) {
            resultData.push(res.data.data.list[i])
          }
          var hasMore = res.data.data.total_page != this.data.page
          
          this.setData({
            startTime: startS[1] + '月' + startS[2] + '日',
            endTime: endS[1] + '月' + endS[2] + '日',
            isShowRewardBtn: btnShow,
            rewardlist: resultData,
            logo: res.data.data.my_data.logo.thumb_url,
            name: res.data.data.my_data.name,
            ranking: res.data.data.my_data.ranking,
            praise: res.data.data.my_data.praise,
            attend_daycount: res.data.data.my_data.attend_daycount,
            page: this.data.page + 1,
            hasMore: hasMore
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      (err) => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      })
  },
  doPraise(ptype, uid) {
    var p = 0 == ptype ? 1 : 0
    dmNetwork.postInBackground(dmNetwork.rewardpraise, {
      team_id: this.data.team_id,
      project_id: this.data.project_id,
      type: p,
      to_user_id: uid
    },
      (res) => {
        if (res.data.errno == 0) {
          var rewardnew = this.data.rewardlist
          for (var i = 0; i < rewardnew.length; i++) {
            if (rewardnew[i].user_id == uid) {
              if (p == 0) {
                rewardnew[i].is_praise = 0
                rewardnew[i].praise = rewardnew[i].praise - 1
              } else {
                rewardnew[i].is_praise = 1
                rewardnew[i].praise = rewardnew[i].praise + 1
              }
            }
          }
          this.setData({
            rewardlist: rewardnew
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      })
  },
  onClickPraise: util.throttle( (e)=> {
    console.log(e)
    var uid = e.currentTarget.dataset.uid
    var statu = e.currentTarget.dataset.statu
    allThat.doPraise(statu,uid)
  }, 1000,this),
  onClickReword(e) {
    wx.navigateTo({
      url: '../rewarddetail/rewarddetail',
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
    this.setData({
      page: 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(111)
    if (!this.data.hasMore) {
      return
    }
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})