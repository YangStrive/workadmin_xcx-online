
Page({})
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: String,
    tip: String,
    placeholder: {
      value: '请选择',
      type: String,
    },
    type: String,
    required: Number,
    customEvent: String,
    start: String,//开始时间
    end: String,//结束时间
    fields: {
      value: 'day',
      type: String,
    },
    disabled: {
      value: false,
      type: Boolean,
    },
    selectData:Array
  },
  data: {
    // 这里是一些组件内部数据
    showPlaceholder: true,
  },
  methods: {
    bindSelectChange: function (e) {
      var value = e.detail.value
      this.setData({ showPlaceholder: false, date: this.data.selectData[value] })
      this.triggerEvent(this.data.customEvent, { value: this.data.selectData[value], index: value })
    },
  }
})