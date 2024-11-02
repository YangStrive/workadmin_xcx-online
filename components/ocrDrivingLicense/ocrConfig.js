export const ocrConfig = {
  ocrType: 1, //0：身份证 1：驾照 2：行驶证 3：其他证件
  cardType: "ocr",
  isShowCarNumber: false, //是否显示车牌号码
  carNumber: "", //车牌号码
  config: {
    title: "我的驾照",
    detaultFrontCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    detaultBackCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    frontCardText: "上传驾驶证正本",
    backCardText: "上传驾驶证副页",
    cw: wx.getSystemInfoSync().windowWidth,
    style: {
      font: 'background: url("https://cdn.doumistatic.com/251,022e4aca53d459fb.png") no-repeat center bottom;background-size: 100% auto;',
      back: 'background: url("https://cdn.doumistatic.com/251,022e4ac95a2d7fff.png") no-repeat center bottom;background-size: 100% auto;',
      other:
        'background: url("https://cdn.doumistatic.com/253,022e4ace01021d17.png") no-repeat center bottom;background-size: 100% auto;',
    },
  },
  remark: "ocr驾照识别",
  inputInfoConfig: {
    ocrType: 1,
    cardType: "drivingLicense", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息
    title: "身份信息",
    nameText: "真实姓名：",
    idCardText: "身份证号：",
    isShowInputInfo: true,
    remark: "驾照信息相关信息",
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

export const ocrUploadConfig={
  isOcr:true,
  frontCardImg:'driver_license_front_file',
  backCardImg:'driver_license_back_file',
  ocrUrl:'/sea/api/1.0/client/v1/user/ocr/driver_license?dmclient=weixinxcx',
}
