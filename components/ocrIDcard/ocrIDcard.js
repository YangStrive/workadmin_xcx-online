import { OCR } from "../../utils/ocr";
import { ocrConfig, ocrInfo } from "./ocrConfig";
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
  observers: {},

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
      const { img, ocrData } = e.currentTarget.dataset;
      if (this.data.ocrInfo.value[img]) {
        return;
      }
      const [err, data] = await OCR.uploadImg(e);
      if (err) {
        return;
      }
      console.log("ocr识别信息", data);
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
            [name]: info.name,
            [idCard]: info.idcard_number,
            [imgUrl]: zipPath,
          },
          (res) => {
            console.log("bbbbbbbbbbbb", this.data.ocrData);
            this.triggerEvent("ocrIDcard", { data });
          }
        );
      } else if (info && target && target == "backCardImg" && zipPath) {
        const imgUrl = `ocrData.value.${target}`;
        this.setData(
          {
            [imgUrl]: zipPath,
          },
          (res) => {
            console.log("bbbbbbbbbbbb", this.data.ocrData);
            this.triggerEvent("ocrIDcard", { data });
          }
        );
      }
    },
  },
});
