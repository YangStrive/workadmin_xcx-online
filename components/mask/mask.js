// components/mask/mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        isShow: true
      })
    },
    hide() {
      this.setData({
        isShow: false
      })
    }
  }
})