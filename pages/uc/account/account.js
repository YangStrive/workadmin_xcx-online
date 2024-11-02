var dmNetwork = require('../../../utils/network.js')

var app = getApp()
Page({
  data: {
    mobile: '',
    real_name_auth: '',
    real_name: '',
    is_show_protocol: false,
    showVisit: false,
    undone_number: 0,
    is_real_auth: 0, //是否认证
    is_show_auth: 0, //是否显示认证
    isOcr:1,//是否需要ocr认证
    isShowLivingCertification:0,//是否显示活体认证
    is_bind_bank_card:0,//是否绑定银行卡
    login_laixinshui_sign_token:false,//进行测试跳转到来薪水签约落地页面的token
    is_show_driver_license_info:false//是否显示驾照
  },

  onLoad() {
    
  },

  onShow: function () {
    this.getuserinfofromsaas()
    this.getWallet()
    this.getProtocol()
    this.getVisitInfo()
    
    var uc_info = wx.getStorageSync("uc_info");
    if (uc_info != undefined && uc_info != '') {
      this.setData({
        real_name: uc_info.uc_name,
        logo_thumb_url: uc_info.uc_logo_thumb_url
      })
    }

  },

  getProtocol: function () {
    var that = this;
    dmNetwork.get(dmNetwork.protocol_list, {}, (res) => {
      if (res.data.errno == 0) {
        if (res.data.data.length == 0) {
          that.setData({
            is_show_protocol: false
          })
        } else {
          that.setData({
            is_show_protocol: true
          })
        }
      }
    })
  },

  //获取钱包余额
  getWallet: function () {
    var that = this;
    dmNetwork.get(dmNetwork.getwallet, '', (res) => {
      if (res.data.errno == 0) {
        that.setData({
          balance: res.data.data.total
        })
      } else {}
    })
  },

  bindContact(e) {
    console.log(e)
    wx.chooseContact({

    })
  },
  getVisitInfo() {
    // let that = this
    dmNetwork.get(dmNetwork.get_visit_count, {
      dmclient: 'weixinxcx'
    }, (res) => {
      //console.log('res===========');
      //console.log(res);
      if (res.data.errno == 0) {
        this.setData({
          showVisit: res.data.data.show_status,
          undone_number: res.data.data.undone_number
        })
      }
    })
  },
  //获取用户信息
  getuserinfofromsaas: function () {
    var that = this

    dmNetwork.get(dmNetwork.getuserinfo, {}, (res) => {
      //console.log("个人信息" + JSON.stringify(res))
      if (res.data.errno == 0) {
        this.setData({
          real_name_auth: res.data.data.real_name_auth,
          real_name: res.data.data.real_name,
          mobile: res.data.data.mobile,
          is_real_auth: res.data.data.is_real_auth,
          isOcr:res.data.data.is_ocr,
          is_show_auth: res.data.data.is_show_auth,
          isShowLivingCertification:res.data.data.is_faceliveness,
          is_bind_bank_card:res.data.data.is_bind_bank_card,
          is_show_driver_license_info:res.data.data.is_show_driver_license_info,
          login_laixinshui_sign_token: res.data.data.login_laixinshui_sign_token,
        })
        // res.data.data.logo_thumb_url = ''
        if (res.data.data.logo_thumb_url != null && res.data.data.logo_thumb_url != '' && res.data.data.logo_thumb_url != undefined) {
          this.setData({
            logo_thumb_url: res.data.data.logo_thumb_url
          })
        } else {
          // that.wxgetUserInfo()
          this.setData({
            // real_name_auth: '',
            // real_name: '',
            // mobile: res.data.data.mobile,
            showMask: true
          })
        }
      }
    }, (err) => {
      //网络异常处理
    })
  },

  initAjax: function (e) {
    var userInfo = e.detail.e

    var that = this
    if (userInfo != '') {

      dmNetwork.post(dmNetwork.update_userinfo, {
          team_id: 0,
          project_id: 0,
          logo: userInfo.avatarUrl
        },
        (res) => {
          if (res.data.errno == 0) {
            that.setData({
              logo_thumb_url: userInfo.avatarUrl,
              // real_name: userInfo.nickName,
              showMask: false
            })
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none'
            })
          }

        }, (err) => {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
        })

    } else {
      that.getUserInfoSetting()
    }

  },
  getUserInfoSetting: function () {
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {} else {
          wx.showModal({
            title: '您已拒绝授权',
            showCancel: false,
            content: '如果继续使用,点击确定进行设置',
            success: function (res) {
              that.gotoSetting()
            }
          })
        }
      }
    })

  },

  gotoSetting: function (e) {
    var that = this
    wx.openSetting({
      success: function (data) {
        console.log(data);
        if (data.authSetting["scope.userInfo"] == true) {
          //再次授权，调用getLocationt的API
          // that.getuserinfo.getUserInfo()
        } else {
          wx.showModal({
            title: '您已拒绝授权',
            showCancel: false,
            content: '如果继续使用,点击确定进行设置',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");
              } else if (res.confirm) {
                that.gotoSetting()
              }
            }
          })
        }
      }
    })
  },
  //我的工资条
  gooutSalary: function(){
      wx.navigateTo({
        url: '../salary/salary',
        success: function () {
  
        },//成功后的回调；
        fail: function () { },//失败后的回调；
        complete: function () { } //结束后的回调(成功，失败都会执行)
      })
  },

  exitlogin: function () {
    var that = this
    wx.showModal({
      title: '',
      content: '您确定解除与' + that.data.mobile + '的绑定关系吗？',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          that.exitLoginForServere()
        }
      }
    })
  },
  exitLoginForServere: function () {
    wx.login({
      success: function (res) {
        var code = res.code
        dmNetwork.get(dmNetwork.exitLogin, {
            code: code
          },
          (res) => {
            console.log(res)
            if (res.data.errno == 0) {
              app.globalData.userInfo = null
              wx.clearStorage()
              wx.clearStorageSync()
              wx.reLaunch({
                url: '../login/login',
              })
            } else {
              wx.showToast({
                title: res.data.errmsg,
                duration: 1500,
                icon: 'none'
              })
            }
          },
          (err) => {

          })
      }
    })
  },
  userdata: function () {
    wx.setStorageSync("uc_info", {
      "uc_logo_thumb_url": this.data.logo_thumb_url,
      "uc_name": this.data.real_name,
      "ned_refresh_page": "1"
    });
    wx.navigateTo({
      url: "../ucinfo/ucinfo?real_name_auth=" + this.data.real_name_auth
    })
  },
  contentservice: function () {
    // wx.navigateTo({url:"/pages/uc/contentservice/contentservice"});
    wx.makePhoneCall({
      phoneNumber: '010-57977077' //仅为示例，并非真实的电话号码
    })
  },

  mywallet: function () {
    // wx.navigateTo({ url: "../mywallet/mywallet" })
    wx.navigateTo({
      url: "../../withdrawal/mywallet/mywallet?mobile=" + this.data.mobile + "&is_bind_bank_card="+ this.data.is_bind_bank_card,
    })
  },
  // 我的认证
  myAuth: function () {
    wx.navigateTo({
      url: `../../certificate/certificate?isAuth=${this.data.is_real_auth}&isOcr=${this.data.isOcr}`
    })
  },
  //我的活体认证
  livingCertification:function(){
    wx.navigateTo({
      url: "../../recentPhoto/recentPhoto"
    })
  },
  //我的银行卡
  bindBrankCard:function(){
    if(!this.data.real_name_auth){
      wx.showToast({
        title: "请先去【我的工作】完成签约和实名认证",
        icon: "none",
      });
      return
    }
    let url;
    if(this.data.is_bind_bank_card == 0){
      url = "../../bindbankcard/bindbankcard"
    }else{
      url = "../../bankcardlist/bankcardlist"
    }
    wx.navigateTo({
      url: url + '?mobile=' + this.data.mobile,
    })
  },

  // 前往我的工作页面
  goMyWork: function () {
    wx.navigateTo({
      url: "/pages/uc/my_work/my_work"
    });
  },
  changephone: function () {
    wx.navigateTo({
      url: "../phonelogin/phonelogin?pagetype=1"
    })
  },
  changephone2: function () {
        wx.navigateToMiniProgram({
            appId: 'wx1849677522e6655c',
            path: '/pages/informationCollection/index?token='+this.data.login_laixinshui_sign_token+'&mobile='+this.data.mobile+'&sourceId=meidi_10060',
            envVersion: 'release', //开发版develop 开发版 trial 体验版 release 正式版
            extraData: {
                // 传递给外部小程序的数据，可选
            },
            success(res) {
                // 跳转成功的回调函数
            },
            fail(res) {
                // 跳转失败的回调函数
            }
        });

    },
    changephone3: function () {
        wx.navigateToMiniProgram({
            appId: 'wx1849677522e6655c',
            path: '/pages/myBankCard/myBankCard?token='+this.data.login_laixinshui_sign_token+'&mobile='+this.data.mobile+'&sourceId=meidi_10060',
            envVersion: 'trial', //开发版develop 开发版 trial 体验版 release 正式版
            extraData: {
                // 传递给外部小程序的数据，可选
            },
            success(res) {
                // 跳转成功的回调函数
            },
            fail(res) {
                // 跳转失败的回调函数
            }
        });


    },

  // 前往我的驾照
  drivingLicense:function(){
    wx.navigateTo({
      url: "/pages/uc/driving_license/driving_license"
    });
  },
  perfect_information: function () {
    wx.navigateTo({
      url: "../my_protocol/my_protocol",
    })
  },
  // 跳转到回访任务
  goReturnvisit() {
    wx.navigateTo({
      url: "/pages/uc/returnvisit/returnvisit"
    });
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
