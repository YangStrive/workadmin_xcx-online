var util = require("./util.js");
var config = require("../config.js");
import getLessLimitSizeImage from "./compressedImage";
var app = getApp();
/**
 *
 * target:frontCardImg：正面  backCardImg：反面
 * ocrConfig:相关配置
 * @returns
 */
const uploadImg = async function (target, ocrConfig = {}) {
  return await util.awaitWrap(
    new Promise(async (reslove, reject) => {
      target = typeof target === "string" ? target : "";
      if (ocrConfig.isOcr && !target) {
        toast({ title: "请标识出所传图片的正反面！" });
        return;
      }

      // 1.上傳到微信服務器
      const [wxErr, wxData] = await util.awaitWrap(wxChooseImage());
      if (wxErr) {
        toast({ title: "微信上传图片失败,请重试!" });
        return;
      }
      const tempFilePaths = wxData.tempFilePaths[0];
      loading({
        title: "识别中",
        mask: true,
      });
      // 2.压缩图片
      const [zipErr, zipPath] = await util.awaitWrap(
        reduceImage(tempFilePaths, this)
      );
      if (zipErr) {
        toast({ title: "压缩图片失败,请重试!" });
        return;
      }
      let newOcrData = null;
      if (ocrConfig.isOcr) {
        const ocrOptions = {
          name: ocrConfig[target],
          ocrUrl: ocrConfig.ocrUrl,
          isOcr: ocrConfig.isOcr
        };
        // 3.ocr验证
        const [ocrErr, ocrData] = await util.awaitWrap(
          certificationOCR(zipPath, ocrOptions)
        );
        if (ocrErr) {
          hideLoading();
          toast({ title: "ocr识别失败,请重试!" });
          return;
        }
        newOcrData = JSON.parse(ocrData.data);
        if (newOcrData.errno != 0) {
          hideLoading();
          toast({ title: newOcrData.errmsg });
          return;
        }
      }
      // 4.上传到斗米服务器
      const [doumiErr, doumiData] = await util.awaitWrap(wxUploadFile(zipPath));
      const newDoumiData = JSON.parse(doumiData.data);
      hideLoading();
      if (newDoumiData.error != 0) {
        toast({ title: newDoumiData.text });
        return;
      }
      reslove({
        target,
        zipPath,
        newDoumiData,
        newOcrData,
      });
    })
  );
};
const wxChooseImage = function () {
  return new Promise((reslove, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success (res) {
        reslove(res);
      },
      fail (err) {
        reject(err);
      },
    });
  });
};
// 压缩图片
const reduceImage = function (tempFilePaths, that) {
  return new Promise((reslove, reject) => {
    let canvasId = "zipCanvas"; //注意这里的id和你在页面中写的html代码的canvas的id要一致
    let imagePath = tempFilePaths; //原图的路径
    let limitSize = 1024; //大小限制2048kb
    let drawWidth = wx.getSystemInfoSync().windowWidth; //初始绘画区域是画布自身的宽度也就是屏幕宽度
    // 压缩图片
    getLessLimitSizeImage(
      canvasId,
      imagePath,
      limitSize,
      drawWidth,
      async (resPath) => {
        reslove(resPath);
      },
      that
    );
  });
};
// ocr验证
const certificationOCR = function (zipPath, ocrOptions) {
  // debugger
  console.log("ocr相关配置：", ocrOptions);
  return new Promise((reslove, reject) => {
    if (null != app.globalData.userInfo) {
      let cookie = app.globalData.userInfo.cookie || "";
      wx.uploadFile({
        url: config.host + ocrOptions.ocrUrl,
        filePath: zipPath,
        name: ocrOptions.name,
        formData: {},
        header: {
          "Content-Type": "multipart/form-data",
          Cookie: cookie,
        },
        success (res) {
          reslove(res);
        },
        fail (err) {
          reject(err);
        },
      });
    } else {
      reject("cookie不存在");
    }
  });
};
const wxUploadFile = function (tempFilePaths) {
  return new Promise((reslove, reject) => {
    // debugger
    wx.uploadFile({
      url: "https://image-inner.doumi.com/upload.php",
      filePath: tempFilePaths,
      name: `uploadfile_ant`,
      formData: {},
      header: {
        "Content-Type": "multipart/form-data",
      },
      success (res) {
        reslove(res);
      },
      fail (err) {
        reject(err);
      },
    });
  });
};
const toast = function ({ title, icon = "none", duration = 2000 }) {
  wx.showToast({
    title,
    icon,
    duration,
  });
};
const loading = function ({ title, mask = true }) {
  wx.showLoading({
    title,
    mask,
  });
};
const hideLoading = function () {
  wx.hideLoading();
};
export const OCR = {
  wxChooseImage,
  reduceImage,
  certificationOCR,
  wxUploadFile,
  uploadImg,
  toast,
  loading,
  hideLoading
};
