var dmNetwork = require('../../utils/network.js')
var app = getApp()
let timeoutFn=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getcodetext:'',
    sendPhNum:'',
    mobile:'',
    codeSw:true,
    timeout: 60,
    name:'',
    bank:'',
    number:'',
    code:'',
    real_name_auth:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mobile = options.mobile || '';
    if(this.mobile != ''){
      this.setData({
        sendPhNum: this.mobile.substr(0,3) + "****" + this.mobile.substr(7),
      })
    }
    this.getuserinfofromsaas();
  },
  getCode: function() {
    let that = this;
    dmNetwork.post(dmNetwork.getBindBankCardCode, {mobile:this.mobile}, (res) => {
      if (res.data.errno != 0) {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
        that.setData({
          codeSw: false,
          getcodetext: '60s后重试'
        })
        that.counttime()

      }
      
    })
  },
  counttime: function() {
    let that = this;
    timeoutFn = setTimeout(function() {
      if (that.data.timeout > 0) {
        that.setData({
          codeSw: false,
          getcodetext: --that.data.timeout + 's后重试'
        })
        that.counttime()
      } else {
        that.setData({
          codeSw: true,
          getcodetext: '获取验证码'
        })
      }
    }, 1000)
  },
  bindBankCard:function(){
    if(this.data.name == ''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    if(this.data.number == ''){
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
      return;
    }
    if(this.data.bank == ''){
      wx.showToast({
        title: '请输入开户行',
        icon: 'none'
      })
      return;
    }
    if(this.data.code == ''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    if(!this.data.real_name_auth){
      wx.showToast({
        title: '请先去【我的工作】完成签约和实名认证',
        icon: 'none'
      })
      return;
    }
    dmNetwork.post(
      dmNetwork.bindBankCard, 
      {
        bank_card_number:this.data.number,
        bank_info:this.data.bank,
        code:this.data.code,
        name:this.data.name
      }, 
    (res) => {
      console.log(res)
      if (res.data.errno != 0) {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '绑定成功',
          icon: 'none'
        })
        setTimeout(()=>{
          wx.switchTab({  
            url:'../uc/account/account'  
          });  
        },1000)
      }
    })
  },
  nameChage:function(e){    
    this.setData({
      name: e.detail.value
    })
  },
  codeChange:function(e){    
    this.setData({
      code: e.detail.value
    })
  },
  numberChange:function(e){    
    let value = this.validateNumber(e.detail.value);
    this.setData({
      number: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  bankChange:function(e){    
    this.setData({
      bank: e.detail.value
    })
  },
  //获取用户信息
  getuserinfofromsaas: function () {
    return new Promise((reslove, reject) => {
      dmNetwork.get(
        dmNetwork.getuserinfo,
        {},
        (res) => {
          console.log("个人信息" + JSON.stringify(res));
          if (res.data.errno == 0) {
            this.setData({
              name:res.data.data.real_name_auth?res.data.data.real_name:'',
              real_name_auth:res.data.data.real_name_auth
            })
            reslove(res.data.data.real_name_auth?res.data.data.real_name:'');
          }
        },
        (err) => {
          //网络异常处理
        }
      );
    });
    var that = this;
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