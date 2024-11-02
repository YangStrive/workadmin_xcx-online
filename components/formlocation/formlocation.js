var fetch = require('../../utils/fetch.js'); // 引入外部包
Page({})
Component({
  ready: function () {
    var locPerSwitch = wx.getStorageSync('firstInTo');

    if (locPerSwitch) {
      this.getLocationSetting()
    } else {
      wx.setStorageSync('firstInTo', true)
    }
    if (this.data.autoLocation) {
      this.againLocation()
    }
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: String,
    tip: String,
    placeholder: {
      value: '请输入',
      type: String,
    },
    type: String,
    required: Number,
    customEvent: String,
    clickFeedback: String,
    showPlaceholder: {
      type: Boolean,
      value: false
    },
    againOrAdjust: {
      value: true,
      type: Boolean
    },
    autoLocation: {
      value: true,
      type: Boolean
    },
    showError: {
      value: false,
      type: Boolean
    },
    distance: { value: 1000, type: Number },

  },
  data: {
    // 这里是一些组件内部数据
    addr_name: ' ',
    lat: '',
    lng: '',
    addr: '',
    locationActive: true,
    locationActiveTxt: '定位中...'
  },
  methods: {
    againLocation: function (e) {
      var that = this;
      that.setData({
        locationActiveTxt: '定位中...',
        locationActive: true,
      })
      wx.showLoading({ title: '定位中' })
      this.accurateLocation(0, 0, 0, (la, lo) => {
        console.log("212121")
        that.setData({
          lat: la,
          lng: lo,
        })
        //根据经纬度获取详细地址
        fetch.reverseGeocoder(la, lo, (res) => {
          wx.hideLoading()
      
          if (res.status == 0) {
            that.setData({
              addr_name: res.result.formatted_addresses.recommend,
              addr: res.result.address,
              locationActive: false,
            })
            that.triggerEvent(that.data.customEvent, { value: { addr_name: that.data.addr_name, lat: that.data.lat, lng: that.data.lng, addr: that.data.addr, } })
          }
        })
      }, (err) => {
    
        wx.hideLoading()
        that.setData({
          locationActiveTxt: '定位失败',
        })
        that.getLocationSetting()
      })


      // wx.getLocation({
      //   type: 'gcj02',
      //   success: function (res) {
      //     // 调用接口

      //   },
      //   fail: function () {
      //     wx.hideLoading()

      //   }
      // })
    },
    onClickFeedBack(e) {
      this.triggerEvent(this.data.clickFeedback, {})
    },
    accurateLocation(la, lo, count, success, fail) {
    
      var that = this
      wx.getLocation({
        type: 'gcj02',
        success: function (resLocation) {

          success(resLocation.latitude, resLocation.longitude)
        },
        fail: function (e) {
         
          fail()
        },
        complete:function(e){
          console.log(e)
        }
      })
      // wx.getLocation({
      //   type: 'gcj02',
      //   success: function (resLocation) {

      //     if (0 != la) {
      //       if (count < 3) {
      //         count++

      //         fetch.calculateDistanceFT({ latitude: la, longitude: lo },
      //           [
      //             { latitude: resLocation.latitude, longitude: resLocation.longitude }
      //           ],
      //           (res) => {

      //             if (res.status == 0 && res.result.elements[0].distance != undefined && res.result.elements[0].distance < 50) {
      //               console.log('success')
      //               success(la, lo)
      //             } else {
      //               that.accurateLocation(resLocation.latitude, resLocation.longitude, count, success, fail)
      //             }
      //           },
      //           (err) => { 
      //             that.accurateLocation(la, lo, count, success, fail)
      //           }
      //         )
      //       } else {
      //         fail()
      //       }

      //     }else{
      //       that.accurateLocation(resLocation.latitude, resLocation.longitude, count, success, fail)
      //     }
      //   },
      //   fail:function(err){
      //     that.accurateLocation(la, lo, count, success, fail)
      //   }
      // })

    },
    adjustLocation: function () {
      var that = this;

      wx.chooseLocation({
        success: function (data) {
          fetch.calculateDistance(
            [
              { latitude: that.data.lat, longitude: that.data.lng },
              { latitude: data.latitude, longitude: data.longitude }
            ],
            (res) => {
              if (res.status == 0) {
                var Lcswitch = false;
                if (res.result.elements[1]) {
                  Lcswitch = res.result.elements[1].distance ? true : false
                }

                if (Lcswitch && res.result.elements[1].distance > that.data.distance) {
                  that.triggerEvent(that.data.customEvent, { value: { status: '0', errormsg: res } })
                }
                else {
                  that.setData({ addr_name: data.name, addr: data.address, locationActive: false, lng: data.longitude, lat: data.latitude })
                  that.triggerEvent(that.data.customEvent, { value: { addr_name: that.data.addr_name, lat: that.data.lat, lng: that.data.lng, addr: that.data.addr, status: 'success' } })
                }
              }
            },
            (res) => {
              that.triggerEvent(that.data.customEvent, { value: { status: 'error', errormsg: res } })
            },
          )
        },
        fail: function (res) {
          if (res.errMsg == 'chooseLocation:fail cancel') return;
          that.getLocationSetting()
        }
      })
    },

    getLocationSetting: function () {
      var that = this
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            wx.showModal({
              title: '您已拒绝授权',
              showCancel: false,
              content: '如果想使用该功能，点击确定-开启位置获取',
              success: function (res) {
                if (res.cancel) {
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function (data) {

                      if (data.authSetting["scope.userLocation"] == true) {
                        //再次授权，调用getLocationt的API
                        that.againLocation();

                      } else {
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
    },
  }
})