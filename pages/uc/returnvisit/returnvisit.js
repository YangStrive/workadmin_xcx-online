// pages/uc/returnvisit/returnvisit.js
var dmNetwork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex: 0, //当前选中的tab页
    projectArray: [{
      id: "",
      name: "全部项目"
    }], //选择项目列表
    frequencyArray: [{
      val: "0",
      txt: "全部频次"
    }], //选择回访频率列表
    noProjectIndex: 0, //未回访选择项目索引
    noFrequencyIndex: 0, //未回访选择回访频率索引
    hasProjectIndex: 0, //已回访选择项目索引
    hasFrequencyIndex: 0, //已回访选择回访频率索引
    showBottomModal: false,
    currentInfo: {}, // 当前选中人的信息
    page_size: 10,
    no_page_no: 1,
    has_page_no: 1,
    noVisitList: [],
    hasVisitList: [],
    undone_num: 0, // 待访问的数量
    no_next_quest: false, // 未回访是否可翻页
    has_next_quest: false, // 已回访是否可翻页
    tipList: [], // 原因标签
    firstLodHasVisit: false,
    showPageContent: false,
    noClearList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  initData() {
    this.getSelectList()
    this.getVisitList()
  },
  // 获取列表
  getVisitList(loadHasVisitFlag) {
    if (!this.data.noClearList) {
      this.setData({
        showPageContent: false
      })
    }

    let projectIndex = this.data.currentTabIndex === 0 ? this.data.noProjectIndex : this.data.hasProjectIndex
    let projectId = this.data.projectArray[projectIndex] ? this.data.projectArray[projectIndex].id : ''

    let frequencyIndex = this.data.currentTabIndex === 0 ? this.data.noFrequencyIndex : this.data.hasFrequencyIndex
    let visit_type = this.data.frequencyArray[frequencyIndex] ? this.data.frequencyArray[frequencyIndex].val : ''

    let page_no = this.data.currentTabIndex === 0 ? this.data.no_page_no : this.data.has_page_no

    dmNetwork.get(dmNetwork.get_visit_list, {
      dmclient: 'weixinxcx',
      visit_status: loadHasVisitFlag ? 1 : this.data.currentTabIndex,
      page_size: this.data.page_size,
      page_no,
      project: projectId,
      visit_type: visit_type
    }, (res) => {
      let data = res.data
      if (data && data.errno === '0') {
        let list = []
        let key = this.data.currentTabIndex === 0 ? 'noVisitList' : 'hasVisitList'
        let undone_num = this.data.currentTabIndex === 0 ? data.data.undone_num : this.data.undone_num

        if (this.data.currentTabIndex === 0) {
          let oldList = this.data.noVisitList
          list = oldList.length > 0 ? oldList.concat(data.data.list) : data.data.list
          if (data.data.total_page > this.data.no_page_no) {
            this.setData({
              no_next_quest: true
            })
          }
        } else {
          let oldList = this.data.hasVisitList
          list = oldList.length > 0 ? oldList.concat(data.data.list) : data.data.list
          if (data.data.total_page > this.data.has_page_no) {
            this.setData({
              has_next_quest: true
            })
            console.log('llllll');
            console.log(this.data.has_next_quest);
          }
        }
        this.setData({
          [key]: list,
          undone_num,
          showPageContent: true,
          noClearList: true
        })
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none',
        })
      }
    })
  },
  // 获取筛选条件内容
  getSelectList() {
    dmNetwork.get(dmNetwork.select_visit_list, {
      dmclient: 'weixinxcx'
    }, (res) => {
      let data = res.data
      if (data && data.errno === '0') {
        console.log(data.data.visit_type);
        let typeObj = data.data.visit_type
        let typeArray = this.data.frequencyArray
        const oldProjectArray = this.data.projectArray
        let projectArray = oldProjectArray.concat(data.data.project_list)
        for (let i in typeObj) {
          typeArray.push({
            val: i,
            txt: typeObj[i]
          })
        }
        this.setData({
          frequencyArray: typeArray,
          projectArray,
          tipList: data.data.leave_reason
        })
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none',
        })
      }
    })
  },
  changeTab(e) {
    let index = Number(e.currentTarget.dataset.index)
    if (this.data.currentTabIndex === index) {
      return
    }
    this.setData({
      currentTabIndex: index
    })
    if (!this.data.firstLodHasVisit) {
      this.getVisitList()
      this.setData({
        firstLodHasVisit: true
      })
    }
  },
  // 点击项目的选择器
  bindProjectChange(e) {
    let index = Number(e.detail.value)
    let key = this.data.currentTabIndex === 0 ? 'noProjectIndex' : 'hasProjectIndex'
    let list = this.data.currentTabIndex === 0 ? 'noVisitList' : 'hasVisitList'
    let page = this.data.currentTabIndex === 0 ? 'no_page_no' : 'has_page_no'
    this.setData({
      [key]: index,
      [list]: [],
      [page]: 1
    })
    this.getVisitList()
  },
  // 点击回访频次的选择器
  bindFrequencyChange(e) {
    let index = Number(e.detail.value)
    let key = this.data.currentTabIndex === 0 ? 'noFrequencyIndex' : 'hasFrequencyIndex'
    let list = this.data.currentTabIndex === 0 ? 'noVisitList' : 'hasVisitList'
    let page = this.data.currentTabIndex === 0 ? 'no_page_no' : 'has_page_no'
    this.setData({
      [key]: index,
      [list]: [],
      [page]: 1
    })
    this.getVisitList()
  },
  handleCloseModal() {
    let modal = this.selectComponent('#bottomModal')
    wx.nextTick(() => {
      modal.hideModal()
    })
  },
  handleLeaveOffice(event) {
    console.log(event);
    const info = event.detail
    this.setData({
      showBottomModal: true,
      currentInfo: info
    })
    const modal = this.selectComponent('#bottomModal')
    wx.nextTick(() => {
      modal.showModal()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentTabIndex === 0) {
      if (this.data.no_next_quest) {
        this.setData({
          no_next_quest: false,
          no_page_no: this.data.no_page_no + 1,
          noClearList: true
        })
        this.getVisitList()
      }
    } else {
      if (this.data.has_next_quest) {
        this.setData({
          has_next_quest: false,
          has_page_no: this.data.has_page_no + 1,
          noClearList: true
        })
        this.getVisitList()
      }
    }
  },
  removeMember(e) {
    const params = e.detail
    dmNetwork.get(dmNetwork.member_remove, params, (res) => {
      let data = res.data
      if (data && data.errno == 0) {
        console.log(data.data.visit_type);
        wx.showToast({
          title: '标记成功',
          icon: 'none',
        })
        this.resetData()
        this.getVisitList()
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none',
        })
      }
    })
  },
  resetData() {
    this.setData({
      currentTabIndex: 0, //当前选中的tab页
      noProjectIndex: 0, //未回访选择项目索引
      noFrequencyIndex: 0, //未回访选择回访频率索引
      hasProjectIndex: 0, //已回访选择项目索引
      hasFrequencyIndex: 0, //已回访选择回访频率索引
      showBottomModal: false,
      currentInfo: {}, // 当前选中人的信息
      no_page_no: 1,
      has_page_no: 1,
      noVisitList: [],
      hasVisitList: [],
      undone_num: 0, // 待访问的数量
      no_next_quest: false, // 未回访是否可翻页
      has_next_quest: false, // 已回访是否可翻页
      // tipList: [], // 原因标签
      firstLodHasVisit: false,
      showPageContent: false
    })
  }
})