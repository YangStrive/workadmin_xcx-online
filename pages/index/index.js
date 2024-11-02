var dmNetwork = require("../../utils/network.js");
var util = require("../../utils/util.js");
Page({
  data: {
    mobile: "",
    ad_list: [],
    fun_list: [],
    banner_list: [],
    weal_list: [],
    is_staff: false,
    is_bind_card: false, // 是否展示弹窗
    isMoreOneDay: true, // 间隔是否是同一天
    count: 0,
    announcementUrl: "", //未读消息url
    wageArea: {},
    isGuide: true,
  },
  onLoad: function () {},
  onShow: function () {
    // wx.removeStorageSync('lock')
    // 先读取时间，再判断是否在同一天内
    const lock = wx.getStorageSync("lock");
    const lockTime = wx.getStorageSync("lockTime");
    console.log("lock====", lock, lockTime);
    if (lock) {
      const diff = (t) => {
        // return (Date.now() - t) > 24 * 3600 * 1000 ? true : false;
        // return (Date.now() - t) > 5 * 60 * 1000 ? true : false;
        const flag = util.formatTimeNew(new Date()) == t;
        return !flag;
      };
      const isMoreOneDay = diff(lock);
      console.log("isMoreOneDay=====", isMoreOneDay);
      this.setData({
        isMoreOneDay: isMoreOneDay,
      });
    }
    this.getInfo();
    this.getnonoticelist();
  },
  goPage(e) {
    try {
      let url = e.currentTarget.dataset.url;
      let type = e.currentTarget.dataset.linktype;
      if (type == 2) {
        if (!this.data.is_staff) {
          wx.showToast({
            title: "只有斗米员工才可参与",
            icon: "none",
            duration: 1500,
          });
        } else {
          let appid = e.currentTarget.dataset.appid;
          wx.navigateToMiniProgram({
            appId: appid,
            path: url,
            extraData: {},
            envVersion: "release",
            success(res) {
              // 打开成功
              that.closeWe();
            },
          });
        }
      } else {
        if (url.startsWith("http")) {
          wx.navigateTo({
            url: "../webview/webview?url=" + url,
          });
        } else {
          wx.navigateTo({
            url: url,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  getInfo() {
    let that = this;
    dmNetwork.get(
      dmNetwork.getIndexInfo,
      {
        dmclient: "weixinxcx",
      },
      (res) => {
        if (res.data.errno == 0) {
          let data = res.data.data;
          that.setData(
            {
              mobile: data.mobile,
              ad_list: data.ad_list,
              fun_list: data.fun_list,
              banner_list: data.banner_list,
              weal_list: data.weal_list,
              is_staff: data.is_staff,
              is_bind_card: data.is_bind_card,
              // is_bind_card: true
            },
            () => {
              this.beginnerGuide();
            }
          );
          if (data.fun_list && data.fun_list.length) {
            let pageUrl = data.fun_list.filter((v) => {
              return v.id == "8";
            });
            that.setData({
              announcementUrl: pageUrl.length ? pageUrl[0].img_link : "",
            });
          }
          if (that.data.is_bind_card && that.data.isMoreOneDay) {
            wx.hideTabBar();
            wx.setStorageSync("lock", util.formatTimeNew(new Date()));
            wx.setStorageSync("lockTime", new Date());
          } else {
            // this.getnonoticelist();
          }
          // else {
          //   console.log('555555')
          //   wx.showTabBar();
          // }
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 1500,
          });
        }
      },
      (err) => {
        console.log("err===", err);
      }
    );
  },
  closeDialog: function () {
    wx.showTabBar();
    this.setData(
      {
        is_bind_card: false,
      },
      () => {
        // this.getnonoticelist();
      }
    );
  },
  closeDialogCount: function () {
    wx.showTabBar();
    this.setData({
      count: 0,
    });
  },
  gotoBind: function () {
    wx.showTabBar();
    wx.navigateTo({
      url: "../bindbankcard/bindbankcard" + "?mobile=" + this.data.mobile,
    });
  },
  //获取未读公告列表
  getnonoticelist: function () {
    var that = this;
    dmNetwork.get(
      dmNetwork.noticelist,
      {
        team_id: 0,
        project_id: 0,
        read: 0,
        offset: 1,
        start: 0,
      },
      (res) => {
        if (res.data.errno == 0 && !!res.data.data.count) {
          // wx.hideTabBar();
          that.setData({
            count: res.data.data.count,
          });
        } else {
          // wx.showTabBar();
          that.setData({
            count: 0,
          });
        }
      }
    );
  },
  goAnnouncement() {
    wx.navigateTo({
      url: this.data.announcementUrl,
    });
  },
  // 新手引导
    // 预支工资引导
  beginnerGuide() {
    return; //下架预支工资、暂停引导
    const that = this;
    const isGuide = wx.getStorageSync("isGuide") || "";
    if (!isGuide) {
      const query = wx.createSelectorQuery();
      query.select("#fun14").boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {
        console.log("ressssss", res);
        const defaultWageArea = {
          bottom: 370,
          height: 80,
          id: "fun14",
          left: 275.25,
          right: 363,
          top: 290,
          width: 87.75,
        };
        wx.hideTabBar();
        that.setData({
          wageArea: res[0] ? res[0] : defaultWageArea,
          isGuide: false,
        });
      });
    } else {
      wx.showTabBar();
    }
  },
  goGuide() {
    wx.setStorageSync("isGuide", true);
    wx.showTabBar();
    this.setData({
      isGuide: true,
    });
  },
  onHide(){}
});
