// pages/theform/editreportinfo/editreportinfo.js
var dmNetwork = require('../../../utils/network.js')
var dmUtil = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singlechange: 'singlechange',
    type: 'string',
    confirmType: 'done',
    options: {},
    desc: '',
    items: [],
    showError: false,
    repeat_submit: 0,
    showFeedback: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var options = dmUtil.getQueryString()
    this.setData({ options: options })
    this.getFormItemList()
  },
  onSingleChange: function (ev) {
    this.data.items[ev.currentTarget.dataset.index].info.value = ev.detail.value;
  },
  showFeedback(e) {
    this.setData({
      showFeedback: true
    })
  },
  onDateChange: function (ev) {
    this.data.items[ev.currentTarget.dataset.index].info.value = ev.detail.value;
  },
  onTextareaChange: function (ev) {
    this.data.items[ev.currentTarget.dataset.index].info.value = ev.detail.value;
  },
  onSelectChange: function (ev) {
    console.log(ev.detail.value)
    this.data.items[ev.currentTarget.dataset.index].info.value = ev.detail.value;

  },
  onDateConfrim: function () {
    var checkSwitch = this.checkData();
    var that = this
    if (!checkSwitch) return;
    var data = this.data.options;
    data.info = JSON.stringify(this.data.items)
    console.log(data);
    // return
    dmNetwork.post(
      dmNetwork.reportform,
      data,
      (res) => {
        if (res.data.errno == 0) {
          if (that.data.repeat_submit == 1) {
            wx.showModal({
              title: '',
              cancelText: '继续填写',
              confirmText: '完成',
              content: '提交成功',
              success: function (res) {
                console.log('11111111112')
                wx.setStorageSync("needRefresh", 1)
                if (res.confirm) {
                  wx.navigateBack({ url: '../../minework/minework' })
                } else if (res.cancel) {
                  console.log('aaaaaaaa')
                  wx.redirectTo({
                    url: '../../theform/editreportinfo/editreportinfo?team_id=' + that.data.options.team_id + '&project_id=' + that.data.options.project_id + '&form_id=' + that.data.options.form_id
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              success: function () {
                wx.setStorageSync("needRefresh", 1)
                wx.navigateBack({
                  delta: 1
                })

              }
            })
          }
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
          })

        }
      },
      (res) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
        })
      }
    )
  },
  onLocation: function (ev) {
    this.data.items[ev.currentTarget.dataset.index].info.value = ev.detail.value;
  },
  onUploadimg: function (ev) {
    console.log('img', ev)
    this.data.items[ev.currentTarget.dataset.index].info.value = ev.detail.value;
  },
  getFormItemList: function () {
    var data = this.data.options;
    dmNetwork.post(
      dmNetwork.formitemlist,
      data,
      (res) => {
        if (res.data.errno == 0) {
          //this.dataShow = true

          res.data.data.format_info.forEach((obj) => {
            if (obj.type === 'Imageview') {
              return obj.info.value = []
            }
            if (obj.type === 'Location') {
              return obj.info.value.name = ''
            }
            wx.setNavigationBarTitle({
              title: res.data.data.title,
            })
          })
          this.setData({
            items: res.data.data.format_info,
            desc: res.data.data.desc,
            repeat_submit: res.data.data.repeat_submit
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
          })

        }
      },
      () => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
        })
      })
  },
  checkData: function () {
    var checkSwitch = true;
    for (var i = 0; i < this.data.items.length; i++) {
      var obj = this.data.items[i]
      if (obj.info.required == 1) {
        // console.log(obj)
        // console.log(obj.info.check_guide != undefined )
        // console.log(obj.info.check_guide.min)
        // console.log(obj.info.value.length < obj.info.check_guide.min)
        if (obj.type === 'Imageview' && obj.info.check_guide != undefined && obj.info.value.length < obj.info.check_guide.min) {
          wx.showToast({
            title: obj.info.value.length == 0 ? obj.info.title + '为必填项' : '请至少上传' + obj.info.check_guide.min + '张图片',
            icon: 'none',
          })
          return false;
        }
        if (obj.type === 'Location' && !obj.info.value.lat) {
          wx.showToast({
            title: obj.info.title + '为必填项',
            icon: 'none',
          })
          return false;
        }
        if (!obj.info.value) {
          wx.showToast({
            title: obj.info.title + '为必填项',
            icon: 'none',
          })
          return false;
        }
      }
      if (obj.type === 'Imageview' && obj.info.value.length > 20) {
        wx.showToast({
          title: obj.info.title + '上传图片不允许超过20张',
          icon: 'none',
        })
        return false;
      }
    }
    return checkSwitch;
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

  // },
})