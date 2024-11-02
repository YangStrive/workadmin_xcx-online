// pages/uc/my_work/my_work.js
var dmNetwork = require("../../../utils/network.js");
var util = require("../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cw: wx.getSystemInfoSync().windowWidth,
    //驾驶证
    driverLicense: {
      value: {
        frontCardImg: "",
        backCardImg: "",
      },
      inputInfoValue: {
        name: "",
        idCard: "",
      },
    },
    //行驶证
    vehicleLicense: {
      value: {
        frontCardImg: "",
        backCardImg: "",
      },
      inputInfoValue: {
        name: "",
        idCard: "",
      },
    },
    //其他车牌号
    carNumber: {
      value: {
        frontCardImg: "",
        backCardImg: "",
      },
      inputInfoValue: {
        name: "",
        idCard: "",
      },
    },
    //其他车牌号
    otherCarNumber:'',
    submitDriverLicense: {
      driver_license_front: "",
      driver_license_back: "",
      driver_license_real_name: "",
      driver_license_no: "",
    },
    submitVehicleLicense: {
      vehicle_license_front: "",
      vehicle_license_back: "",
      license_plate_no: "",
      vehicle_owner: "",
    },
    submitCarNumber: {
      other_license_no: "",
      other_license_image: "",
    },
    isAllUpload:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getInitInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let canvasId =wx.createSelectorQuery().select("#wkl");
    console.log('dddbbbbbbnnnnnn',canvasId);
  },
  //获取驾照相关信息
  getInitInfo: function () {
    dmNetwork.get(
      dmNetwork.driving_license,
      {
        dmclient: "weixinxcx",
      },
      (res) => {
        if (res.data.errno == 0) {
          var data = res.data.data;
          this.data.isAllUpload=this.isAllUpload(data)
          // 组件的显示数据初始化
          const driFrontCardImg = `driverLicense.value.frontCardImg`;
          const driBackCardImg = `driverLicense.value.backCardImg`;
          const driName = `driverLicense.inputInfoValue.name`;
          const driIdCard = `driverLicense.inputInfoValue.idCard`;
          const vehiFrontCardImg = `vehicleLicense.value.frontCardImg`;
          const vehiBackCardImg = `vehicleLicense.value.backCardImg`;
          const vehiName = `vehicleLicense.inputInfoValue.name`;
          const vehiIdCard = `vehicleLicense.inputInfoValue.idCard`;
          const cardNum = `carNumber.value.frontCardImg`;
          //将要提交的数据初始化
          this.data.submitDriverLicense.driver_license_front=data.driver_license_front;
          this.data.submitDriverLicense.driver_license_back=data.driver_license_back;
          this.data.submitDriverLicense.driver_license_real_name=data.driver_license_real_name;
          this.data.submitDriverLicense.driver_license_no=data.driver_license_no;

          this.data.submitVehicleLicense.vehicle_license_front=data.vehicle_license_front;
          this.data.submitVehicleLicense.vehicle_license_back=data.vehicle_license_back;
          this.data.submitVehicleLicense.license_plate_no=data.license_plate_no;
          this.data.submitVehicleLicense.vehicle_owner=data.vehicle_owner;

          this.data.submitCarNumber.other_license_no=data.other_license_no;
          this.data.submitCarNumber.other_license_image=data.other_license_image;
          this.setData({
            [driFrontCardImg]: data.driver_license_front,
            [driBackCardImg]: data.driver_license_back,
            [driName]: data.driver_license_real_name,
            [driIdCard]: data.driver_license_no,
            [vehiFrontCardImg]: data.vehicle_license_front,
            [vehiBackCardImg]: data.vehicle_license_back,
            [vehiName]: data.vehicle_owner,
            [vehiIdCard]: data.license_plate_no,
            [cardNum]: data.other_license_image,
            otherCarNumber:data.other_license_no
          });
        }
      }
    );
  },
  //监听驾照上传
  onOcrDrivingLicense(e) {
    const data = e.detail.data;
    const driver_license_front = `submitDriverLicense.driver_license_front`;
    const driver_license_back = `submitDriverLicense.driver_license_back`;
    const driver_license_real_name = `submitDriverLicense.driver_license_real_name`;
    const driver_license_no = `submitDriverLicense.driver_license_no`;
    if (data.target == "frontCardImg") {
      this.setData({
        [driver_license_front]: data.newDoumiData.info[0].url,
        [driver_license_real_name]:
          data.newOcrData.data.driver_license_real_name,
        [driver_license_no]: data.newOcrData.data.driver_license_no,
      });
    } else {
      this.setData({
        [driver_license_back]: data.newDoumiData.info[0].url,
      });
    }
  },
  //监听行驶证上传
  onOcrVehicleLicense(e) {
    const data = e.detail.data;
    const vehicle_license_front = `submitVehicleLicense.vehicle_license_front`;
    const vehicle_license_back = `submitVehicleLicense.vehicle_license_back`;
    const license_plate_no = `submitVehicleLicense.license_plate_no`;
    const vehicle_owner = `submitVehicleLicense.vehicle_owner`;
    if (data.target == "frontCardImg") {
      this.setData({
        [vehicle_license_front]: data.newDoumiData.info[0].url,
        [vehicle_owner]: data.newOcrData.data.vehicle_owner,
        [license_plate_no]: data.newOcrData.data.license_plate_no,
      });
    } else {
      this.setData({
        [vehicle_license_back]: data.newDoumiData.info[0].url,
      });
    }
  },
  //监听其他车牌号上传
  onOcrCarNumber(e) {
    const { carNumer } = e.detail;
    let otherLicenseNo=this.trim(carNumer)
    const other_license_no = `submitCarNumber.other_license_no`;
    this.setData({
      [other_license_no]: otherLicenseNo || "",
    });
  },
  //监听其他车牌号图片上传
  onOcrCarNumberImg(e) {
    const { data } = e.detail;
    const other_license_image = `submitCarNumber.other_license_image`;
    if (data) {
      this.setData({
        [other_license_image]: data.newDoumiData.info[0].url,
      });
    }
  },
  async submit() {
    var that = this;
    setTimeout(async () => {
      const [driErr, driRes] = await util.awaitWrap(that.validateDri());
      if (!driRes.isPass) {
        this.toast({ title: "驾照相关信息缺失，请确认！" });
        return;
      }
      const [ValiErr, valiRes] = await util.awaitWrap(that.validateVehi());
      if (!valiRes.isPass) {
        that.toast({ title: "行驶证相关信息缺失，请确认！" });
        return;
      }
      if(this.data.submitCarNumber.other_license_no){
        const [carNumErr, carNumRes] = await util.awaitWrap(that.validateOtherCarNum(this.data.submitCarNumber.other_license_no));
        if (!carNumRes) {
          that.toast({ title: "请输入正确的车牌号！" });
          return;
        }
      }
      const [carErr, carRes] = await util.awaitWrap(that.validateCar());
      if (!carRes.isPass) {
        that.toast({ title: "其他证件相关信息缺失，请确认！" });
        return;
      }
      //驾驶证，行驶证，其他证件都没有传
      if (driRes.type && valiRes.type && carRes.type) {
        that.toast({ title: "您还未上传任何证件！" });
        return;
      }
      dmNetwork.post(
        dmNetwork.submit_driver_license_info,
        {
          ...that.data.submitDriverLicense,
          ...that.data.submitVehicleLicense,
          ...that.data.submitCarNumber,
          dmclient: "weixinxcx",
        },
        (res) => {
          console.log(res);
          if (res.data.errno == 0) {
            that.toast({ title: '上传成功'});
            setTimeout(function(){
              wx.navigateBack({
                delta: '1'
              })
            },3000)
            
            
          }else{
            that.toast({ title: res.data.errmsg });
          }
        }
      );
    }, 1000);
  },
  //校验驾照
  validateDri() {
    return new Promise((reslove, reject) => {
      let DriData = this.data.submitDriverLicense;
      const data = this.validateData(DriData);
      reslove(data);
    });
  },
  //校验其他证件
  validateCar() {
    return new Promise((reslove, reject) => {
      let DriData = this.data.submitCarNumber;
      const data = this.validateData(DriData);
      reslove(data);
    });
  },
  //校验行驶证
  validateVehi() {
    return new Promise((reslove, reject) => {
      let DriData = this.data.submitVehicleLicense;
      const data = this.validateData(DriData);
      reslove(data);
    });
  },
  //检验其他车牌号
  validateOtherCarNum(str){
    return new Promise((reslove, reject) => {
      console.log(str);
      // const reg=/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/;
      // const reg=/^[\u4e00-\u9fa5a-zA-Z0-9]{4,10}$/g;
      const reg=/^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
      const isPass=reg.test(str);
      reslove(isPass);
    });
  },
  //校验
  validateData(data) {
    const hasData = Object.values(data).every((res) => {
      return res !== "";
    });
    const noData = Object.values(data).every((res) => {
      return res == "";
    });
    return { isPass: hasData || noData, type: noData ? "noData" : "" };
  },
  //是否全部上传
  isAllUpload(data){
    const driver_license_back=data.driver_license_back;
    const driver_license_front=data.driver_license_front;
    const driver_license_no=data.driver_license_no;
    const driver_license_real_name=data.driver_license_real_name;
    const license_plate_no=data.license_plate_no;
    const other_license_image=data.other_license_image;
    const other_license_no=data.other_license_no;
    const vehicle_license_back=data.vehicle_license_back;
    const vehicle_license_front=data.vehicle_license_front;
    const vehicle_owner=data.vehicle_owner;
    return driver_license_back&&driver_license_front&&driver_license_no&&driver_license_real_name&&license_plate_no&&other_license_image&&other_license_no&&vehicle_license_front&&vehicle_license_back&&vehicle_owner
  },
  //去掉空格
  trim(str){
    const num=str.replace(/\s*/g, '');
    return num;
  },
  toast({ title, icon = "none", duration = 2000 }) {
    wx.showToast({
      title,
      icon,
      duration
    });
  },
  loading({ title, mask = true }) {
    wx.showLoading({
      title,
      mask,
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
