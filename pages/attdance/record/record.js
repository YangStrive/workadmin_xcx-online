var dmNetwork = require("../../../utils/network.js");
var util = require("../../../utils/util.js");
// scheduling.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowTag: false,
    hasEmptyGrid: false,
    empytGrids: [],
    endEmpty: [],
    days: [],
    attendanceList: [],
    monthAttendanceStatu: {},
    replacementCardInfo: {
      // 补卡信息
      is_allow_punch: 0,
      task_id: "",
      date: "",
      attendance_id: "",
      attendance_after_id: "",
      isReplacementCard: false,
      startItem: null, // 上班选项
      endItem: null, // 下班选项
      work_time_range: null, // 范围
      startDisabled: false,
      endDisabled: false,
      start_require_time: "",
      end_require_time: "",
      isCurDay: true,
    },
  },
  team_id: "",
  project_id: "",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options = {}) {
    const { team_id, project_id } = options;
    if (team_id && project_id) {
      this.project_id = project_id;
      this.team_id = team_id;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('replacementCardInfo');
    const fromReplaceMentCard = wx.getStorageSync("fromReplaceMentCard"); // 处理打卡成功后返回本页面的逻辑
    if (fromReplaceMentCard) {
      const {
        team_id: replaceMentCardTeamId,
        project_id: replaceMentCardProjectId,
      } = JSON.parse(fromReplaceMentCard);
      this.team_id = replaceMentCardTeamId;
      this.project_id = replaceMentCardProjectId;
      wx.removeStorageSync("fromReplaceMentCard");
    }
    this.onInit();
  },
  onInit: function () {
    const { cur_year, cur_month, cur_date, weeks_ch, currentYM, currentYMD } =
      util.getCurrentYMDHMW();
    const { hasEmptyGrid, empytGrids } = this.calculateEmptyGrids(
      cur_year,
      cur_month
    );
    const { days, endEmpty } = this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      cur_date,
      weeks_ch,
      hasEmptyGrid,
      empytGrids,
      days,
      endEmpty,
      currentYMD,
    });
    this.getMonthStatus(currentYM);
  },
  getMonthStatus: function (month) {
    const { team_id, project_id } = this;
    const params = { team_id, project_id, month };
    dmNetwork.get(
      dmNetwork.attdanceMonthStatus,
      params,
      (res) => {
        const { data } = res.data;
        this.setData({
          isShowTag: true,
          monthAttendanceStatu: data,
        });
        // debugger
        const index = this.data.cur_date - 1; //获取当天的日历信息
        const { task_id, status, has_schedule } = data.status[index];
        if (0 == status) {
          if (1 == has_schedule) {
            this.getDaySchedule(this.data.currentYMD);
          } else {
            this.setData({
              "replacementCardInfo.is_allow_punch": 0,
              attendanceList: [],
            });
          }
        } else {
          this.getDayStatus(this.data.currentYMD, task_id);
        }
      },
      (error) => {}
    );
  },
  getDaySchedule: function (date, task_id) {
    const { team_id, project_id } = this;
    const params = { team_id, project_id, date };
    dmNetwork.get(
      dmNetwork.user_date_schedule,
      params,
      (res) => {
        const { data, errno } = res.data;
        if (errno != 0) {
          this.setData({
            attendanceList: [],
          });
          return;
        }
        data.map((v, i) => {
          v.title =
            i % 2 == 0 ? "上班" : v.cross == 1 ? "下班" + "\t次日" : "下班";
          v.require_time = data[i].time;
          v.form_data = [];
          v.locationData = {};
          if (v.position_info && v.position_info.length > 0) {
            v.hasLocation = true;
            const {
              name: addr_name,
              address: addr,
              coordinate = ",",
            } = v.position_info;
            const lat = coordinate.split(",")[1];
            const lng = coordinate.split(",")[0];
            v.locationData = {
              addr_name,
              addr,
              lat,
              lng,
            };
          }
          return v;
        });

        this.setData({
          "replacementCardInfo.isCurDay": this.data.currentYMD == date,
          attendanceList: data,
        });
      },
      (err) => {}
    );
  },
  getDayStatus: function (date, task_id) {
    const { team_id, project_id } = this;
    const params = { team_id, project_id, date, task_id };
    dmNetwork.get(
      dmNetwork.attdanceDetail,
      params,
      (res) => {
        const { data, errno } = res.data;
        if (errno != 0) {
          this.setData({
            attendanceList: [],
          });
          return;
        }
        for (var i = 0; i < data.attendance_list.length; i++) {
          data.attendance_list[i].task_id = task_id;

          /***********逻辑分割********************************** */
          data.attendance_list[i].isShowNextDay =
            data.attendance_list[i].attend_nextday == 1;

          /***********逻辑分割********************************** */
          if (
            util.getDataType(data.attendance_list[i].action_log) === "Object"
          ) {
            data.attendance_list[i].hasAction = true;
            const statusStr = data.attendance_list[i].action_log.status
              .map((s) => s.name)
              .join("");
            const actionTime = new Date(
              data.attendance_list[i].action_log.action_time * 1000
            );
            data.attendance_list[i].actionText = `${util.formatTime(
              actionTime
            )}${
              data.attendance_list[i].action_log.admin_name
            }将${statusStr}改为正常`;
          }
          /***********逻辑分割********************************** */
          data.attendance_list[i].title =
            i % 2 == 0
              ? "上班"
              : data.attendance_list[i].cross == 1
              ? "下班" + "\t次日"
              : "下班";

          /***********逻辑分割********************************** */
          data.attendance_list[i].hasReason = !!data.abnormal_reason;

          /***********逻辑分割********************************** */
          const formData = data.attendance_list[i].form_data;
          const loIndex = formData.findIndex(({ type }) => type === "Location");
          const imgIndex = formData.findIndex(
            ({ type }) => type === "Imageview"
          );
          data.attendance_list[i].hasLocation = loIndex > -1;
          data.attendance_list[i].locationData =
            loIndex > -1 ? formData[loIndex].value : {};
          data.attendance_list[i].hasImage = imgIndex > -1;
          data.attendance_list[i].images =
            imgIndex > -1 ? formData[imgIndex].value.url.slice(0, 3) : [];
        }

        // 处理补卡信息
        const {
          isReplacementCard,
          attendance_id,
          attendance_after_id,
          is_allow_punch,
          task_id,
          startItem,
          endItem,
          work_time_range,
          startDisabled,
          endDisabled,
          start_require_time,
          end_require_time,
        } = this.handleReplacementCard(data);
        console.log("eeeeeeeeeeeessssssssssssssssss", work_time_range);
        this.setData({
          replacementCardInfo: {
            // 补卡信息
            is_allow_punch,
            task_id,
            date,
            attendance_id,
            attendance_after_id,
            isReplacementCard,
            startItem,
            endItem,
            work_time_range,
            startDisabled,
            endDisabled,
            start_require_time,
            end_require_time,
            isCurDay: this.data.currentYMD == date,
          },
          attendanceList: data.attendance_list,
        });
      },
      (error) => {}
    );
  },
  // 处理补卡需要的信息（只有在缺卡状态才能补卡）
  handleReplacementCard(data) {
    const {
      attendance_list,
      extra_info: { is_allow_punch, task_id, work_time_range },
    } = data;
    let attendance_id,
      attendance_after_id,
      startItem,
      endItem,
      startDisabled,
      endDisabled,
      start_require_time,
      end_require_time,
      startIsReCard,
      endIsReCard,
      paiban_start_time_range,
      paiban_end_time_range;
    const attendanceLen = attendance_list.length == 2; // 目前仅支持一个排班补卡
    attendance_list.forEach((v) => {
      const { type, attendance_id: id, status } = v;
      const statusIndex = status.findIndex(({ value }) => value == 6);
      if (type == 1) {
        attendance_id = id;
        startItem = v;
        startDisabled = statusIndex === -1;
        startIsReCard = statusIndex > -1; //是否需要补卡
        start_require_time = v.attend_time;
        paiban_start_time_range = v.require_time;
      } else if (type == 2) {
        attendance_after_id = id;
        end_require_time = v.attend_time;
        endItem = v;
        endDisabled = statusIndex === -1;
        endIsReCard = statusIndex > -1; //是否需要补卡
        paiban_end_time_range = v.require_time;
      }
    });
    const paiban_time_range =
      work_time_range.length > 0
        ? work_time_range
        : [
            { start: { time: paiban_start_time_range } },
            { end: { time: paiban_end_time_range } },
          ];
    return {
      isReplacementCard: (startIsReCard || endIsReCard) && attendanceLen,
      attendance_id,
      attendance_after_id,
      is_allow_punch,
      task_id,
      work_time_range: paiban_time_range, // 针对排班
      startItem,
      endItem,
      startDisabled,
      endDisabled,
      start_require_time,
      end_require_time,
    };
  },
  // 处理Schedule 情况的补卡
  handleSchedule(attendance_list) {
    let attendance_id,
      attendance_after_id,
      startItem,
      endItem,
      startDisabled,
      endDisabled,
      start_require_time,
      end_require_time,
      startIsReCard,
      endIsReCard;
    attendance_list.forEach((v) => {
      const { type, attendance_id: id, status } = v;
      const statusIndex = status.findIndex(({ value }) => value == 6);
      if (type == 1) {
        attendance_id = id;
        startItem = v;
        startDisabled = statusIndex === -1;
        startIsReCard = statusIndex > -1; //是否需要补卡
        start_require_time = v.attend_time;
      } else if (type == 2) {
        attendance_after_id = id;
        end_require_time = v.attend_time;
        endItem = v;
        endDisabled = statusIndex === -1;
        endIsReCard = statusIndex > -1; //是否需要补卡
      }
    });

    return {
      isReplacementCard: startIsReCard || endIsReCard,
      attendance_id,
      attendance_after_id,
      is_allow_punch,
      task_id,
      work_time_range,
      startItem,
      endItem,
      startDisabled,
      endDisabled,
      start_require_time,
      end_require_time,
    };
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle; //得到 data-handle 值
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === "prev") {
      const newMonth = cur_month == 1 ? 12 : cur_month - 1;
      const newYear = cur_month == 1 ? cur_year - 1 : cur_year;
      const { hasEmptyGrid, empytGrids } = this.calculateEmptyGrids(
        newYear,
        newMonth
      ); //重新计算天数
      const { days, endEmpty } = this.calculateDays(newYear, newMonth); //重新填补空白
      this.getMonthStatus(newYear + "-" + newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        hasEmptyGrid,
        empytGrids,
        days,
        endEmpty,
      });
    } else {
      const newMonth = cur_month == 12 ? 1 : cur_month + 1;
      const newYear = cur_month == 12 ? cur_year + 1 : cur_year;
      const { hasEmptyGrid, empytGrids } = this.calculateEmptyGrids(
        newYear,
        newMonth
      );
      const { days, endEmpty } = this.calculateDays(newYear, newMonth);
      this.getMonthStatus(newYear + "-" + newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        hasEmptyGrid,
        empytGrids,
        days,
        endEmpty,
      });
    }
  },
  clickLocation: function (e) {
    const lData = e.currentTarget.dataset.location;
    const idx = e.currentTarget.dataset.idx;

    var date =
      this.data.cur_year + "-" + this.data.cur_month + "-" + this.data.cur_date;
    var atten = this.data.attendanceList[idx];
    const { team_id, project_id } = this;
    wx.navigateTo({
      url:
        "../address/address?team_id=" +
        team_id +
        "&project_id=" +
        project_id +
        "&attendance_id=" +
        atten.attendance_id +
        "&date=" +
        date +
        "&task_id=" +
        atten.task_id +
        "&lat=" +
        atten.locationData.lat +
        "&lng=" +
        atten.locationData.lng,
    });
  },

  clickDetail: function (e) {
    const item = e.currentTarget.dataset.item;
    if (item.form_data == undefined) {
      return;
    }

    if (item.form_data.length == 0) {
      return;
    }
    wx.setStorage({
      key: "attendance_detail",
      data: item.form_data,
    });
    const { team_id, project_id } = this;
    wx.navigateTo({
      url:
        "../../dataform/detail/detail?title=打卡详情&team_id=" +
        team_id +
        "&project_id=" +
        project_id +
        "with_change=0",
    });
  },
  goReplacementCard: function (e) {
    wx.setStorageSync(
      "replacementCardInfo",
      JSON.stringify(this.data.replacementCardInfo)
    );
    const { team_id, project_id } = this;
    wx.navigateTo({
      url: `/pages/replacementCard/replacementCard?team_id=${team_id}&project_id=${project_id}`,
      events: {},
    });
  },
  getDayAttdance(e) {
    var index = e.currentTarget.dataset.idx;
    const get_year = this.data.cur_year;
    const get_month = this.data.cur_month;
    const get_day = index + 1;
    this.setData({
      cur_date: get_day,
    });
    var task_id = this.data.monthAttendanceStatu.status[index].task_id;
    var task_status = this.data.monthAttendanceStatu.status[index].status;
    if (0 == task_status) {
      if (1 == this.data.monthAttendanceStatu.status[index].has_schedule) {
        this.getDaySchedule(
          get_year + "-" + get_month + "-" + get_day,
          task_id
        );
      } else {
        this.setData({
          replacementCardInfo: {
            // 补卡信息
            is_allow_punch: 0,
            task_id: "",
            date: "",
            attendance_id: "",
            attendance_after_id: "",
            isReplacementCard: false,
            startItem: null, // 上班选项
            endItem: null, // 下班选项
            work_time_range: null, // 范围
            startDisabled: false,
            endDisabled: false,
            start_require_time: "",
            end_require_time: "",
          },
          attendanceList: [],
        });
      }
    } else {
      this.getDayStatus(get_year + "-" + get_month + "-" + get_day, task_id);
    }
  },
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
    });
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = util.getFirstDayOfWeek(year, month); //6
    const lastMonthDays = util.getThisMonthDays(year, month - 1); //31
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(lastMonthDays - firstDayOfWeek + 1 + i); // 前面加空天数
      }
    } else {
      empytGrids = [];
    }
    return {
      hasEmptyGrid: firstDayOfWeek > 0,
      empytGrids,
    };
  },
  calculateDays(year, month) {
    const thisMonthDays = util.getThisMonthDays(year, month); //返回一个月总天数
    const firstDayOfWeek = util.getFirstDayOfWeek(year, month);
    const days = Array.from({ length: thisMonthDays }, (_, i) => i + 1);
    const len = days.length + firstDayOfWeek;
    const endEmpty = Array.from({ length: 42 - len }, (_, i) => i + 1);
    return {
      days,
      endEmpty,
    };
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
});
