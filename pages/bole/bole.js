// pages/bole/bo'le.js
var dmNetwork = require('../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,
    showCheck: false,
    showDialog: false,
    isOld: true,
    uname: '',
    isSigin:false,
    title:'新用户签到',
    uid: '',
    references: '',
    phone: '',
    age:0,
    projectName: '',
    projectInterviewTime:'',
    genderData: [{ value: 1, name: '男' }, { value: 2, name: '女'}],
    genderValue:-1,
    project_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var getcode
    if (options.pid) {
      //APP分享

      getcode = options.pid

    } else {
      var src = decodeURIComponent(options.q)
      var index = src.indexOf('pid=')
      getcode = src.substr(index + 4)
    }    
    console.log(getcode)
    this.setData({
      project_id: getcode
    })
    this.getDetail()
  },
  genderChange(e){
    this.setData({
      genderValue: this.data.genderData[e.detail.value].value
    })
    
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputName(e) {
    this.setData({
      uname: e.detail.value
    })
  },
  inputAge(e){
    this.setData({
      age: e.detail.value
    })
  },
  inputReferences(e) {
    this.setData({
      references: e.detail.value
    })
  },
  getDetail() {
    console.log('aaa',this.data.project_id)
    dmNetwork.post(dmNetwork.detail_url, {
      pid: this.data.project_id
    },
      (res) => {
        console.log(res)
        if (res.data.code == 200) {
       
          if (res.data.data.uid == undefined) {
            this.setData({
              isOld: false,
              title:'新用户签到',
              phone: res.data.data.mobile,
              projectName: res.data.data.projectName,

            })
            
          } else {
            this.setData({
              uname: res.data.data.name,
              uid: res.data.data.uid,
              references: '',
              title: '面试签到',
              phone: res.data.data.mobile,
              projectName: res.data.data.projectName,
              projectInterviewTime: res.data.data.projectInterviewTime,
              isSigin: res.data.data.notCheckin != 0
            })
          }
        } else if (res.data.code == 401) {
          this.setData({
            showLogin: true
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 1500
          })
        }
      }, (err) => {

      })
  },
  onClickSiginIn(e) {
    this.siginin()
  },
  siginin() {
    var url = dmNetwork.sigin_in_url_new
    
    if (this.data.isOld) {
      url = dmNetwork.sigin_in_url_old
    }else{

      if (this.data.phone == '') {
        wx.showToast({
          icon: 'none',
          title: '请输入手机号',
          duration: 1500
        })
        return
      }
      if (this.data.phone.length != 11){
        wx.showToast({
          icon: 'none',
          title: '请输入正确的手机号',
          duration: 1500
        })
        return
      }
      if (this.data.uname == '') {
        wx.showToast({
          icon: 'none',
          title: '请输入姓名',
          duration: 1500
        })
        return
      }
      if (this.data.age == 0 || this.data.age == '') {
        wx.showToast({
          icon: 'none',
          title: '请输入年龄',
          duration: 1500
        })
        return
      }
      if (this.data.genderValue == -1) {
        wx.showToast({
          icon: 'none',
          title: '请选择性别',
          duration: 1500
        })
        return
      }
    }
    dmNetwork.post(url, {
      projectId: this.data.project_id,
      mobile: this.data.phone,
      realName: this.data.uname,
      refereeMobile: this.data.references,
      age: this.data.age,
      gender: this.data.genderValue
    },
      (res) => {
        if (res.data.code == 200) {
          this.setData({
            showDialog:true
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 1500
          })
        }
      }, (err) => {

      })
  },
  closePrompt(e){
    this.setData({
      showDialog: false
    })
    wx.navigateBack({
      delta:1
    })
  },
  phoneLogin(e) {

    this.setData({
      showLogin: false,
      showCheck: true
    })
  },
  closePhoneLogin(e) {
    this.setData({
      showLogin: true,
      showCheck: false
    })
  },
  loginResult(e) {
    console.log(111)
    if (e.detail.result == 0) {
      
      this.setData({
        showLogin: false,
        showCheck: false
      })
      this.getDetail()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})