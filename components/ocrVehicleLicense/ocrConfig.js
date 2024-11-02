export const ocrConfig = {
  ocrType: 2, //0：身份证 1：驾照 2：行驶证 3：其他证件
  cardType: "ocr",
  isShowCarNumber: false, //是否显示车牌号码
  carNumber: "", //车牌号码
  config: {
    title: "我的行驶证",
    detaultFrontCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    detaultBackCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    frontCardText: "上传行驶证正本",
    backCardText: "上传行驶证副页",
    cw: wx.getSystemInfoSync().windowWidth,
    style: {
      font: 'background: url("https://cdn.doumistatic.com/248,022e4ad00ecc0bff.png") no-repeat center bottom;background-size: 100% auto;',
      back: 'background: url("https://cdn.doumistatic.com/250,022e4acf29cbfec5.png") no-repeat center bottom;background-size: 100% auto;',
    },
  },
  remark: "ocr行驶证识别",
  inputInfoConfig: {
    ocrType: 2,
    cardType: "vehicleLicense", //idCard:身份证信息 drivingLicense：驾照信息 vehicleLicense：行驶证信息
    title: "身份信息",
    nameText: "所属人：",
    idCardText: "车牌号码：",
    isShowInputInfo: true,
    remark: "行驶证信息相关信息",
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

export const ocrUploadFile={
  isOcr:true,
  frontCardImg:'vehicle_license_front_file',
  backCardImg:'vehicle_license_back_file',
  ocrUrl:'/sea/api/1.0/client/v1/user/ocr/vehicle_license?dmclient=weixinxcx',
}
