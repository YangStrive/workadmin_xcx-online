
var fetch = require('../../utils/fetch.js'); // 引入外部包
var dmNetwork = require('../../utils/network.js')
var dmUtil = require('../../utils/util.js')
Page({})
Component({
  ready: function () {
    if (this.data.sourceType) {
      this.setData({ sourceType2: [this.data.sourceType] })
    } else {
      this.setData({ sourceType2: ['album', 'camera'] })
    }
    if (this.data.autoLocation) {
      this.againLocation()
    }
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: String,
    tip: String,
    placeholder: {
      value: '请输入',
      type: String,
    },
    imgMin: {
      type: Number,
      value: 0
    },
    sourceType: String,
    sourceType2: Array,
    type: String,
    required: Number,
    sampleImg:Array,
    customEvent: String,
    showPlaceholder: {
      type: Boolean,
      value: false
    },
  },
  data: {
    // 这里是一些组件内部数据
    showPlaceholder: true,
    files: [],
    upImg:[],
  },
  methods: {
    chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: that.data.sourceType2, // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          wx.showLoading({
            title: '上传中',
            mask:true,
          })          
          that.setData({
            files: that.data.files.concat(res.tempFilePaths),
          });
          var count = 0
          for (var i = 0, h = res.tempFilePaths.length; i < h; i++) {
            
            dmNetwork.upload(res.tempFilePaths[i], 'uploadfile_ant', {},
              function (resData) {
                count ++
                if (count == res.tempFilePaths.length) {
                  wx.hideLoading()
                }
                that.setData({ 
                  upImg: that.data.upImg.concat(resData[0]),
                  })
                that.triggerEvent(that.data.customEvent, { value:that.data.upImg})
              }, function (res) {
                count ++
                if (count == res.tempFilePaths.length){
                  wx.hideLoading()
                }
                
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                })
                that.setData({
                  files: [],
                });
              })
          }
        }
      })
    },
    omPreviewImage: function (ev) {
      dmUtil.previewImage([ev.currentTarget.dataset.imgvalue]);
    },
    imgYu: function (event) {
      var src = event.currentTarget.dataset.src;//获取data-src
      var imgList = event.currentTarget.dataset.list;//获取data-list

      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      })
    },
    onDeleteImg:function(ev){
      var imgIndex = ev.currentTarget.dataset.imgindex;
      this.data.files.splice(imgIndex, 1)
      this.data.upImg.splice(imgIndex, 1)
      this.setData({
        files: this.data.files,
        upImg: this.data.upImg
      });
      console.log(this.data.files, 'files')
      this.triggerEvent(this.data.customEvent, { value: this.data.upImg })
    }
  }
})