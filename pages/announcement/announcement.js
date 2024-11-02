var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../utils/util.js')
var dmNetwork = require('../../utils/network.js')

Page({
  data: {
    tabs: ["未读", "已读"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    readList: [],
    noreadList: [],
    startReadNum: 0,
    startNoreadNum: 0,
    project_id: 0,
    team_id: 0,
    count: ''
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.setData({
      team_id: options.team_id || 0,
      project_id: options.project_id || 0
    });
    this.getnonoticelist()
  },
  onPullDownRefresh: function () {
    //下拉  
    console.log("下拉");

    if (this.data.activeIndex == 0) {
      this.setData({
        noreadList: [],
        startNoreadNum: 0
      });
      this.getnonoticelist()
    } else if (this.data.activeIndex == 1) {
      this.setData({
        readList: [],
        startReadNum: 0
      });
      this.getnoticelist()
    }

  },
  onReachBottom: function () {
    //上拉  
    console.log("上拉")
    if (this.data.activeIndex == 0) {
      this.getnonoticelist()
    } else if (this.data.activeIndex == 1) {
      this.getnoticelist()
    }
  },
  //获取已读公告列表
  getnoticelist: function () {
    var that = this
    dmNetwork.get(dmNetwork.noticelist, {
      team_id: that.data.team_id,
      project_id: that.data.project_id,
      read: 1,
      offset: 20,
      start: that.data.startReadNum
    }, (res) => {
      wx.stopPullDownRefresh()
      if (res.data.errno == 0) {
        for (var i = 0; i < res.data.data.list.length; i++) {
          var create_at = res.data.data.list[i].create_at
          res.data.data.list[i].create_at = util.formatDate(create_at)
        }
        that.setData({
          startReadNum: res.data.data.next,
          readList: that.data.readList.concat(res.data.data.list)
        });

      }
    }, (err) => {

    })
  },
  //获取未读公告列表
  getnonoticelist: function (Num) {
    var that = this
    dmNetwork.get(dmNetwork.noticelist, {
      team_id: that.data.team_id,
      project_id: that.data.project_id,
      read: 0,
      offset: 20,
      start: this.data.startNoreadNum
    }, (res) => {
      wx.stopPullDownRefresh()
      if (res.data.errno == 0) {
        for (var i = 0; i < res.data.data.list.length; i++) {
          var create_at = res.data.data.list[i].create_at
          res.data.data.list[i].create_at = util.formatDate(create_at)
        }

        that.setData({
          startNoreadNum: res.data.data.next,
          noreadList: that.data.noreadList.concat(res.data.data.list),
          count: '(' + res.data.data.count + ')'
        });
        if (res.data.data.count != 0) {
          that.setData({
            count: '(' + res.data.data.count + ')'
          });
        } else {
          that.setData({
            count: ''
          });
        }
      }
    })
  },
  //跳转到公告详情
  onClickAddetails: function (e) {
    if (e.currentTarget.dataset.isread == 0) {
      wx.setStorageSync("needRefresh", 1)
    }
    var currentItemdata = e.currentTarget.dataset.itemdata;
    var project_id = e.currentTarget.dataset.projectid || this.data.project_id;
    var team_id = e.currentTarget.dataset.teamid || this.data.team_id;
    wx.navigateTo({
      url: 'ggdetails/ggdetails?team_id=' + team_id + '&project_id=' + project_id + "&notice_id=" + currentItemdata,
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    console.log(this.data.activeIndex)
    this.onPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var isRefresh = wx.getStorageSync("isRefresh")
    if (isRefresh == 1) {
      wx.setStorageSync("isRefresh", 0)
      this.onPullDownRefresh()
      console.log('refresh')
    }
  }
});