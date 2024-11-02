
Page({})
Component({
  properties: {
    title: String,
    tip: {
      value: '',
      type: String,
    },
    placeholder: {
      value: '请选择日期',
      type: String,
    },
    required: {
      value: 1,
      type: Number,
    },
    customEvent: String,
    start: {
      value: '',
      type: String,
    },
    end: {
      value: '',
      type: String,
    },
    disabled: {
      value: false,
      type: Boolean,
    },
    requireTime:{
      value: '',
      type: String,
    }
  },
  observers:{
    'disabled':function(disabled){
      if(disabled){
        this.setData({ showPlaceholder: false, date: this.data.requireTime })
      }
    }
  },

  data: {
    // 这里是一些组件内部数据
    showPlaceholder: true,
    date:''
  },
  methods: {
    bindDateChange: function (e) {
      var value = e.detail.value
      this.setData({ showPlaceholder: false, date: value })
      this.triggerEvent(this.data.customEvent, { value: value })
    },
  }
})