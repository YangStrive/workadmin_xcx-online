// pages/position/reportdetail/reportdetail.js
var nick_name;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    markers: [{
      iconPath: "http://cdn.doumistatic.com/62,8bcf5d10662105.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    nick_name = options.nick_name

    wx.getStorage({
      key: 'sign_data',
      success: function(res) {
        console.log(res.data)
        var detailText = ''
        var imageUrl = ''
        for (var i = 0; i < res.data.form_data.length;i++){
          
          if (res.data.form_data[i].type != 'Imageview' && res.data.form_data[i].type != 'Location' && detailText == ''){
            detailText = res.data.form_data[i].title + ':' + res.data.form_data[i].value

          }
          if (res.data.form_data[i].type == 'Imageview' && res.data.form_data[i].value.url.length>0){
            imageUrl = res.data.form_data[i].value.url[0]
          }
          var address
          if (res.data.form_data[i].type == 'Location') {
            address = res.data.form_data[i].value.addr_name + '(' + res.data.form_data[i].value.addr+')'
          }
        } 
       
        that.setData({
          detailData: res.data,
          imageUrl: imageUrl,
          address: address,
          markers: [{
            iconPath: "../../../image/marker.png",
            id: 0,
            latitude: res.data.lvalue.lat,
            longitude: res.data.lvalue.lng,
            width: 30,
            height:42
          }],
          nick_name: nick_name,
          longitude: res.data.lvalue.lng,
          latitude: res.data.lvalue.lat,
          detailText: detailText
        })
      },
    })
  },
  clickDetail:function(e){
    const item = e.currentTarget.dataset.form_data;
    console.log(item)
    wx.setStorage({
      key: 'attendance_detail',
      data: item,
    })
    wx.navigateTo({
      url: '../../dataform/detail/detail?title=上报信息详情'+'&with_change=0'
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
  
  }
})