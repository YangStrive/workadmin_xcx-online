// components/feedbackinfo/feedbackinfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      observer: function(newVal, oldVal){
        var arr = {
          'success': 'http://cdn.doumistatic.com/220,01c241f403205fa0.png',
          'fail': 'http://cdn.doumistatic.com/218,01c241f5a0944861.png'
        }
        var icon = arr[newVal];
        this.setData({
          iconSrc: icon
        })
      }
    }
  },
  options: {
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    iconSrc: ''
  },
  attached() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})