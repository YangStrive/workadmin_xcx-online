// pages/certificate/certificate.js
import getLessLimitSizeImage from "../../utils/compressedImage";
var config = require('../../config.js')
var util = require("../../utils/util.js");
var dmNetwork = require('../../utils/network.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frontCardImg: '',
    backCardImg: '',
    uploadFrontImg: '',
    uploadBackImg: '',
    name: '',
    idCard: '',
    mobile: '',
    isAuth: false,//是否实名认证
    isOcr:false,//是否需要ocr
    agree: false,//是否同意协议
    isPersonInfo:false,//是否需要填写个人信息
    isSubmitAuth:false,
    cw: wx.getSystemInfoSync().windowWidth
  },
  async uploadImg(e) {
    const that = this
    const target = e.currentTarget.dataset.img
    if(target === "frontCardImg"&&that.data.frontCardImg&&!that.data.uploadFrontImg){
      return;
    }
    if(target === "backCardImg"&&that.data.backCardImg&&!that.data.uploadBackImg){
      return;
    }
    // 1.上傳到微信服務器
    const [wxErr,wxData]=await util.awaitWrap(that.wxChooseImage())
    if(wxErr){
      that.toast({title:'微信上传图片失败,请重试!'})
      return
    }
    const tempFilePaths = wxData.tempFilePaths[0]
    wx.showLoading({
      title: "识别中",
      mask: true,
    });
    // 2.压缩图片
    const [zipErr,zipPath]=await util.awaitWrap(that.reduceImage(tempFilePaths,that))
    if(this.data.isOcr){
      // 3.ocr验证
      const [ocrErr,ocrData]=await util.awaitWrap(that.certificationOCR(zipPath,target))
      const newOcrData=JSON.parse(ocrData.data);
      if(newOcrData.errno!=0){
        wx.hideLoading();
        that.toast({title:newOcrData.errmsg})
        return
      }
      // 3.1 获取IdCard的信息，填充到身份信息中
      that.getPersonalInformation(newOcrData)
    }
    // 4.上传到斗米服务器
    const [doumiErr,doumiData]=await util.awaitWrap(that.wxUploadFile(zipPath))
    const newDoumiData = JSON.parse(doumiData.data)
    wx.hideLoading();
    if(newDoumiData.error!=0){
      that.toast({title:newDoumiData.text})
      return
    }
    // 5.获取IdCard图片，展示IdCard
    that.getIDCardimg({target,zipPath,newDoumiData})
  },
  // 压缩图片
  reduceImage(tempFilePaths,that){
    return new Promise((reslove,reject)=>{
      let canvasId = "zipCanvas"; //注意这里的id和你在页面中写的html代码的canvas的id要一致
      let imagePath = tempFilePaths; //原图的路径
      let limitSize = 1024; //大小限制2048kb
      let drawWidth = wx.getSystemInfoSync().windowWidth; //初始绘画区域是画布自身的宽度也就是屏幕宽度
      // 压缩图片
      getLessLimitSizeImage(canvasId,imagePath,limitSize,drawWidth,async (resPath)=>{
        reslove(resPath)
      },that)
    })
    
  },
  // ocr验证
  certificationOCR(zipPath,target){
    // debugger
    return new Promise((reslove,reject)=>{
      if (null != app.globalData.userInfo) {
        let cookie = app.globalData.userInfo.cookie||''
        wx.uploadFile({
          url: config.host+"/sea/api/1.0/client/v1/user/ocr/idcard?dmclient=weixinxcx",
          filePath: zipPath,
          name: target === "frontCardImg" ? "front_image" : "back_image",
          formData: {},
          header: {
            "Content-Type": "multipart/form-data",
            "Cookie": cookie
          },
          success(res) {
            reslove(res)
          },
          fail(err) {
            reject(err)
          }
        })
      }else{
        reject('cookie不存在')
      }
    })
  },
  wxChooseImage(){
    return new Promise((reslove,reject)=>{
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          reslove(res)
        },
        fail(err){
          reject(err)
        }
      })
    })
  },
  wxUploadFile(tempFilePaths){
    return new Promise((reslove,reject)=>{
      // debugger
      wx.uploadFile({
        url: "https://image-inner.doumi.com/upload.php",
        filePath: tempFilePaths,
        name: `uploadfile_ant`,
        formData: {},
        header: {
          "Content-Type": "multipart/form-data",
        },
        success(res) {
          reslove(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  //获取idCard上的信息
  getPersonalInformation(info){
    if(!info.data||info.data.length==0){
      return
    }
    this.setData({
      name:info.data.name,
      idCard:info.data.idcard_number
    })
  },
  //获取idCard图片
  getIDCardimg({target,zipPath,newDoumiData}){
    const that=this;
    if(target === 'frontCardImg'){
      that.setData({
        frontCardImg: zipPath,
        uploadFrontImg: newDoumiData.info[0].url
      })
    }else{
      that.setData({
        backCardImg: zipPath,
        uploadBackImg: newDoumiData.info[0].url
      })
    }
  },
  toast({title,icon='none',duration=2000}){
    wx.showToast({
      title,
      icon,
      duration
    })
  },
  bindInputName(e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name);
  },
  bindInputIdCard(e) {
    this.setData({
      idCard: e.detail.value
    })
    console.log(this.data.idCard);
  },
  changeAgree() {
    this.setData({
      agree: !this.data.agree
    })
  },
  auth() {
    let that = this
    if (!this.data.agree) {
      wx.showToast({
        title: '请勾选条款',
        icon: 'none'
      })
      return
    }
    if (!this.data.frontCardImg) {
      wx.showToast({
        title: '请上传身份证正面照',
        icon: 'none'
      })
      return
    }
    if (!this.data.backCardImg) {
      wx.showToast({
        title: '请上传身份证反面照',
        icon: 'none'
      })
      return
    }
    if (!this.data.name || this.data.name.length < 2) {
      wx.showToast({
        title: '请输入正确的姓名',
        icon: 'none'
      })
      return
    }
    if (!/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(this.data.idCard)) {
      wx.showToast({
        title: '请输入18位的有效身份证',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '认证中',
      mask: true,
    })
    let params = {
      name: that.data.name,
      idnumber: that.data.idCard,
      card_front: that.data.uploadFrontImg,
      card_back: that.data.uploadBackImg
    }
    dmNetwork.post(dmNetwork.auth, params, (res) => {
      if (res.data.errno == 0) {
        wx.hideLoading()
        that.setData({
          isAuth: true,
          isSubmitAuth:false
        })
        wx.showToast({
          title: '认证成功',
          icon: 'none',
          duration: 2000,
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isAuth: options.isAuth === '1' ? true : false,
      isOcr: options.isOcr === '1' ? true : false
    })
    this.getInfo()
  },
  getInfo() {
    dmNetwork.get(dmNetwork.get_auth_info, {}, (res) => {
      if (res.data.errno == 0) {
        const isPersonInfo=this.data.isOcr?true:(res.data.data.real_name&&res.data.data.idnumber)?true:false;
        this.setData({
          frontCardImg: res.data.data.card_front,
          backCardImg: res.data.data.card_back,
          mobile: res.data.data.mobile,
          name: res.data.data.real_name,
          idCard: res.data.data.idnumber,
          isPersonInfo,
          isSubmitAuth:!res.data.data.card_front||!res.data.data.card_back
        })
      }
    })
  },
  goClause() {
    wx.navigateTo({
      url: '../secret_text/secret_text'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})