export const ocrConfig = [
  {
    ocrType: 0, //0：身份证 1：驾照 2：行驶证 3：其他证件
    cardType: "uploadImg",
    isShowCarNumber: false, //是否显示车牌号码
    carNumber: "", //车牌号码
    config: {
      title: "上传证件照",
      detaultFrontCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      detaultBackCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      frontCardText: "上传身份证正面",
      backCardText: "上传身份证反面",
      cw: wx.getSystemInfoSync().windowWidth,
      style: {
        font: 'background: url("https://cdn.doumistatic.com/217,01d81d35c88087ca.png") no-repeat center bottom;',
        back: 'background: url("https://cdn.doumistatic.com/228,01d81d38cc83cd1f.png") no-repeat center bottom;',
      },
    },
    value: {
      frontCardImg: "",
      backCardImg: "",
    },
    remark: "ocr身份证识别",
    inputInfo: {
      pOcrType: 0,
      cardType: "idCard", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息
      config: {
        title: "身份信息",
        nameText: "姓名",
        idCardText: "身份证",
      },
      value: {
        name: "",
        idCard: "",
      },
      isShowInputInfo: true,
      remark: "身份证相关信息",
    },
  },
  {
    ocrType: 1, //0：身份证 1：驾照 2：行驶证 3：其他证件
    cardType: "uploadImg",
    isShowCarNumber: false, //是否显示车牌号码
    carNumber: "", //车牌号码
    config: {
      title: "我的驾照",
      detaultFrontCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      detaultBackCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      frontCardText: "上传驾驶证正本",
      backCardText: "上传驾驶证副页",
      cw: wx.getSystemInfoSync().windowWidth,
      style: {
        font: 'background: url("https://cdn.doumistatic.com/217,01d81d35c88087ca.png") no-repeat center bottom;',
        back: 'background: url("https://cdn.doumistatic.com/228,01d81d38cc83cd1f.png") no-repeat center bottom;',
      },
    },
    value: {
      frontCardImg: "",
      backCardImg: "",
    },
    remark: "ocr驾照识别",
    inputInfo: {
      pOcrType: 1,
      cardType: "drivingLicense", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息
      config: {
        title: "身份信息",
        nameText: "真实姓名：",
        idCardText: "身份证号：",
      },
      value: {
        name: "",
        idCard: "",
      },
      isShowInputInfo: true,
      remark: "驾照信息相关信息",
    },
  },
  {
    ocrType: 2, //0：身份证 1：驾照 2：行驶证 3：其他证件
    cardType: "uploadImg",
    isShowCarNumber: false, //是否显示车牌号码
    carNumber: "", //车牌号码
    config: {
      title: "我的行驶证",
      detaultFrontCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      detaultBackCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      frontCardText: "上传行驶证正本",
      backCardText: "上传行驶证副页",
      cw: wx.getSystemInfoSync().windowWidth,
      style: {
        font: 'background: url("https://cdn.doumistatic.com/217,01d81d35c88087ca.png") no-repeat center bottom;',
        back: 'background: url("https://cdn.doumistatic.com/228,01d81d38cc83cd1f.png") no-repeat center bottom;',
      },
    },
    value: {
      frontCardImg: "",
      backCardImg: "",
    },
    remark: "ocr行驶证识别",
    inputInfo: {
      pOcrType: 2,
      cardType: "vehicleLicense", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息
      config: {
        title: "身份信息",
        nameText: "所属人：",
        idCardText: "车牌号码：",
      },
      value: {
        name: "",
        idCard: "",
      },
      isShowInputInfo: true,
      remark: "行驶证信息",
    },
  },
  {
    ocrType: 3, //0：身份证 1：驾照 2：行驶证 3：其他证件
    cardType: "uploadImg",
    isShowCarNumber: true, //是否显示车牌号码
    carNumber: "", //车牌号码
    config: {
      title: "其他证件",
      detaultFrontCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      detaultBackCardImg:
        "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
      frontCardText: "上传车牌照片",
      backCardText: "上传车牌照片",
      cw: wx.getSystemInfoSync().windowWidth,
      style: {
        font: 'background: url("https://cdn.doumistatic.com/217,01d81d35c88087ca.png") no-repeat center bottom;',
        back: 'background: url("https://cdn.doumistatic.com/228,01d81d38cc83cd1f.png") no-repeat center bottom;',
      },
    },
    value: {
      frontCardImg: "",
      backCardImg: "",
    },
    remark: "ocr其他证件识别",
    inputInfo: {
      pOcrType: 3,
      cardType: "carNumber", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息 carNumber:其他证件信息
      config: {},
      value: {
        name: "",
        idCard: "",
      },
      isShowInputInfo: false,
      remark: "其他证件信息",
    },
  },
];
