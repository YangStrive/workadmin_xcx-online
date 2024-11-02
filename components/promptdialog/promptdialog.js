// components/promptdialog/promptdialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      value: true,
      type: Boolean
    },
    clickBtn: String,
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
    onClickBtn(e){
      this.triggerEvent('clickBtn')
    }
  }
})
