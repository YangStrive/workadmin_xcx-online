//微信小程序模板js

var util = require("../../utils/util.js");
var dmNetwork = require("../../utils/network.js");
var collector = require("../../utils/collector.js");
var wxVeison = wx.getSystemInfoSync();

var mineJobData = {};
Page({
  data: {
    // 页面配置
    projectData: [],
    isShowNoWork: false,
    isShowAtten: false,
    attendances: [],
    showModalStatus: false,
    projectNameArray: {},
    //当前项目id
    currentProjectId: 0,
    currentTeamId: 0,

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数,
    //获取项目id
    this.getProjectList();
  },
  onShow: function () {
    // 页面显示
  },

  getProjectList: function () {
    var that = this;
    dmNetwork.getInBackground(
      dmNetwork.proJectList,
      { team_id: 0, status: 1 },
      (res) => {
        if (res.data.errno == 0) {

          if (res.data.data.list.length > 0) {
            var projectNameList = {};
            
            for (var i = 0; i < res.data.data.list.length; i++) {
              if(this.data.currentProjectId == 0){
                this.setData({
                  currentProjectId: res.data.data.list[i].project_id,
                  currentTeamId: res.data.data.list[i].team_id,
                });
              }
              projectNameList[res.data.data.list[i].project_id] ={
                logo: res.data.data.list[i].logo,
                name: res.data.data.list[i].name,
                project_id: res.data.data.list[i].project_id,
                team_id: res.data.data.list[i].team_id,
              };
            }
            that.setData({
              projectData: res.data.data.list,
              projectNameArray: projectNameList,
            });

            if (that.data.currentProjectId) {
              that.getMyworkInfo();
            }
          } else {
          }
        } else if (res.data.errno == 104) {
          wx.reLaunch({
            url: "../uc/login/login",
          });
        }
      },
      (err) => {
        //网络异常处理
        this.setData({
          isShowNetWorkError: true,
        });
      }
    );
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
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

  //切换项目
  changeProject: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentProjectId: that.data.projectData[index].project_id,
      currentTeamId: that.data.projectData[index].team_id,
    });
    this.getMyworkInfo();
    this.util("close");
    if (util.compareVersion("1.9.0", wxVeison.SDKVersion) != 1) {
      setTimeout(function () {
        wx.showTabBar({});
      }, 300);
    }
  },

  //获取今日工作数据
  getMyworkInfo: function () {
    var that = this;
    var project_id = this.data.currentProjectId;
    var team_id = this.data.currentTeamId;
    dmNetwork.getInBackground(
      dmNetwork.mywork,
      {
        team_id,
        project_id,
      },
      (res) => {
        var isShowEarlyClock = false;
        if (res.data.errno == 0) {
          mineJobData = res.data.data;
          const {
            attendance: {
              extra_info: { task_id, work_type },
              attendance_list,
            } = {},
            form: { show } = {},
            sign: { show: signShow, list: signList } = {},
          } = mineJobData;
          const hasWork = task_id != -1 || show == 1 || signShow == 1;
          const alist = attendance_list;
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
            attendance.attendance_btn = alist[i].attendance_btn;
            attendance.rest_btn = alist[i].rest_btn;
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
          const cLocationTime = signList.length
            ? util.formatTimeHM(new Date(1000 * parseInt(signList[0].time)))
            : "";
          that.setData({
            minejob: res.data.data,
            isShowNoWork: !hasWork,
            isShowAtten: -1 != mineJobData.attendance.extra_info.task_id,
            attendances: aresult,
            project_id: project_id,
            currentProjectId: project_id,
            team_id: team_id,
            group_id: res.data.data.group_id,
            formData: res.data.data.form,
            cLocationTime,
            isShowNote: 0 < mineJobData.notice,
            ["macInfo.mac"]: mineJobData.attendance.extra_info.mac || [],
            ["macInfo.is_allow_punch"]:
              mineJobData.attendance.extra_info.is_allow_punch || 0,
            ["macInfo.punch_type"]:
              mineJobData.attendance.extra_info.punch_type || 0,
              has_change_store:res.data.data.has_change_store
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


 
  onClickSAttendanceItem: async function (e) {
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

    let mac_address = "";
    if (that.data.macInfo.punch_type == 1) {
      const res = await that.getWifiInfo();
      mac_address = res.mac_address;
    }
    console.log("macccc", mac_address);
    // return
    wx.navigateTo({
      url:
        "../dataform/detail/detail?title=打卡详情&team_id=" +
        this.data.team_id +
        "&mac_address=" +
        mac_address +
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

  //休息打卡
  handleClickBeginRestBtn:function(e) {
    var that = this;
    collector.saveFormid(e.detail.formId);
    collector.uploadFormid();
    var currentStatu = e.currentTarget.dataset.statu;
    let mac_address = "";
    wx.setStorage({
      key: "a_extra_info",
      data: mineJobData.attendance.extra_info,
      success: async (stora) => {
        
        if (that.data.macInfo.punch_type == 1) {
          console.log("asdfffffffffffffffffffff");
          const res = await that.getWifiInfo();
          console.log("maccccccccccccccccccccc", res);
          mac_address = res.mac_address;
        }
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
            1 + 
            "&clockInType=" + 'rest',
        });
      },
      fail: function () {
        console.error("存储token时失败");
      },
    });

  },

   //上下班打卡
  onClickSAttendanceBtn: function (e) {
    console.log("onClickSAttendanceBtn", e);
    var that = this;
    collector.saveFormid(e.detail.formId);
    collector.uploadFormid();
    var currentStatu = e.currentTarget.dataset.statu;
    let mac_address = "";
    wx.setStorage({
      key: "a_extra_info",
      data: mineJobData.attendance.extra_info,
      success: async (stora) => {
        if (that.data.macInfo.punch_type == 1) {
          console.log("asdfffffffffffffffffffff");
          const res = await that.getWifiInfo();
          console.log("maccccccccccccccccccccc", res);
          mac_address = res.mac_address;
        }
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

  onClickAttendanceList: () => {
    wx.navigateTo({
      url: '/pages/attendanceList/attendanceList',
    })
  },



});