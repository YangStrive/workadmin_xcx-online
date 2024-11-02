// components/returnvisitcard/returnvisitcard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasBtns: {
      type: Boolean,
      value: false
    },
    info: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goRecord(e) {
      let id = this.properties.info.visit_id
      console.log(id);
      wx.navigateTo({
        url: `/pages/uc/returnvisitrecord/returnvisitrecord?id=${id}`
      })
    },
    leave(e) {
      // let id = this.properties.info.visit_id
      this.triggerEvent('leaveOffice', this.properties.info)
    },
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: this.properties.info.user_mobile
      })
    }
  }
})