import { OCR } from "../../utils/ocr";
import { ocrConfig, ocrInfo, ocrUploadFile } from "./ocrConfig";
/*函数防抖*/
const debounce = function (fn, interval) {
  var timer;
  var gapTime = interval || 100; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
};
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
    carNumber:{
      type:String,
      value:''
    }
  },
  observers: {
    "ocrInfo.value": function (newValue) {
      if (newValue.frontCardImg) {
        const frontCardImg = `ocrData.value.frontCardImg`;
        this.setData({
          [frontCardImg]: newValue.frontCardImg,
        });
      }
    },
    "carNumber": function (newValue) {
      if (newValue) {
        const carNumber = `ocrData.carNumber`;
        this.setData({
          [carNumber]: newValue,
        });
      }
    }
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
      const { img, ocrData } = e.currentTarget.dataset;
      if (this.data.ocrInfo.value[img]) {
        return;
      }
      const [err, data] = await OCR.uploadImg(img, ocrUploadFile);
      if (err) {
        return;
      }
      this.handleInfo(data);
    },
    //处理信息
    handleInfo(data) {
      const target = data.target;
      const zipPath = data.zipPath;
      if (target && target == "frontCardImg" && zipPath) {
        const imgUrl = `ocrData.value.${target}`;
        this.setData(
          {
            [imgUrl]: zipPath,
          },
          (res) => {
            this.triggerEvent("ocrCarNumberImg", { data });
          }
        );
      }
    },
    //处理车牌号
    getCardNumber: debounce(function (e) {
      console.log("nnnn", e[0]);
      const carNumer = e[0].detail.value;
      this.triggerEvent("ocrCarNumber", { carNumer });
    }),
  },
});
