
Page({})
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: String,
    tip: String,
    placeholder: {type:String,value:'请输入文本'},
    required: Number,
    customEvent: String,
    value: String,
    showTextareaLength:{
      type:Boolean,
      value:true,
    },
    maxlength:{
      type:Number,
      value:200
    }

  },
  data: {
    // 这里是一些组件内部数据
    textareaLength:0,
    len:''
  },
  methods: {
    // 这里是一个自定义方法
    textareaChange: function (e) {
      // console.log('eiiiiii',this.data.customEvent)
      var value = e.detail.value;
      if(value.length>this.data.maxlength){
        return
      }
      this.setData({textareaLength: value?.length,len:value})
      this.triggerEvent(this.data.customEvent, { value: value })
    }
  }
})