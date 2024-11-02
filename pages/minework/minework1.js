import * as minework from '../../composables/minework/minework'
var util = require("../../utils/util.js");
var dmNetwork = require("../../utils/network.js");
var collector = require("../../utils/collector.js");
var mineJobData = {};
var app = getApp();
var wxVeison = wx.getSystemInfoSync();
var localProjectId;
const noticeOfSigning = {
  1: {
    companySide: '宁波爱保穗信息科技有限公司。',
    cityOfApplication: '申报城市为“宁波”。',
    protocolName: '《灵活用工协议》',
  },
  2: {
    companySide: '龙游弘博科技有限公司。',
    cityOfApplication: '申报城市为“衢州市”。',
    protocolName: '《灵活用工协议》',
  },
  3: {
    companySide: '新诚优聘（安庆）科技有限公司。',
    cityOfApplication: '申报城市为“安庆”。',
    protocolName: '《协议》',
  }
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timer: null,
    projectname: "",
    isShowNoWork: false,
    isShowNoProject: false,
    isShowAtten: false,
    isShowNetWorkError: false,
    showModalStatus: false,
    datareport: [1, 2],
    isFormRefresh: false,
    minejob: {},
    rankingNum: "", // 考勤排行榜排在多少名
    attendances: [],
    formData: {},
    cLocationTime: "",
    projectData: [],
    projectNameArray: [{}, {}, {}],
    index: 0,
    team_id: 0,
    project_id: 0,
    isShowNote: false,
    isShowDrainage: false,
    isShowTip: false,
    isShowAdCard: false,
    ad_card_url: "",
    // ad_view_height: 0,
    onClickSignProtocol: false,
    ifNeedAuthFlag: false,
    protocol_order_id: "",
    protocol_order_ids: [],
    gojsjNum: 0,
    isShowAuthentication: false, //实名认证弹出
    showError: false, //实名认证错误提示
    errorContent: "",
    realUserName: "",
    realIdCard: "",
    agreement_num: "一",
    getcodetext: "10s",
    canGoSign: false,
    showWe2000Flag: false,
    inCheckAndShowWe: false,
    memberId: "",
    webank_tips: false,
    is_bind_card: 0,
    is_ocr: 0,
    is_faceliveness: 0,
    is_ocr_check: 1,
    // 优化签约须知
    showSignDocumentNums: false,
    showNoticeOfSigning: false,
    noticeOfSigningText: '',
    macInfo: { // 打卡
      mac: [],
      is_allow_punch: 0,
      punch_type: 0 //0：GPS 打卡 1：WIFI打卡
    }
  },
  fromPage: 'local', // 来源：local：本页 scanTheCode：扫码进入
  scanTheCodeData: {}, // 扫码进入的小组数据
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 对于扫码进入：判断当前的小组是不是和扫码进来的小组是否是同一个
    const { team_id, project_id, group_id } = options;
    if (team_id && project_id && group_id) {
      this.initGroupData({ team_id, project_id, group_id });
      this.handleScanTheCode({ team_id, project_id, group_id });
    } else {
      this.getProjectList();
      this.sendAdRequest();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var window = wx.getSystemInfoSync();
    // console.log(window.windowHeight);
    // this.setData({
    //   ad_view_height: window.windowHeight * 2 - 88,
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    localProjectId = wx.getStorageSync("local_project_id");
    const needRefresh = wx.getStorageSync("needRefresh") || 0;
    const tip = wx.getStorageSync("isShowTip") || 0;
    this.setData({
      canGoSign: false,
      timer: null,
      getcodetext: "10s",
      isShowTip: tip == 1
    });
    if (tip == 1) {
      wx.setStorageSync("isShowTip", 0);
    }
    if (needRefresh != 0 && this.data.projectData.length) {
      wx.setStorageSync("needRefresh", 0);
      const projectData = this.data.projectData;
      const index = projectData.length ? projectData.findIndex(res => {
        return res.project_id == localProjectId
      }) : 0
      wx.setStorageSync(
        "showActivePage",
        this.data.projectData[index].is_recommend_post == 1 ? "show" : "hidden"
      );

      // this.checkIsSameGroup();
    }
  },
  // 初始化扫码进来的小组数据
  async initGroupData ({ team_id, project_id, group_id }) {
    const that = this;
    wx.setStorageSync("local_project_id", project_id);
    that.fromPage = 'scanTheCode'
    that.scanTheCodeData = {
      team_id,
      project_id,
      group_id,
    };
  },
  // 处理扫码进入的后续逻辑
  async handleScanTheCode ({ team_id, project_id, group_id }) {
    // 1：检查是否在同一小组
    const [error, groupData] = await minework.checkIsSameGroup({ team_id, project_id, group_id });
    if (error) {
      wx.showToast({
        title: error.errmsg,
        icon: "none",
      });
      return
    }
    const { is_same } = groupData;
    if (!is_same) {
      // 2：处理没有在小组的情况
      const isConfirm = that.handleNotSameGroup(groupData);
      if (isConfirm) {
        const [changeError, changeResult] = await minework.changeGroup({ team_id, project_id, group_id });
        if (changeError) {
          wx.showToast({
            title: changeError.errmsg,
            icon: "none",
          });
          return
        }
        const [error, projectData] = await minework.getProjectList();
        if (error) {
          wx.showToast({
            title: error.errmsg,
            icon: "none",
          });
          return
        }
        that.handleProjectList(projectData);
      }
    } else {
      const [error, projectData] = minework.getProjectList();
      if (error) {
        wx.showToast({
          title: error.errmsg,
          icon: "none",
        });
        return
      }
    }
  },
  // 处理没在小组的情况
  handleNotSameGroup (groupData) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: "",
        confirmText: "是",
        cancelText: "否",
        content: '被邀请的小组与当前所在小组不同，是否从"' + groupData.old_group_name + '"小组移动到"' + groupData.new_group_name + '"小组？',
        success: (res) => {
          if (res.confirm) {
            resolve(true)
          } else {
            //点击取消
            resolve(false)
          }
        },
      })
    })
  },
  //获取项目列表
  getProjectList: function () {
    var that = this;
    dmNetwork.getInBackground(
      dmNetwork.proJectList,
      {
        team_id: 0,
        status: 1,
      },
      (res) => {
        wx.stopPullDownRefresh();
        if (res.data.errno == 0) {
          var projectNameList = [];
          for (var i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].viewid = "view" + i;
            projectNameList.push(res.data.data.list[i].name);
          }

          if (res.data.data.list.length > 0) {
            var index = 0;
            //如果有最新项目就选择新加入的项目
            if (this.data.isFormRefresh || !res.data.data.has_newproject) {
              for (var i = 0; i < res.data.data.list.length; i++) {
                if (res.data.data.list[i].project_id == localProjectId) {
                  index = i;
                  break;
                }
              }
            }
            console.log("打印index：" + index);
            this.setData({
              isFormRefresh: false,
            });
            wx.setStorageSync("team_id", res.data.data.list[index].team_id);
            wx.setStorageSync(
              "project_id",
              res.data.data.list[index].project_id
            );
            wx.setStorageSync(
              "showActivePage",
              res.data.data.list[index].is_recommend_post == 1
                ? "show"
                : "hidden"
            );
            wx.setStorageSync(
              "local_project_id",
              res.data.data.list[index].project_id
            );
            wx.setStorageSync("needRefreshFwork", 1);
            that.setData({
              index: index,
              toView: "view" + index,
              isShowNoProject: false,
              projectData: res.data.data.list,
              projectname: res.data.data.list[index].name,
              project_id: res.data.data.list[index].project_id,
              team_id: res.data.data.list[index].team_id,
              //微信登录未完，测试写死
              projectNameArray: projectNameList,
              isShowNetWorkError: false,
            });
            that.getDrainage();
            that.getMyworkInfo(
              res.data.data.list[that.data.index].team_id,
              res.data.data.list[that.data.index].project_id,
              that.data.index
            );
          } else {
            that.setData({
              isShowNoProject: true,
              projectData: [],
              isShowNoWork: false,
              minejob: {},
              isShowAtten: false,
              isShowNetWorkError: false,
            });
            this.util("close");
            that.checkRealName();
          }
        }
      },
      (err) => {
        //网络异常处理
        this.setData({
          isShowNetWorkError: true,
        });
        wx.stopPullDownRefresh();
      }
    );
  },
  // 处理项目列表
  handleProjectList (projectData) {
    const projectNameList = [];
    let newProjectIndex = 0;
    let isShowNoProject = false;
    const localProjectId = wx.getStorageSync('local_project_id');
    const { list, has_newproject } = projectData;
    if (list && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        list[i].viewid = "view" + i;
        projectNameList.push(list[i].name);
      }
      if (localProjectId && !has_newproject) {
        newProjectIndex = list.findIndex(v => {
          return v.project_id = localProjectId
        })
      }
      const { team_id, project_id, is_recommend_post } = list[newProjectIndex];
      wx.setStorageSync("team_id", team_id);
      wx.setStorageSync("project_id", project_id);
      wx.setStorageSync("showActivePage", is_recommend_post == 1);
      wx.setStorageSync("local_project_id", project_id);
      wx.setStorageSync("needRefreshFwork", 1);
      isShowNoProject = false;
      that.setData({
        index: index,
        toView: "view" + index,
        isShowNoProject: false,
        projectData: res.data.data.list,
        projectname: res.data.data.list[index].name,
        project_id: res.data.data.list[index].project_id,
        team_id: res.data.data.list[index].team_id,
        //微信登录未完，测试写死
        projectNameArray: projectNameList,
        isShowNetWorkError: false,
      });
    } else {
      that.setData({
        isShowNoProject: true,
        projectData: [],
        isShowNoWork: false,
        minejob: {},
        isShowAtten: false,
        isShowNetWorkError: false,
      });
    }
    const listItem = list[newProjectIndex];
    return {
      newProjectIndex,
      toView: 'view' + newProjectIndex,
      isShowNoProject,
      projectData: list,
      projectname: listItem.name,
      project_id: listItem.project_id,
      team_id: '',
      projectNameArray: '',
      isShowNetWorkError: '',
    }
  },
  //检测被邀请的小组是否当前所在小组
  checkIsSameGroup: function () {
    let that = this;
    dmNetwork.post(
      dmNetwork.is_same_group,
      that.data.group_post_data,
      (res) => {
        if (res.data.errno == 0) {
          if (res.data.data.is_same == false) {
            wx.showModal({
              title: "",
              confirmText: "是",
              cancelText: "否",
              content:
                '被邀请的小组与当前所在小组不同，是否从"' +
                res.data.data.old_group_name +
                '"小组移动到"' +
                res.data.data.new_group_name +
                '"小组？',
              success: function (res) {
                if (res.confirm == true) {
                  //点击确定
                  wx.setStorageSync(
                    "local_project_id",
                    that.data.group_post_data.project_id
                  );
                  that.setData({
                    isFormRefresh: true,
                  });
                  dmNetwork.post(
                    dmNetwork.change_group,
                    group_post_data,
                    (res) => {
                      if (res.data.errno == 0) {
                        that.getProjectList();
                      }
                    }
                  );
                } else {
                  //点击取消
                  wx.setStorageSync(
                    "local_project_id",
                    that.data.group_post_data.project_id
                  );
                  //wx.setStorageSync("needRefresh", 0)
                  localProjectId = wx.getStorageSync("local_project_id");

                  if (
                    null != app.globalData.userInfo &&
                    app.globalData.userInfo.length != 0
                  ) {
                    that.getProjectList();
                  } else {
                    wx.reLaunch({
                      url: "../uc/login/login",
                    });
                  }
                }
              },
            });
          } else {
            if (
              that.data.group_post_data.project_id &&
              that.data.group_post_data.project_id != ""
            ) {
              wx.setStorageSync(
                "local_project_id",
                that.data.group_post_data.project_id
              );
            }
            that.setData({
              isFormRefresh: true,
            });
            //wx.setStorageSync("needRefresh", 1)
            localProjectId = wx.getStorageSync("local_project_id");
            console.log("localProjectId9999", localProjectId);
            that.getProjectList();
            that.sendAdRequest();
          }
        } else {
          if (
            "" != app.globalData.userInfo &&
            app.globalData.userInfo.length != 0
          ) {
            wx.setStorageSync(
              "local_project_id",
              that.data.group_post_data.project_id
            );
            that.getProjectList();
            that.sendAdRequest();
          } else {
            wx.reLaunch({
              url: "../uc/login/login",
            });
          }
        }
      },
      (err) => { }
    );
  },
  //检测是否实名认证
  checkRealName: function () {
    let that = this;
    dmNetwork.get(dmNetwork.check_real_name, {}, (res) => {
      if (res.data.errno == 0) {
        if (res.data.data.authenticated == 1) {
          that.setData({
            isShowAuthentication: false,
          });
          that.checkProtocol();
        } else {
          that.setData({
            isShowAuthentication: true,
          });
        }
      } else if (res.data.errno == 104) {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
        wx.reLaunch({
          url: "../uc/login/login",
        });
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
      }
    });
  },
  onClickCer: function () {
    //实名认证
    if (!this.data.realUserName) {
      this.setData({
        showError: true,
        errorContent: "请填写姓名",
      });
      return;
    }
    if (!this.data.realIdCard) {
      this.setData({
        showError: true,
        errorContent: "请填写身份证号",
      });
      return;
    }
    let that = this;
    dmNetwork.post(
      dmNetwork.nameAuthentication,
      {
        name: this.data.realUserName,
        idnumber: this.data.realIdCard,
      },
      (res) => {
        if (res.data.errno == 0) {
          that.setData({
            isShowAuthentication: false,
          });
          that.checkProtocol();
        } else {
          that.setData({
            errorContent: res.data.errmsg,
            showError: true,
          });
        }
      },
      "",
      true
    );
  },
  nameInput: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        realUserName: value,
        showError: false,
      });
    }
  },
  idCardInput: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        realIdCard: value,
        showError: false,
      });
    }
  },
  closeProtocolDialog () {
    // this.setData({
    //   isShowNewProtocolFlag: false,
    // });
    this.setData({
      showNoticeOfSigning: false,
    });
  },
  // closeProtocolDialog1 () {
  //   this.setData({
  //     isShowNewProtocolFlag1: false,
  //   });
  // },
  // closeProtocolDialog2 () {
  //   this.setData({
  //     isShowNewProtocolFlag2: false,
  //   });
  // },
  checkProtocol: function (e) {
    const that = this;
    that.setData({
      canGoSign: false,
      timer: null,
      getcodetext: "10s",
    });
    const project_id = wx.getStorageSync("local_project_id");
    const team_id = wx.getStorageSync("team_id");
    const post_data = { team_id, project_id };
    dmNetwork.post(
      dmNetwork.check_protocol,
      post_data,
      (res) => {
        if (res.data.errno == 0) {
          const data = res.data.data;
          // 处理签约须知
          const { showSignDocumentNums, showNoticeOfSigning, noticeOfSigningText, ifNeedAuthFlag } = this.handleNoticeOfSigning(data);
          that.setData({
            showSignDocumentNums,
            showNoticeOfSigning,
            noticeOfSigningText,
            ifNeedAuthFlag,
            is_protocol_supplement_info: data.is_protocol_supplement_info,
            is_upload_idcard_info: data.is_uplod_images,
            // is_protocol_supplement_info:1,
            protocol_order_ids: data.protocol_order_ids,
            is_bind_card: data.is_bind_card,
            is_ocr: data.is_ocr,
            is_faceliveness: data.is_faceliveness,
            is_ocr_check: data.is_ocr_check
          })
          let time = 10;
          let timer = that.data.timer;
          if (!timer && data.is_sign_notice === 1 || data.is_sign_notice === 2 || data.is_sign_notice === 3) {
            timer = setInterval(function () {
              that.setData({
                getcodetext: --time + "s",
              });
              if (time === -1) {
                clearInterval(timer);
                that.setData({
                  getcodetext: "签署合同",
                  canGoSign: true,
                  timer: null,
                });
              }
            }, 1000);
          }
          that.setData({
            timer,
          });
          // let showFlag =
          //   data.protocol_order_ids.length > 0 && data.is_sign_notice === 0
          //     ? true
          //     : false;
          // let showNewFlag =
          //   data.protocol_order_ids.length > 0 && data.is_sign_notice === 1
          //     ? true
          //     : false;
          // let showNewFlag1 =
          //   data.protocol_order_ids.length > 0 && data.is_sign_notice === 2
          //     ? true
          //     : false;
          // let showNewFlag2 =
          //   data.protocol_order_ids.length > 0 && data.is_sign_notice === 3
          //     ? true
          //     : false;

          let webank_tips = false;

          if (!showNoticeOfSigning && !showSignDocumentNums) {
            // 当没有合同要签约时，调取接口查看是否需要展示we2000广告
            let we2000Times = false;
            let times = 0;
            let date = new Date().toLocaleDateString();
            try {
              var res = wx.getStorageSync("we2000");
              if (!res) {
                times = 1;
                we2000Times = true;
              } else {
                let data = JSON.parse(res);
                if (data.date == new Date().toLocaleDateString()) {
                  if (data.times < 2) {
                    we2000Times = true;
                  }
                  times = 2;
                } else {
                  we2000Times = true;
                  times = 1;
                }
              }
            } catch (e) {
              we2000Times = true;
              times = 1;
            }

            if (we2000Times) {
              dmNetwork.get(
                dmNetwork.check_we,
                {
                  dmclient: "weixinxcx",
                  project_id: localProjectId,
                },
                (res) => {
                  if (res.data.errno == 0) {
                    webank_tips = res.data.data.webank_tips;
                    let memberId = res.data.data.user_id.slice(10);
                    that.trackPV({
                      from: "workadmin_xcx",
                      user: memberId,
                    });
                    if (res.data.data.task_id == -1) {
                      that.setData({
                        showWe2000Flag: webank_tips,
                        inCheckAndShowWe: true,
                        memberId: memberId,
                      });
                    } else {
                      that.setData({
                        inCheckAndShowWe: webank_tips,
                        memberId: memberId,
                      });
                    }
                    if (
                      that.data.inCheckAndShowWe &&
                      that.data.showWe2000Flag
                    ) {
                      wx.setStorage({
                        key: "we2000",
                        data: JSON.stringify({
                          date: date,
                          times: times,
                        }),
                      });
                    }
                    that.setData({
                      webank_tips: webank_tips,
                      times: times,
                    });
                  } else {
                    wx.showToast({
                      title: res.data.errmsg,
                      icon: "none",
                    });
                  }
                }
              );
            }
          }
          // that.setData({
          //   isShowProtocolFlag: showFlag,
          //   isShowNewProtocolFlag: showNewFlag,
          //   isShowNewProtocolFlag1: showNewFlag1,
          //   isShowNewProtocolFlag2: showNewFlag2,
          //   ifNeedAuthFlag: ifNeedAuthFlag,
          //   is_protocol_supplement_info: data.is_protocol_supplement_info,
          //   is_upload_idcard_info: data.is_uplod_images,
          //   // is_protocol_supplement_info:1,
          //   protocol_order_ids: data.protocol_order_ids,
          //   is_bind_card: data.is_bind_card,
          //   is_ocr: data.is_ocr,
          //   is_faceliveness: data.is_faceliveness,
          //   is_ocr_check: data.is_ocr_check
          // });
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
          });
        }
      },
      "",
      true
    );
  },
  // 处理签约须知弹框
  handleNoticeOfSigning (data) {
    const is_sign_notice = parseInt(data.is_sign_notice);
    const showSignDocumentNums = data.protocol_order_ids.length > 0 && is_sign_notice == 0;
    const showNoticeOfSigning = data.protocol_order_ids.length > 0 && is_sign_notice > 0;
    const noticeOfSigningText = noticeOfSigning[is_sign_notice];
    const ifNeedAuthFlag = data.protocol_order_ids.length > 0 && data.is_complete_user == 1;
    return {
      showSignDocumentNums,
      showNoticeOfSigning,
      noticeOfSigningText,
      ifNeedAuthFlag
    }
  },
  // 须知倒计时
  handleNoticeOfSigningCountdown () {

  },
  // 当没有签约时，判断是否弹出广告
  handleAd () {

  },
  // 跳转到we2000
  goWe () {
    let that = this;
    dmNetwork.get(
      dmNetwork.record_we,
      {
        dmclient: "weixinxcx",
      },
      (res) => {
        if (res) {
          console.log("oooooooo");
          console.log(that.data.memberId);
          that.trackEV({
            from: "workadmin_xcx",
            user: that.data.memberId,
          });
          wx.navigateToMiniProgram({
            appId: "wxcb823d713276a10d",
            path: "page/landing/landing?jumpPage=merchant-introv2&jumpType=2",
            extraData: {
              webankAppId: "W9847561",
              memberId: that.data.memberId,
              secondid: "",
              thirdid: "",
              channel_ext_info: "",
            },
            envVersion: "release",
            success (res) {
              // 打开成功
              that.closeWe();
            },
          });
        }
      }
    );
  },
  // 关闭we2000广告弹窗
  closeWe () {
    this.setData({
      showWe2000Flag: false,
    });
  },
  onClickReward: function (e) {
    collector.saveFormid(e.detail.formId);
    collector.uploadFormid();
    wx.navigateTo({
      url: "../flexwork/rewardlist/rewardlist",
    });
  },

  //发送广告
  sendAdRequest: function (e) {
    var hasShowAdCardFlag = wx.getStorageSync("hasShowAdCardFlag");
    console.log("---hasShowAdCardFlag---:" + hasShowAdCardFlag);
    if (hasShowAdCardFlag == true && hasShowAdCardFlag != "") {
      return;
    }

    var that = this;
    dmNetwork.get(dmNetwork.ad_card, {}, (res) => {
      console.log("1234567890");
      console.log(JSON.stringify(res.data));
      if (res.data.errno == 0) {
        console.log("数组长度：" + res.data.data.length);
        console.log(JSON.stringify(res.data.data));
        if (res.data.data.length > 0) {
          console.log("有活动卡片");
          that.setData({
            isShowAdCard: true,
            ad_card_url: res.data.data[0],
          });
          wx.setStorageSync("hasShowAdCardFlag", true);
        }
      }
    });
  },

  close_ad_card: function (e) {
    this.setData({
      isShowAdCard: false,
    });
  },

  save_ad_card_image: function (e) {
    var that = this;
    console.log("图片url：" + that.data.ad_card_url);

    wx.getSetting({
      success (res) {
        console.log("授权列表：" + JSON.stringify(res));
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          console.log("去授权保存图片权限");
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success () {
              that.downLoadFileAndSave();
            },
            fail () {
              wx.showToast({
                title: "如果想使用该功能，请在设置中开启保存到相册权限",
                icon: "none",
              });
            },
          });
        } else {
          console.log("已经授权保存图片权限");
          that.downLoadFileAndSave();
        }
      },
    });
  },

  downLoadFileAndSave: function (e) {
    var that = this;
    wx.showLoading({
      title: "正在保存图片中",
    });
    console.log("发送下载请求时的url：" + that.data.ad_card_url);
    wx.downloadFile({
      url: that.data.ad_card_url,
      success: function (res) {
        console.log(res);
        console.log("图片下载成功");
        wx.hideLoading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res);
            wx.showToast({
              title: "保存图片成功",
              icon: "none",
            });
          },
          fail: function (res) {
            console.log(res);
            console.log("fail");
            wx.showToast({
              title: "保存失败",
              icon: "none",
            });
          },
        });
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: "请求保存失败",
          icon: "none",
        });
      },
    });
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;

    //做好版本兼容 调用隐藏/展示tabBar方法必须在tabBar页面
    // if (util.compareVersion("1.9.0", wxVeison.SDKVersion) == 1) {
    //   //高于1.9.0隐藏tabbar先
    // } else {
    //   if (currentStatu == "open") {
    //     wx.hideTabBar({});
    //   } else {
    //     setTimeout(function () {
    //       wx.showTabBar({});
    //     }, 300);
    //   }
    // }
    this.util(currentStatu);
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例

    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0, //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(393).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export(),
    });

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(
      function () {
        // 执行第二组动画：Y轴不偏移，停
        animation.translateY(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        this.setData({
          animationData: animation,
        });

        //关闭抽屉
        if (currentStatu == "close") {
          this.setData({
            showModalStatus: false,
          });
        }
      }.bind(this),
      200
    );

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true,
      });
    }
  },

  //获取今日工作数据
  getMyworkInfo: function (team_id, project_id, index) {
    var that = this;
    dmNetwork.getInBackground(
      dmNetwork.mywork,
      {
        team_id: team_id,
        project_id: project_id,
      },
      (res) => {
        var isShowEarlyClock = false;
        var work_type = 0;
        if (res.data.errno == 0) {
          mineJobData = res.data.data;

          var alist = res.data.data.attendance.attendance_list;
          var hasWork = false;
          if (-1 != mineJobData.attendance.extra_info.task_id) {
            hasWork = true;
          }
          work_type = mineJobData.attendance.extra_info.work_type;
          if (mineJobData.form != null && mineJobData.form.show == 1) {
            hasWork = true;
          }
          if (mineJobData.sign != null && mineJobData.sign.show == 1) {
            hasWork = true;
          }

          // if (mineJobData.ranking != null && mineJobData.ranking.show == 1) {
          //   hasWork = true
          // }
          var aresult = [];
          for (var i = 0; i < alist.length; i += 2) {
            var attendance = {};
            attendance.sdata = alist[i];
            attendance.edata = alist[i + 1];
            attendance.startTime = alist[i].require_time;
            attendance.endTime = alist[i + 1].require_time;
            attendance.sAttendTime = alist[i].attend_time;
            attendance.eAttendTime = alist[i + 1].attend_time;
            attendance.sAttendanceBtn = alist[i].attendance_btn;
            attendance.eAttendanceBtn = alist[i + 1].attendance_btn;
            attendance.isShowSAttendTime = true;
            attendance.isShowEAttendTime = true;
            if (
              alist[i].attend_time == "" &&
              alist[i].attendance_btn != 1 &&
              (work_type == 0 || work_type == 2)
            ) {
              isShowEarlyClock = true;
            }
            attendance.isShowEarlyClock = isShowEarlyClock;
            if ("" == alist[i].attend_time) {
              attendance.isShowSAttendTime = false;
              attendance.sItemWidth = "0rpx";
            } else {
              attendance.sItemWidth = "100%";
            }
            if (0 == alist[i].attendance_btn && attendance.sAttendTime == "") {
              attendance.isShowSAttendTime = false;
            }

            if ("" == alist[i + 1].attend_time) {
              attendance.isShowEAttendTime = false;
              attendance.eItemWidth = "0rpx";
            } else {
              attendance.eItemWidth = "100%";
            }

            if (1 == alist[i].attendance_btn) {
              attendance.eItemWidth = "0rpx";
            } else {
              attendance.eItemWidth = "100%";
            }
            if (
              0 == alist[i + 1].attendance_btn &&
              attendance.eAttendTime == ""
            ) {
              attendance.isShowEAttendTime = false;
            }
            attendance.sStatus = alist[i].status;
            attendance.eStatus = alist[i + 1].status;
            attendance.scross = alist[i].cross;
            attendance.scross_attend = alist[i].cross_attend;
            attendance.ecross = alist[i + 1].cross;
            attendance.ecross_attend = alist[i + 1].cross_attend;

            if (
              attendance.sStatus.length == 1 &&
              attendance.sStatus[0].value == 1
            ) {
              attendance.sStatusImg = "../../image/ic_attendance_success.png";
              attendance.sStatus[0].class =
                "item-attendance-text-state-success";
            } else {
              attendance.sStatusImg = "../../image/ic_attendance_error.png";
              for (var j = 0; j < attendance.sStatus.length; j++) {
                attendance.sStatus[j].class =
                  "item-attendance-text-state-error";
              }
            }
            if (
              attendance.eStatus.length == 1 &&
              attendance.eStatus[0].value == 1
            ) {
              attendance.eStatusImg = "../../image/ic_attendance_success.png";
              attendance.eStatus[0].class =
                "item-attendance-text-state-success";
            } else {
              attendance.eStatusImg = "../../image/ic_attendance_error.png";
              for (var j = 0; j < attendance.eStatus.length; j++) {
                attendance.eStatus[j].class =
                  "item-attendance-text-state-error";
              }
            }

            aresult.push(attendance);
          }
          var time = "";

          if (res.data.data.sign.list.length > 0) {
            time = util.formatTimeHM(
              new Date(1000 * parseInt(res.data.data.sign.list[0].time))
            );
          }
          that.setData({
            minejob: res.data.data,
            isShowNoWork: !hasWork,
            isShowAtten: -1 != mineJobData.attendance.extra_info.task_id,
            attendances: aresult,
            project_id: project_id,
            team_id: team_id,
            formData: res.data.data.form,
            cLocationTime: time,
            index: index,
            isShowNote: 0 < mineJobData.notice,
            ['macInfo.mac']: mineJobData.attendance.extra_info.mac || [],
            ['macInfo.is_allow_punch']: mineJobData.attendance.extra_info.is_allow_punch,
            ['macInfo.punch_type']: mineJobData.attendance.extra_info.punch_type
          });

          // 如果 从用户工作列表页面接口(/sea/api/1.0/client/v1/project/get/mywork)获取的ranking.show==‘1’才去请求获取考勤排名接口(/sea/api/1.0/client/v1/attendance/ranking) modified by ltl2018.07.23
          if (res.data.data.ranking.show == "1") {
            dmNetwork.getMyworkRanking(
              dmNetwork.myworkRanking,
              {
                team_id: team_id,
                project_id: project_id,
              },
              (res) => {
                if (res.data.errno == 0) {
                  // 表示成功返回
                  that.setData({
                    rankingNum: res.data.data.ranking,
                  });
                } else {
                  wx.showToast({
                    title: res.data.errmsg,
                    mask: true,
                    duration: 1500,
                    icon: "none",
                  });
                }
              },
              (err) => {
                console.log("获取考勤排名接口err:", err);
              }
            );
          }
          that.checkRealName();
          wx.setStorageSync("needRefresh", 1);
        } else {
          wx.showToast({
            title: res.data.errmsg,
            mask: true,
            duration: 1500,
            icon: "none",
          });
        }
      },
      (err) => {
        //网络异常处理
      }
    );
  },
  bindPickerChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    var that = this;
    this.setData({
      index: e.detail.value,
      team_id: this.data.projectData[e.detail.value].team_id,
      project_id: this.data.projectData[e.detail.value].project_id,
    });
    //清空数据
    wx.setStorage({
      key: "a_extra_info",
      data: "",
      success: (stora) => { },
      fail: function () {
        console.error("存储token时失败");
      },
    });
    this.getMyworkInfo(
      that.data.projectData[e.detail.value].team_id,
      that.data.projectData[e.detail.value].project_id,
      e.detail.value
    );
  },
  onClickSAttendanceBtn: function (e) {
    console.log('onClickSAttendanceBtn', e);
    var that = this;
    collector.saveFormid(e.detail.formId);
    collector.uploadFormid();
    var currentStatu = e.currentTarget.dataset.statu;
    wx.setStorageSync(
      "local_project_id",
      that.data.projectData[that.data.index].project_id
    );
    let mac_address = '';
    wx.setStorage({
      key: "a_extra_info",
      data: mineJobData.attendance.extra_info,
      success: async (stora) => {
        if (that.data.macInfo.punch_type == 1) {
          const res = await that.getWifiInfo()
          mac_address = res.mac_address;
        }
        // return
        //处理跳转逻辑

        wx.navigateTo({
          url:
            "../dataform/dataform?type=1&title=考勤信息填写&team_id=" +
            this.data.team_id +
            "&project_id=" +
            this.data.project_id +
            "&mac_address=" +
            mac_address +
            "&attendance_id=" +
            currentStatu.attendance_id +
            "&time_id=" +
            currentStatu.time_id +
            "&task_id=" +
            mineJobData.attendance.extra_info.task_id +
            "&schedule_id=" +
            currentStatu.schedule_id +
            "&cross=" +
            currentStatu.cross +
            "&form_data_id=" +
            currentStatu.form_data_id +
            "&cross_attend=" +
            currentStatu.cross_attend +
            "&task_id_yesterday=" +
            mineJobData.attendance.extra_info.task_id_yesterday +
            "&count=" +
            1,
        });
      },
      fail: function () {
        console.error("存储token时失败");
      },
    });
  },
  // wifi 打卡
  getWifiInfo () {
    const that = this;
    return new Promise((resolve, reject) => {
      wx.startWifi({
        success (res) {
          // wx.getWifiList({
          //   success (res) {
          //     wx.onGetWifiList(function (wifiList) {
          //       console.log('fffffff', wifiList.wifiList)
          //       console.log('dddddd', wifiList.wifiList.filter(res => {
          //         return res.SSID === 'doumi-office'
          //       }))
          //     })
          //   }
          // })
          wx.getConnectedWifi({
            success (res) {
              if (res.errno == 0) {
                const { BSSID, SSID } = res.wifi || {};
                const findIndex = that.data.macInfo.mac.findIndex(v => {
                  return v.mac_address === BSSID
                });
                if (findIndex > -1) {
                  resolve({ mac_address: BSSID });
                } else {
                  wx.showToast({
                    title: '请连接正确的WIFI',
                    mask: true,
                    duration: 1500,
                    icon: "none",
                  });
                  reject();
                }
                // this.pushInWifi(res.wifi)
              } else {
                wx.showToast({
                  title: '请检查WIFI网络',
                  mask: true,
                  duration: 1500,
                  icon: "none",
                });
                reject();
              }
            }
          })
        }
      })
    })
  },
  pushInWifi (wifi = {}) {
    const { BSSID, SSID } = wifi;
    const findIndex = this.data.macInfo.mac.findIndex(v => {
      return v.mac_address === BSSID
    });
    if (findIndex > 0) {
      dmNetwork.getInBackground(
        dmNetwork.mywork,
        {
          team_id: team_id,
          project_id: project_id,
        },
        (res) => {
          var isShowEarlyClock = false;
          var work_type = 0;
          if (res.data.errno == 0) {

          } else {
            wx.showToast({
              title: res.data.errmsg,
              mask: true,
              duration: 1500,
              icon: "none",
            });
          }
        },
        (err) => {
          //网络异常处理
        }
      );
    } else {
      wx.showToast({
        title: "请检查WIFI是否正确！",
        icon: "none",
        duration: 1500,
      });
    }
  },
  onClickSAttendanceItem: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;

    if (currentStatu.attend_time == "") {
      return;
    }
    const item = e.currentTarget.dataset.item;
    if (
      currentStatu.abnormal_reason != undefined &&
      currentStatu.abnormal_reason != ""
    ) {
      item.push({
        title: "异常原因",
        value: currentStatu.abnormal_reason,
        type: "Textarea",
      });
    }

    console.log(currentStatu);
    var that = this;
    wx.setStorage({
      key: "a_extra_info",
      data: mineJobData.attendance.extra_info,
    });
    wx.setStorage({
      key: "attendance_detail",
      data: item,
    });
    wx.setStorageSync(
      "local_project_id",
      that.data.projectData[that.data.index].project_id
    );
    wx.navigateTo({
      url:
        "../dataform/detail/detail?title=打卡详情&team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id +
        "&type=1" +
        "&team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id +
        "&attendance_id=" +
        currentStatu.attendance_id +
        "&form_data_id=" +
        currentStatu.form_data_id +
        "&time_id=" +
        currentStatu.time_id +
        "&task_id=" +
        mineJobData.attendance.extra_info.task_id +
        "&schedule_id=" +
        currentStatu.schedule_id +
        "&cross=" +
        currentStatu.cross +
        "&cross_attend=" +
        currentStatu.cross_attend +
        "&task_id_yesterday=" +
        mineJobData.attendance.extra_info.task_id_yesterday,
    });
  },

  clickAnnouncement: function () {
    wx.navigateTo({
      // url: '../attdance/detail/detail',
      url:
        "../announcement/announcement?team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id,
    });
  },
  //切换项目
  changeProject: function (e) {
    var that = this;
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    that.setData({
      isShowDrainage: false,
      timer: null,
    });
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync(
      "local_project_id",
      that.data.projectData[index].project_id
    );

    wx.setStorageSync("team_id", that.data.projectData[index].team_id);
    wx.setStorageSync("project_id", that.data.projectData[index].project_id);
    wx.setStorageSync(
      "showActivePage",
      that.data.projectData[index].is_recommend_post == 1 ? "show" : "hidden"
    );
    wx.setStorageSync("needRefreshFwork", 1);
    this.getDrainage();
    this.getMyworkInfo(
      that.data.projectData[index].team_id,
      that.data.projectData[index].project_id,
      index
    );
    this.setData({
      index: index,
    });
    this.util("close");
    if (util.compareVersion("1.9.0", wxVeison.SDKVersion) != 1) {
      setTimeout(function () {
        wx.showTabBar({});
      }, 300);
    }
  },
  clickExitProject: function (e) {
    var project_id = e.currentTarget.dataset.project_id;
    wx.navigateTo({
      url: `/pages/uc/apply_quit/apply_quit?project_id=${project_id}`,
    });
    // var team_id = e.currentTarget.dataset.team_id
    // this.checkCouldExit(team_id, project_id)
  },

  onClickCommitData: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(this.data.formData.list);
    console.log(
      "../theform/editreportinfo/editreportinfo?team_id=" +
      this.data.team_id +
      "&project_id=" +
      this.data.project_id +
      "&form_id=" +
      this.data.formData.list[index].id
    );
    wx.navigateTo({
      url:
        "../theform/editreportinfo/editreportinfo?team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id +
        "&form_id=" +
        this.data.formData.list[index].id,
    });
  },
  onClickCommitDataList: function () {
    var that = this;

    wx.navigateTo({
      url:
        "../theform/formrecordlist/formrecordlist?team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id,
    });
  },
  onClickLocationReport: function () {
    console.info("dataform");
    wx.navigateTo({
      url:
        "../position/reprotlist/reportlist?team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id,
    });
  },

  onClickGoWorkItem: function () {
    wx.navigateTo({
      url: "../dataform/detail",
    });
  },
  onClickAfterWorkItem: function () {
    wx.navigateTo({
      url: "../dataform/detail",
    });
  },
  onClickAttendanceDetail: function () {
    wx.navigateTo({
      url:
        "../attdance/detail/detail?team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id,
    });
  },
  onClickUpLoadLocation: function (e) {
    collector.saveFormid(e.detail.formId);
    collector.uploadFormid();

    wx.navigateTo({
      url:
        "../dataform/dataform?type=2&title=填写信息&team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id,
    });
  },
  onClickGoInvite: function () {
    wx.navigateTo({
      url: "../invite/invite?title=微信邀请",
    });
  },
  onClickAttendanceList: function () {
    wx.navigateTo({
      url:
        "../attdance/record/record?team_id=" +
        this.data.team_id +
        "&project_id=" +
        this.data.project_id,
    });
  },
  hidePro: function () {
    this.setData({
      showSignDocumentNums: !this.data.showSignDocumentNums
    })
  },
  onClickSignProtocol: function () {
    if (this.data.is_ocr == 1) {
      wx.showToast({
        title: '请先去"我的"-"我的认证"中进行实名认证',
        icon: "none",
      });
      return
    }
    if (this.data.is_bind_card == 1) {
      wx.showToast({
        title: '请先去"我的"-"我的银行卡"中绑定银行卡',
        icon: "none",
      });
      return
    }
    if (this.data.is_faceliveness == 1) {
      wx.showToast({
        title: '请先去"我的"-"我的活体认证"中进行活体认证',
        icon: "none",
      });
      return
    }
    if (this.data.showNoticeOfSigning && !this.data.canGoSign) {
      return;
    }
    // if (this.data.isShowNewProtocolFlag && !this.data.canGoSign) {
    //   return;
    // }
    // if (this.data.isShowNewProtocolFlag1 && !this.data.canGoSign) {
    //   return;
    // }
    const localProjectId = wx.getStorageSync("local_project_id");
    const localTeamId = wx.getStorageSync("team_id");
    const params = `project_id=${localProjectId}&team_id=${localTeamId}&is_protocol_supplement_info=${this.data.is_protocol_supplement_info}&is_upload_idcard_info=${this.data.is_upload_idcard_info}&is_ocr_check=${this.data.is_ocr_check}`;

    let protocol_order_id = "";
    this.data.protocol_order_ids
      .filter((item) => {
        return item.is_protocol_supplement_info == 1;
      })
      .forEach((element) => {
        protocol_order_id += element.protocol_order_id + ",";
      });
    protocol_order_id = protocol_order_id.substring(
      0,
      protocol_order_id.length - 1
    );
    const navigateUrl = this.data.ifNeedAuthFlag
      ? `../uc/perfect_information/perfect_information?${params}&protocol_order_id=${protocol_order_id}`
      : `../uc/contract_signing_new/contract_signing_new?${params}`;
    // this.setData({
    //   showSignDocumentNums: false,
    // });
    // if (this.data.agreement_num == 1 && this.data.protocol_type == 10) {
    //   navigateUrl = '../uc/notification_book/notification_book?project_id=' + localProjectId + '&team_id=' + localTeamId + '&protocol_order_id=' + this.data.protocol_order_id + '&agreement_num=' + this.data.agreement_num + '&protocol_type=' + this.data.protocol_type;
    // } else if (this.data.agreement_num == 1 && this.data.protocol_type == 13) {
    //   navigateUrl = '../uc/contract_signing_hema_dis/contract_signing_hema_dis?project_id=' + localProjectId + '&team_id=' + localTeamId + '&protocol_order_id=' + this.data.protocol_order_id + '&agreement_num=' + this.data.agreement_num + '&protocol_type=' + this.data.protocol_type;
    // } else {
    //   navigateUrl = '../uc/perfect_information/perfect_information?project_id=' + localProjectId + '&team_id=' + localTeamId + '&protocol_order_id=' + this.data.protocol_order_id + '&agreement_num=' + this.data.agreement_num + '&protocol_type=' + this.data.protocol_type;
    // }
    wx.navigateTo({
      url: navigateUrl,
    });
  },

  //获取导流量按钮是否展示
  getDrainage: function () {
    var that = this;
    dmNetwork.get(
      dmNetwork.get_drainage,
      {
        project_id: wx.getStorageSync("local_project_id"),
        team_id: "0",
      },
      (res) => {
        if (res.data.errno == 0) {
          if (res.data.data.bole_notice == 1) {
            that.setData({
              isShowDrainage: true,
            });
          }
        }
      }
    );
  },

  drainage_cancel: function () {
    console.log("取消点击");
    this.setData({
      isShowDrainage: false,
    });
  },
  clickDrainage: function () {
    console.log("图片点击");

    dmNetwork.get(
      dmNetwork.drainage,
      {
        project_id: "0",
        team_id: "0",
        event_type: "0",
      },
      (res) => { }
    );
    wx.navigateToMiniProgram({
      appId: "wx34b0738d0eef5f78",
      path: "pages/forms/publish?token=Y7b3C5",
      success (res) {
        // 打开成功
        console.log("打开成功");
        dmNetwork.get(
          dmNetwork.drainage,
          {
            project_id: "0",
            team_id: "0",
            event_type: "1",
          },
          (res) => { }
        );
      },
      fail () { },
    });
  },
  // clickDrainage: function () {
  //   console.log('图片点击');

  //   dmNetwork.get(dmNetwork.drainage, { project_id: '0', team_id: '0', event_type: '0' }, (res) => { })
  //   wx.navigateToMiniProgram({
  //     appId: 'wxe1d7b959cd75eae2',
  //     path: 'pages/rmlist/rmlist',
  //     success(res) {
  //       // 打开成功
  //       dmNetwork.get(dmNetwork.drainage, { project_id: '0', team_id: '0', event_type: '1' }, (res) => { })
  //     },
  //     fail() {

  //     }
  //   })
  // },
  trackPV (params) {
    this.track("pv", params);
  },
  trackEV (params) {
    this.track("ev", params);
  },
  track (method, params) {
    console.log("tracking---------------");
    let paramStr = util.json2Form(params);
    let url = `http://analytics.doumi.com/rpo${method == "pv" ? "e" : "c"
      }.gif?${paramStr}`;
    wx.request({
      dataType: "base64",
      url,
    });
  },
  hideTip () {
    this.setData({
      isShowTip: false,
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.setStorageSync("needRefresh", 0);
    localProjectId = wx.getStorageSync("local_project_id");
    this.setData({
      isFormRefresh: true,
    });
    if (
      null != app.globalData.userInfo &&
      app.globalData.userInfo.length != 0
    ) {
      this.getProjectList();
    } else {
      wx.reLaunch({
        url: "../uc/login/login",
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
});
