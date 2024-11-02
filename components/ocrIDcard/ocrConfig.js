export const ocrConfig = {
  ocrType: 0, //0：身份证 1：驾照 2：行驶证 3：其他证件
  cardType: "ocr",
  isShowCarNumber: false, //是否显示车牌号码
  carNumber: "", //车牌号码
  config: {
    title: "上传证件照",
    detaultFrontCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    detaultBackCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    frontCardText: "上传身份证正面",
    backCardText: "上传身份证反面",
    cw: wx.getSystemInfoSync().windowWidth,
    style: {
      font: 'background: url("https://cdn.doumistatic.com/217,01d81d35c88087ca.png") no-repeat center bottom;background-size: 100% auto;',
      back: 'background: url("https://cdn.doumistatic.com/228,01d81d38cc83cd1f.png") no-repeat center bottom;background-size: 100% auto;',
    },
  },
  remark: "ocr身份证识别",
  inputInfoConfig: {
    ocrType: 0,
    cardType: "idCard", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息
    title: "身份信息",
    nameText: "姓名",
    idCardText: "身份证",
    isShowInputInfo: true,
    remark: "身份证相关信息",
  },
};
export const ocrInfo = {
  value: {
    frontCardImg: "",
    backCardImg: "",
  },
  inputInfoValue: {
    name: "",
    idCard: "",
  },
};
