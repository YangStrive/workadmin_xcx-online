import { OCR } from "../../utils/ocr";
import { ocrConfig } from "./ocrConfig";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ocrConfig: {
      type: Array,
      value: ocrConfig,
    },
  },
  observers: {},

  /**
   * 组件的初始数据
   */
  data: {
    ocrData: [],
  },
  lifetimes: {
    attached: function () {
      this.setData({
        ocrData: this.data.ocrConfig,
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
      const index = e.currentTarget.dataset.index;
      const item = e.currentTarget.dataset.item;
      const [err, data] = await OCR.uploadImg(e);
      if (err) {
        return;
      }
      console.log("当前的索引", index);
      console.log("当前的选项：", item);
      console.log("ocr识别信息", data);
      for (let i = 0; i < this.data.ocrData.length; i++) {
        if (i == index) {
          this.data.ocrData[i].value[data.target] = data.zipPath;
          break;
        }
      }
      this.setData({ ocrData: this.data.ocrData }, (res) => {
        console.log("dddddddddddddd", this.data.ocrData);
        this.triggerEvent("uploadImg", { data, item });
      });
    },
    getValue(e) {
      const index = e.currentTarget.dataset.index;
      const item = e.currentTarget.dataset.item;
      const { value } = e.detail;
      console.log("当前的索引", index);
      console.log("当前的选项：", item);
      this.triggerEvent("uploadImg", { item, carNumber: value });
    },
  },
});
