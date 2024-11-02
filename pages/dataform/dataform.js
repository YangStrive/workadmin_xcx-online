// dataform.js
var fetch = require('../../utils/fetch.js'); // 引入外部包
var config = require('../../config.js')
var dmNetwork = require('../../utils/network.js')

// 获取应用实例
let app = getApp()
var qqmapsdk;
var team_id;
var project_id;
var attendance_id;
var newAttId
var time_id;
var task_id;
var schedule_id;
var form_data_id;

var cross;
var insureInfo
var cross_attend;
var task_id_yesterday;
var model;
var name = ''
var idCard = ''

var eInfo = {};
var attendanceData;

var pageType;
var errorReason = ''

var pageCount = 1
//数据上报数据
var resultData = [];
var mac_address= ''

Page({

  /**
   * 页面的初始数据
   */
  data: {

    extraInfo: {},
    address: "",
    defaultName: '',
    sourceType2: ['album', 'camera'],
    dateValue: '2017-08-02',
    startTime: '',
    endTime: '',
    latitude: '',
    longitude: '',
    isShowInsure: false,
    isShowInsureSuccess: false,
    isShowNavigation: false,
    files: [],
    resultImages: [
      'http://cdn.doumistatic.com/70,8f35c1ac0c4043.png',
      'http://cdn.doumistatic.com/73,8f35c896c5d8ae.png',
      'http://cdn.doumistatic.com/71,8f35cbdf62bf1b.png'
    ],
    resultText: "",
    resultInfo: "",
    positionInfo: "222",
    result_statu: 0,
    isShowResult: false,
    formDate: [],
    isShowError: false,
    name: '',
    productInfo: [],
    location_time: 0,
    showFeedback: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    errorReason = ''
    var that = this
    this.getServerTime()

    wx.getSystemInfo({
      success: function (res) {
        model = res.model
      }
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
    pageType = options.type
    project_id = options.project_id
    team_id = options.team_id;
    if (options.count) {
      pageCount = options.count
    }

    this.checkNeedInsure()
    //考勤进入
    if (options.type == 1) {
      wx.getStorage({
        key: 'a_extra_info',
        success: res => {
          console.log(res.data)
          console.log(res.data.require_field == undefined)
          if (res.data.require_field == undefined) {
            console.log(res.data.require_field_yesterday)
            that.initResult(res.data.require_field_yesterday)
          } else {
            that.initResult(res.data.require_field)
          }


          this.setData({
            extraInfo: res.data
          })
        },
      })
      task_id = options.task_id;
      attendance_id = options.attendance_id;

      time_id = options.time_id
      schedule_id = options.schedule_id
      cross_attend = options.cross_attend
      form_data_id = options.form_data_id
      cross = options.cross
      task_id_yesterday = options.task_id_yesterday
      // type=1&title=考勤信息填写&team_id=26&project_id=3431&mac_address=0e:05:88:05:4f:1c&attendance_id=0&time_id=4473&task_id=39392&schedule_id=0&cross=0&form_data_id=0&cross_attend=0&task_id_yesterday=0&count=1
      mac_address = options.mac_address
    }
    //位置监控进入
    if (options.type == 2) {
      dmNetwork.get(dmNetwork.commitDataSetting, {
        team_id: options.team_id,
        project_id: options.project_id
      }, (res) => {

        this.initResult(res.data.data.setting_data.require_field)
        this.setData({
          extraInfo: res.data.data.setting_data
        })
      }, (err) => {
        //网络异常处理
      })

    }
  },
  initResult(require_field) {

    resultData.splice(0, resultData.length)
    for (var i = 0; i < require_field.length; i++) {
      var item = {}
      item.id = require_field[i].id
      item.type = require_field[i].type
      item.name = require_field[i].info.title
      item.value = require_field[i].info.value
      item.required = require_field[i].info.required

      if (item.type == 'Imageview' && require_field[i].info.check_guide != null) {
        item.value.thumb_url = []
        item.value.url = []
        item.min = require_field[i].info.check_guide.min
        item.max = require_field[i].info.check_guide.max
      }
      resultData.push(item)
    }
  },
  checkNeedInsure: function () {
    dmNetwork.get(dmNetwork.checkNeedInsure, {
        team_id: team_id,
        project_id: project_id,
        type: pageType
      },
      (res) => {
        if (res.data.errno == 0) {
          if (res.data.data[0].status == 1) {
            insureInfo = res.data.data[0].info
            this.setData({
              isShowInsure: true,
              defaultName: insureInfo.name
            })

          } else {
            this.checkShowNavigation()
            this.setData({
              isShowInsure: false,
            })
          }
        }
      },
      (error) => {
        this.checkShowNavigation()
      })
  },
  getInsure: function () {
    var that = this
    if (name == '') {
      name = this.data.defaultName
    }
    if (name == '') {
      wx.showToast({
        title: '请输入姓名',
        mask: true,
        icon: 'none',
        duration: 1500
      })

      return
    }
    if (idCard == '') {
      wx.showToast({
        title: '请输入身份证号码',
        mask: true,
        icon: 'none',
        duration: 1500
      })

      return
    }
    var that = this;
    dmNetwork.get(dmNetwork.getInsure, {
        team_id: team_id,
        project_id: project_id,
        info: {
          id_number: idCard,
          name: name,
          mobile: insureInfo.mobile
        }
      },
      (res) => {

        if (res.data.errno == "0") {
          that.setData({
            isShowInsure: false,
            isShowInsureSuccess: true,
          })

          setTimeout(
            function () {
              that.setData({
                isShowInsure: false,
                isShowInsureSuccess: false,
              })
              that.checkShowNavigation()
            }, 2000
          )
        } else {
          wx.showToast({
            title: res.data.errmsg,
            mask: true,
            icon: 'none',
            duration: 1500
          })
        }
      }, (error) => {

      })
  },

  bindIdCard: function (e) {
    idCard = e.detail.value
  },
  bindName: function (e) {
    name = e.detail.value
  },

  checkShowNavigation: function () {
    var isShowNavigation = wx.getStorageSync("isShowNavigation");
    if (isShowNavigation && isShowNavigation == 1) {

    } else {
      this.setData({
        isShowNavigation: true,
      })
      wx.setStorageSync("isShowNavigation", 1);
    }
  },
  hideNavigation: function () {
    this.setData({
      isShowNavigation: false,
    })
  },
  onSingleChange: function (ev) {
    resultData[ev.currentTarget.dataset.index].value = ev.detail.value;
  },
  onDateChange: function (ev) {

    resultData[ev.currentTarget.dataset.index].value = ev.detail.value;
  },
  onTextareaChange: function (ev) {

    resultData[ev.currentTarget.dataset.index].value = ev.detail.value;
  },
  onSelectChange: function (ev) {

    resultData[ev.currentTarget.dataset.index].value = ev.detail.value;
  },
  onDateConfrim: function () {
    var checkSwitch = this.checkData();
    console.log(resultData)
    if (!checkSwitch) return;
    var data = this.data.options;
    //data.info = resultData

    data.info = resultData;
    dmNetwork.post(dmNetwork.reportform, data, (res) => {
      if (res.data.errno == 0) {

      }
    })
  },
  onUploadimg: function (ev) {
    resultData[ev.currentTarget.dataset.index].value.url = []
    resultData[ev.currentTarget.dataset.index].value.thumb_url = []
    for (var i = 0; i < ev.detail.value.length; i++) {
      resultData[ev.currentTarget.dataset.index].value.url.push(ev.detail.value[i].url)
      resultData[ev.currentTarget.dataset.index].value.thumb_url.push(ev.detail.value[i].thumb_url)
    }
  },

  getServerTime() {
    dmNetwork.getInBackground(dmNetwork.servertime, {},
      (res) => {
        var time = res.data.data.time
        if (time == undefined) {
          time == 0
        }

        this.setData({
          location_time: time
        })
      }, (err) => {

      }
    )
  },
  onLocation: function (ev) {
    var that = this


    if (ev.detail.value.status == "0") {

      wx.showToast({
        title: '超出地点微调范围',
        icon: "none",
        duration: 1500
      })
      return
    } else if (ev.detail.value.status == "error") {
      if (ev.detail.value.errormsg.status == 373) {
        wx.showToast({
          title: '超出地点微调范围',
          icon: "none",
          duration: 1500
        })
        return
      }
    }
    var res = ev.detail.value;
    var longitudeCase = res.lng
    var latitudeCase = res.lat
    var addressCase = res.addr
    var nameCase = res.addr_name
    resultData[ev.currentTarget.dataset.index].value = ev.detail.value;
    if (pageType == 1) {
      dmNetwork.get(dmNetwork.checkAddress, {
        team_id: team_id,
        project_id: project_id,
        coordinate: res.lng + ',' + res.lat,
        task_id: task_id
      }, (res) => {

        if (res.data.data.valid == 0) {
          that.setData({
            isShowError: true
          })
        } else {
          that.setData({
            isShowError: false
          })
        }
      }, (err) => {

      })
    }


  },


  getLocationAddress: function () {
    // 实例化API核心类
    var that = this
    that.setData({
      address: "正在定位..."
    })
    wx.showToast({
      title: '数据加载中...',
      icon: 'loading',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // 调用接口
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        //根据经纬度获取详细地址
        fetch.reverseGeocoder(res.latitude, res.longitude, (res) => {
          console.log(res.data)
          wx.hideToast()
          if (res.status == 0) {
            that.setData({
              address: res.result.address,
              name: res.result.formatted_addresses.recommend
            })
          }
        })
      },
      fail: function () {
        wx.hideToast()
        // fail
      }
    })
  },
  submit: function () {

    if (this.checkResultData() != 1) {
      return
    }
    var that = this

    if (pageType == 1) {
      var coordinate = that.data.latitude + ',' + that.data.longitude
      let submitDate = {
        team_id: team_id,
        project_id: project_id,
        task_id: task_id,
        time_id: time_id,
        attendance_id: attendance_id,
        form_data: resultData,
        form_data_id: form_data_id,
        schedule_id: schedule_id,
        cross: cross,
        cross_attend: cross_attend,
        task_id_yesterday: task_id_yesterday,
        coordinate: coordinate,
        phone_model: model,
        device_code: '',
        location_time: this.data.location_time,
        mac_address:mac_address
      }

      var url = dmNetwork.kqadd

      // if (pageCount == undefined || pageCount == 1) {
      //   url = dmNetwork.kqadd
      // } else {
      //   url = dmNetwork.attendance_update
      // }
      if (attendance_id > 0 && attendance_id != "undefined") {
        url = dmNetwork.attendance_update
      } else {
        url = dmNetwork.kqadd
      }
      console.log(attendance_id)

      dmNetwork.get(url, submitDate, (res) => {
        console.log(res.data)
        if (res.data.errno == 0) {
          console.log(res.data.data)

          var statu = 0
          console.log(res.data.data.attendance_id)
          if (res.data.data.attendance_id != undefined) {
            attendance_id = res.data.data.attendance_id
          }
          if (res.data.data.status == "打卡成功，辛苦了！") {
            statu = 0
          } else if (res.data.data.status == "地点异常") {
            statu = 1
          } else {
            statu = 2
          }
          this.setData({
            isShowResult: true,
            result_statu: statu,
            resultText: res.data.data.status,
            resultInfo: res.data.data.time_tip,
            positionInfo: res.data.data.position_tip
          })

          wx.setStorageSync("needRefresh", 1)

        } else {
          wx.showToast({
            title: res.data.errmsg,
            mask: true,
            icon: 'none',
            duration: 1500
          })
        }
      }, (err) => {
        //网络异常处理
      })
    } else {
      that.commitData()
    }
  },
  back: function () {
    // debugger
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let times = 0
    let we2000Times = false
    let date = new Date().toLocaleDateString()
    try {
      var res = wx.getStorageSync('we2000')

      if (!res) {
        times = 1
        we2000Times = true
      } else {
        let data = JSON.parse(res)
        if (data.date == new Date().toLocaleDateString()) {
          if (data.times < 2) {
            we2000Times = true
          }
          times = data.times + 1
        } else {
          we2000Times = true
          times = 1
        }
      }
    } catch (e) {
      we2000Times = true
      times = 1
    }

    if (pageCount == 1) {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        showWe2000Flag: true,
        inCheckAndShowWe: we2000Times
      })
      if (prevPage.data.webank_tips) {
        // wx.setStorage({
        //   key: "we2000",
        //   data: JSON.stringify({
        //     date: date,
        //     times: prevPage.data.times ==1 ? 1 : times
        //   })
        // })
      }
      wx.navigateBack({
        delta: 1
      })
    } else {
      let prevPage = pages[pages.length - 3];
      prevPage.setData({
        showWe2000Flag: true,
        inCheckAndShowWe: we2000Times
      })
      if (prevPage.data.webank_tips) {
        // wx.setStorage({
        //   key: "we2000",
        //   data: JSON.stringify({
        //     date: date,
        //     times: prevPage.data.times ==1 ? 1 : times
        //   })
        // })
      }
      wx.navigateBack({
        delta: 2
      })
    }


  },
  confirmAtten: function () {
    var that = this
    if (this.data.result_statu == 0) {
      this.back()
    } else {
      dmNetwork.get(dmNetwork.abnormal_reason, {
        team_id: team_id,
        project_id: project_id,
        reason: errorReason,
        attendance_id: attendance_id
      }, (res) => {
        if (res.data.errno == 0) {
          wx.showToast({
            title: '已发送',
            icon: 'success',
            duration: 1500,
          })

          setTimeout(function () {
            that.back()
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 1500
          })
        }
      }, (error) => {

      })
    }
  },
  commitData: function () {
    var that = this
    var subData = {
      team_id: team_id,
      project_id: project_id,
      phone_model: model,
      device_code: '',
      watermark: 1,
      form_data: resultData,
      location_time: this.data.location_time,
      require_field_formid: that.data.extraInfo.require_field_formid
    }
    dmNetwork.get(dmNetwork.commitData, subData, (res) => {
      if (res.data.errno == 0) {
        wx.showToast({
          title: '上报位置成功',
          icon: 'none'
        })
        wx.setStorageSync("needRefresh", 1)
        setTimeout(() => {

          wx.navigateBack({
            delta: pageCount
          })
        }, 300)
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    }, (err) => {
      //网络异常处理
    })
  },
  checkResultData: function () {
    var that = this
    console.log(resultData)
    for (var i = 0; i < resultData.length; i++) {


      if (resultData[i].type != "Imageview" && resultData[i].type != "Location") {

        if (resultData[i].required == 1 && resultData[i].value == '') {
          var pStr = resultData[i].name + "为必填项"

          wx.showToast({
            title: pStr,
            mask: true,
            duration: 1500,
            icon: 'none'
          })
          return -1
        }
      } else if (resultData[i].type == "Imageview") {
        console.log(resultData[i])
        if (resultData[i].required == 1) {
          if (resultData[i].value.url.length == 0) {
            var pStr = resultData[i].name + "为必填项"
            wx.showToast({
              title: pStr,
              icon: 'none',
              mask: true,
              duration: 1500
            })
            return -1
          } else if (resultData[i].value.url.length > 0 && resultData[i].min != '' && resultData[i].value.url.length < resultData[i].min) {
            var pStr = '请至少上传' + resultData[i].min + '张图片'
            wx.showToast({
              title: pStr,
              icon: 'none',
              mask: true,
              duration: 1500
            })
            return -1
          } else if (resultData[i].value.url.length > 20) {
            var pStr = '最多上传' + 20 + '张图片'
            wx.showToast({
              title: pStr,
              icon: 'none',
              mask: true,
              duration: 1500
            })
            return -1
          }

        }
      } else if (resultData[i].type == "Location") {
        var pStr = resultData[i].name + "为必填项"
        if (resultData[i].required == 1 && resultData[i].value.lat == '') {
          wx.showToast({
            title: pStr,
            icon: 'none',
            mask: true,
            duration: 1500
          })
          return -1
        }
      }
    }
    return 1
  },

  chooseImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          filePath: res.tempFilePaths[0]
        });

        for (var i = 0, h = res.tempFilePaths.length; i < h; i++) {
          dmNetwork.upload(res.tempFilePaths[i], 'uploadfile_ant', {},
            function (res) {
              //上传成功
              for (var i = 0; i < res.length; i++) {
                resultData[index].value.thumb_url.push(res[i].thumb_url)
                resultData[index].value.url.push(res[i].url)
              }

            },
            function (res) {
              //上传失败
              console.log(res)
            })
        }
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  normalPickerBindchange: function (e) {

  },
  //拒绝授权后，再次弹框提醒用户
  getLocationSetting: function () {
    var that = this
    wx.getSetting({
      success: (res) => {
        // console.log(res);
        // console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            confirmText: '知道了',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      //再次授权，调用getLocationt的API
                      that.getLocationAddress();

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1500
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
        }
      }
    })

  },
  textErrorReason: function (e) {
    errorReason = e.detail.value
    console.log(errorReason)
  },
  showFeedback(e) {
    this.setData({
      showFeedback: true
    })
  },
  onDeleteImg: function (ev) {
    var imgIndex = ev.currentTarget.dataset.imgindex;
    this.data.files.splice(imgIndex, 1)
    this.data.upImg.splice(imgIndex, 1)
    this.setData({
      files: this.data.files,
      upImg: this.data.upImg
    });
    this.triggerEvent(this.data.customEvent, {
      value: this.data.upImg
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


  onTouchStart: function () {

  }
})