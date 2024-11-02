// pages/uc/turnvisitrecord/turnvisitrecord.js
var dmNetwork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    detail_len: 0,
    currentTip: -1,
    tipList: [],
    tags: {},
    visit_history: [],
    visitId: '',
    actived: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  initData(options) {
    let visitId = options.id
    this.setData({
      visitId
    })
    dmNetwork.get(dmNetwork.get_visit_history, {
      dmclient: 'weixinxcx',
      visit_id: options.id
    }, (res) => {
      let data = res.data
      if (data && data.errno === '0') {
        let tipList = this.mapTipList(data.data.tags_radio)
        let visit_history = data.data.visit_history
        this.setData({
          tipList,
          visit_history
        })
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none',
        })
      }
    })
  },
  mapTipList(data) {
    let tipList = []
    for (let index in data) {
      let item = data[index]
      let targetObj = {
        title: item.title,
        name: item.name,
        radio: [item.option[0], item.option[1]],
        checked: null
      }
      tipList.push(targetObj)
    }
    return tipList
  },
  chooseTip(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentTip: index
    })
  },
  radioChange(e) {
    let index = e.currentTarget.dataset.tipindex
    let value = e.detail.value
    let key = "tipList[" + index + "].checked"
    let tagName = this.data.tipList[index].name
    let tag = {
      [tagName]: value
    }
    let tags = this.data.tags
    tags = Object.assign(tags, tag)
    let actived = (Object.values(tags).length === this.data.tipList.length) ? true : false
    this.setData({
      [key]: value,
      tags,
      actived
    })
  },
  textareaChange(e) {
    // debugger
    // let tags = this.data.tags
    // let actived = (Object.values(tags).length === this.data.tipList.length ) ? true : false
    this.setData({
      detail: e.detail.value,
      detail_len: e.detail.value.length
      // actived
    })
  },
  handleSave() {
    let tags = this.data.tags
    let objLength = Object.values(tags).length
    let that = this
    if (objLength < this.data.tipList.length) {
      wx.showToast({
        title: '请选择回访内容',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return
    }
    // wx.showToast({
    //   title: '保存成功',
    //   icon: 'none'
    // })
    // console.log(this.data.detail);
    dmNetwork.get(dmNetwork.add_visit_record, {
      dmclient: 'weixinxcx',
      visit_id: this.data.visitId,
      tags: this.data.tags,
      describe: this.data.detail
    }, (res) => {
      let data = res.data
      if (data && data.errno === '0') {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        setTimeout(() => {
          that.goback()
        }, 1000)
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  goback() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.resetData()
    prevPage.getVisitList()
    setTimeout(() => {
      wx.navigateBack()
    }, 0)
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