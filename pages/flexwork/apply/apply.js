var dmNetwork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowTag: false,
    hasEmptyGrid: false,
    isShowApplySuccess: false,
    selectIndex: [],
    selectIndexShow: [],
    thisMonthCount: 30,

  },
  getThisMonthDays(year, month) {
    var count = new Date(year, month, 0).getDate()
    this.setData({
      thisMonthCount: count
    })
    return count   //返回一个月总天数 

  }, getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay(); //返回1号是星期几
  },
  handleCalendar(e) {

    const handle = e.currentTarget.dataset.handle;  //得到 data-handle 值
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth); //重新计算天数
      this.calculateEmptyGrids(newYear, newMonth); //重新计算空格
      var count = new Date(newYear, newMonth, 0).getDate()
      var applyIndex = []
      var needCount = []//-1无 0已满 > 0 未满
      for (var i = 0; i < count; i++) {
        needCount.push(-1)
        applyIndex.push(0)
      }
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        thisMonthCount: count,
        applyIndex: applyIndex,
        needCount: needCount,
      })
      
      this.getWorkTimes(newYear + '-' + newMonth)
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      var count = new Date(newYear, newMonth, 0).getDate()
      var applyIndex = []
      var needCount = []//-1无 0已满 > 0 未满
      for (var i = 0; i < count; i++) {
        needCount.push(-1)
        applyIndex.push(0)
      }
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        thisMonthCount: count,
        applyIndex: applyIndex,
        needCount: needCount,
      })
      // this.initData()
      this.getWorkTimes(newYear + '-' + newMonth)
    }
    var add = this.data.selectIndex
    var selectIndexShow = []
    for (var i = 0; i < this.data.thisMonthCount; i++) {
      var isSelect = false
      for (var j = 0; j < add.length; j++) {

        if (add[j] == this.data.cur_year + '-' + this.data.cur_month + '-' + (i + 1)) {
          isSelect = true
        }
        
      }
      selectIndexShow.push(isSelect)
    }


    this.setData({
      selectIndexShow: selectIndexShow
    })
  },
  
  
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month); //返回1号是星期几
    const lastMonthDays = this.getThisMonthDays(year, month - 1);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(lastMonthDays - firstDayOfWeek + i + 1);   //前面加空天数
      }

      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month); //返回一个月总天数 

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    const len = days.length + firstDayOfWeek;
    let endEmpty = []; for (let i = len; i < 42; i++) {
      endEmpty.push(i + 1 - len);
    }
    this.setData({
      days,
      endEmpty
    });

  },
  apply(e) {

    if (this.data.selectIndex.length == 0) {

    } else {

      var postData = {
        project_id: this.data.project_id,
        team_id: this.data.team_id,
        task_id: this.data.task_id,
        schedule_id: this.data.schedule_id,
        position_id: this.data.position_id,
        autonomy_task_id: this.data.atask_id,
        date_schedule: JSON.stringify(this.data.selectIndex),
        checkparticapant: 0
      }

      dmNetwork.post(dmNetwork.flex_work_apply,postData,
      (res)=>{
        if (res.data.errno == 0) {
        this.getWorkTimes(this.data.cur_year + '-' + this.data.cur_month)
        wx.setStorageSync('isShowTip', 1)
        this.setData({
          isShowApplySuccess:true,
          selectIndexShow:[],
          selectIndex:[]
        })
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },
      (err)=>{
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      })
    }
  },
  hideApplySuccessView(e){
    this.getWorkTimes(this.data.cur_year + '-' + this.data.cur_month)
    this.setData({ isShowApplySuccess: false })
  },
  checkWork(e){
    this.setData({ isShowApplySuccess: false })
    wx.navigateTo({
      url: '../../attdance/record/record?team_id=' + this.data.team_id + '&project_id=' + this.data.project_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_date = date.getDate();
    const weeks_ch = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    var team_id = options.team_id
    var atask_id = options.atask_id
    var project_id = options.project_id
    wx.setNavigationBarTitle({
      title: options.title,
    })
    var applyIndex = []
    var needCount = []//-1无 0已满 > 0 未满
    var count = new Date(cur_year, cur_month, 0).getDate()
    for (var i = 0; i < count; i++) {
      needCount.push(-1)
      applyIndex.push(0)
    }
   
    this.setData({
      cur_year,  //年
      cur_month, //月
      cur_date,  //天
      weeks_ch,   //星期
      team_id: team_id,
      atask_id: atask_id,
      project_id: project_id,
      task_id: options.task_id,
      position_id: options.position_id,
      schedule_id: options.schedule_id,
      autonomy_publish_id: options.autonomy_publish_id,
      applyIndex: applyIndex,
      needCount: needCount,
    })

    this.getWorkTimes(cur_year + '-' + cur_month)
  },
  
  selectWork(e) {
    var add = this.data.selectIndex
    var idx = e.currentTarget.dataset.idx;
    if (this.data.needCount[idx] == 0 || this.data.applyIndex[idx] == 1 || this.data.needCount[idx] == -1) {
      return
    }
    var sdate = this.data.cur_year + '-' + this.data.cur_month + '-' + (idx + 1)
    if (add.indexOf(sdate) < 0) {
      add.push(sdate)
    } else {
      add.splice(add.indexOf(sdate), 1)
    }

    var selectIndexShow = []
    for (var i = 0; i < this.data.thisMonthCount; i++) {
      var isSelect = false
      for (var j = 0; j < add.length; j++) {
        console.log()
        if (add[j] == this.data.cur_year + '-' + this.data.cur_month + '-' + (i+1)){
          isSelect = true
        }
      }
      selectIndexShow.push(isSelect)
    }
   

    this.setData({
      selectIndex: add,
      selectIndexShow: selectIndexShow
    })
  },

  getWorkTimes(date) {
    dmNetwork.get(dmNetwork.flex_work_times, {
      team_id: this.data.team_id,
      autonomy_task_id: this.data.atask_id,
      project_id: this.data.project_id,
      choose_month: date,
      autonomy_publish_id: this.data.autonomy_publish_id
    }, (res) => {
      var timeList = res.data.data
      if (timeList.length > 0) {
        
        for (var i = 0; i < timeList.length; i++) {
          var dateStrs = timeList[i].date.split('-')
          var count = parseInt(dateStrs[2]) - 1
          this.data.applyIndex[count] = timeList[i].is_apply
          this.data.needCount[count] = parseInt(timeList[i].people_num) - parseInt(timeList[i].apply_num)
        }
        
        this.setData({
          applyIndex: this.data.applyIndex,
          needCount: this.data.needCount,
          timeList: timeList
        })
      } else {
        var applyIndex = []
        var needCount = []//-1无 0已满 > 0 未满
        for (var i = 0; i < this.data.thisMonthCount; i++) {
          needCount.push(-1)
          applyIndex.push(0)
        }
        this.setData({
          timeList: [],
          applyIndex: applyIndex,
          needCount: needCount,
        })
      }
    }, (err) => {

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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})