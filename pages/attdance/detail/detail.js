var dmNetwork = require('../../../utils/network.js')
var team_id;
var project_id;
var user_id;
// scheduling.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasEmptyGrid: false,
    incidentList: [
      0,1,2,3,4,5,6
    ],
    pictures:[
      "https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=0a5eb4c2bb4543a9e116f29e7f7ee1e7/0b7b02087bf40ad1db9eadd55b2c11dfa9ecce8a.jpg",
      "https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=56b3221bbf1bb0519b29bb7a5713b1d1/7af40ad162d9f2d3a8e80ad6a5ec8a136327cc0a.jpg",
      "https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=abc29e3ce9dde711f3df4ba4c686a57e/dc54564e9258d109cd7e878bdd58ccbf6c814d6d.jpg"

    ],
    selectImg: "https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=abc29e3ce9dde711f3df4ba4c686a57e/dc54564e9258d109cd7e878bdd58ccbf6c814d6d.jpg"
  },
  getTodayMsg(e) {
    //console.log(e.currentTarget.dataset.idx+1)

    const get_year = this.data.cur_year;
    const get_month = this.data.cur_month;
    const get_day = e.currentTarget.dataset.idx + 1;
    console.log(get_year + "|" + get_month + "|" + get_day)
    this.setData({
      cur_date: get_day
    });
  }, 
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        bottomHeight: res.windowHeight - 420
      });
    } catch (e) {
      console.log(e);
    }
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();   //返回一个月总天数 

  }, getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay(); //返回1号是星期几
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
    let endEmpty = [];
    for (let i = len; i < 42; i++) {
      endEmpty.push(i + 1 - len);
    }
    this.setData({
      days,
      endEmpty
    });

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
    this.getSystemInfo();
    this.setData({
      cur_year,  //年
      cur_month, //月
      cur_date,  //天
      weeks_ch   //星期
    })
    project_id = options.project_id
    console.log(project_id)
    team_id = options.team_id;
    this.getMonthStatus(cur_year + '-'+cur_month)
  },
  getMonthStatus:function(date){
    var rDate = {
      team_id: team_id,
      project_id: project_id,
      month: date
    }
    console.log(rDate)
    dmNetwork.get(dmNetwork.attdanceMonthStatus,rDate,(res)=>{
      console.log(res)
    },(error)=>{

    })
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

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
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

})