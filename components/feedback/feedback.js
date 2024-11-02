// components/feedback/feedback.js
var dmNetwork = require('../../utils/network.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showFeedback: {
      value: true,
      type: Boolean
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectType:0,
    detail:'',
    detail_len:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    textareaChange(e){
      this.setData({
        detail:e.detail.value,
        detail_len: e.detail.value.length
      })
    },
    selectType(e){
      this.setData({
        selectType: e.currentTarget.dataset.type
      })
    },
    closeThis(e){
      this.setData({
        showFeedback:false,
        selectType:0,
        detail:'',
        detail_len:0
      })
    },
    commitFeedBack(e){
      if (this.data.selectType == 0 && this.data.detail_len == 0){
       
        return
      }
      var data = wx.getSystemInfoSync()

      var d = wx.getExtConfigSync()
      var app = getApp()
  
      dmNetwork.post(dmNetwork.location_feedback,{
        source:1,
        wx_version: data.version,
        phone_model: data.model,
        client_version: app.getVersion(),
        type: this.data.selectType,
        content: this.data.detail
      },(res)=>{
        if(res.data.errno == 0){
          wx.showToast({
            title: '您的反馈已收到，我们会尽快处理',
            icon:'none'
          })
          this.setData({
            showFeedback:false,
            selectType: 0,
            detail: '',
            detail_len: 0
          })
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      },(err)=>{
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      })
    }
  }
})
