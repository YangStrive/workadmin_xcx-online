
let app = getApp()
Page({})
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title:String,
    tip:String,
    placeholder:{type:String,value:'请在此输入'},
    type:String,
    required: Number,
    customEvent:String,
    value: String,
    confirmType: {
      type: String,
      value: 'done'
    },
    isscan:{
      type:String,
      value:'false'
    }
    
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    inputValue:'',
    isscan:'',
  },
  methods: {
    // 这里是一个自定义方法
    inputChange:function(e){
      var value = e.detail.value;
      value=value.replace(/\s*/g,"");
      console.log('newrusultnewrusultnewrusult',value);
      this.triggerEvent(this.data.customEvent,{value:value})
    },
    onScanCode:function(){
      var that = this;
      wx.scanCode({ 
        success: function (res) {
          that.doSanCode(res.result)
        },
        fail:function(){
          wx.showToast({title:'扫码失败',icon:'none'})
        }
      })
    },
    doSanCode: function (rusult){
      var newrusult;
      if (rusult.indexOf(',') > 0) {
        newrusult = rusult.split(",")[1]
      } else {
        let str = 'http://www.mobike.com/download/app.html'
        let isContains = new RegExp(str).test(rusult)
        if (isContains) {
          let beginIndex = rusult.indexOf('=')
          let endIndex = rusult.indexOf('_')
          newrusult = rusult.substring(beginIndex + 1, endIndex)
        } else {
          newrusult = rusult; // 当needResult 为 1 时，扫码返回的结果
        }
      }
      this.setData({ inputValue: newrusult })
      this.triggerEvent(this.data.customEvent, { value: newrusult })
    }
  }
})