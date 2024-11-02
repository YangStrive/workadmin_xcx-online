
Page({})
Component({
  properties: {
    confirmText:{
      type:String,
      value:'提交'
    },
    customEvent:String,
    disabled:{
      type:Boolean,
      value:false,
    }
  },
  data: {
    // 这里是一些组件内部数据
    showPlaceholder: true,
  },
  methods: {
    bindConfirm: function () {
      if (!this.data.disabled) {
        this.triggerEvent(this.data.customEvent)
      }
    },
  }
})