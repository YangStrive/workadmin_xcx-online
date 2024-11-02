export const ocrConfig = {
  ocrType: 3, //0：身份证 1：驾照 2：行驶证 3：其他证件
  cardType: "ocr",
  isShowCarNumber: true, //是否显示车牌号码
  carNumber: "", //车牌号码
  config: {
    title: "其他证件",
    detaultFrontCardImg: "https://cdn.doumistatic.com/214,01d825befd9c9cba.png",
    detaultBackCardImg: "",
    frontCardText: "上传车牌照片",
    backCardText: "",
    cw: wx.getSystemInfoSync().windowWidth,
    style: {
      font: 'background: url("https://cdn.doumistatic.com/253,022e4ace01021d17.png") no-repeat center bottom;background-size: 100% auto;',
      back: '',
    },
  },
  remark: "ocr牌照识别",
  inputInfoConfig: {},
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
  isOcr:false,
  frontCardImg:'',
  backCardImg:'',
  ocrUrl:'',
}