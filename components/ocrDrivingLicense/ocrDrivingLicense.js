import { OCR } from "../../utils/ocr";
import { ocrConfig, ocrInfo, ocrUploadConfig } from "./ocrConfig";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ocrConfig: {
      type: Object,
      value: ocrConfig,
    },
    ocrInfo: {
      type: Object,
      value: ocrInfo,
    },
  },
  observers: {
    "ocrInfo.value": function (newValue) {
      if (newValue.frontCardImg) {
        const frontCardImg = `ocrData.value.frontCardImg`;
        this.setData({
          [frontCardImg]: newValue.frontCardImg,
        });
      }
      if (newValue.backCardImg) {
        const backCardImg = `ocrData.value.backCardImg`;
        this.setData({
          [backCardImg]: newValue.backCardImg,
        });
      }
    },
    "ocrInfo.inputInfoValue": function (newInputInfoValue) {
      if (newInputInfoValue.name) {
        const name = `ocrData.inputInfoValue.name`;
        this.setData({
          [name]: newInputInfoValue.name,
        });
      }
      if (newInputInfoValue.idCard) {
        const idCard = `ocrData.inputInfoValue.idCard`;
        this.setData({
          [idCard]: newInputInfoValue.idCard,
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    ocrData: {},
  },
  lifetimes: {
    attached: function () {
      this.data.ocrData = JSON.parse(
        JSON.stringify({ ...this.data.ocrConfig, ...this.data.ocrInfo })
      );
      this.setData({
        ocrData: this.data.ocrData,
      });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async uploadImg(e) {
      const { img } = e.currentTarget.dataset;
      if (this.data.ocrInfo.value[img]) {
        return;
      }
      const [err, data] = await OCR.uploadImg(img, ocrUploadConfig);
      if (err) {
        OCR.toast({ title: "上传图片失败，请重试！" });
        return;
      }
      this.handleInfo(data);
    },
    //处理信息
    handleInfo(data) {
      const info = data.newOcrData.data;
      const target = data.target;
      const zipPath = data.zipPath;
      if (info && target && target == "frontCardImg" && zipPath) {
        const name = `ocrData.inputInfoValue.name`;
        const idCard = `ocrData.inputInfoValue.idCard`;
        const imgUrl = `ocrData.value.${target}`;
        this.setData(
          {
            [name]: info.driver_license_real_name,
            [idCard]: info.driver_license_no,
            [imgUrl]: zipPath,
          },
          (res) => {
            this.triggerEvent("ocrDrivingLicense", { data });
          }
        );
      } else if (info && target && target == "backCardImg" && zipPath) {
        const imgUrl = `ocrData.value.${target}`;
        this.setData(
          {
            [imgUrl]: zipPath,
          },
          (res) => {
            this.triggerEvent("ocrDrivingLicense", { data });
          }
        );
      }
    },
  },
});
