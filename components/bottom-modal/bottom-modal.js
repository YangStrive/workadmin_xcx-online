// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    },
    tipList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    showModal: false,
    isShow: false,
    leaveDate: '',
    leaveTipList: [],
    leaveCurrentTip: -1,
    detailTipList: [],
    detailCurrentTip: -1,
    detail_len: 0,
    showTextarea: false, // 是否展示输入离职详细原因输入框
    showDetailTips: false, // 是否展示主动离职详细列表
    reasonDetailId: 0, // 详细原因id
    reasonDetailContent: '', //详细原因内容
    otherReason: '', //其他原因的内容
  },
  ready() {
    let arr = []
    this.properties.tipList.forEach((item) => {
      arr.push(item.leave_type)
    })
    this.setData({
      leaveTipList: arr
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    resetModalData() {
      this.setData({
        leaveDate: '',
        leaveCurrentTip: -1,
        detailCurrentTip: -1,
        otherReason: '',
        reasonDetailId: 0,
        reasonDetailContent: '',
        showTextarea: false,
        showDetailTips: false,
      })
    },
    showModal() {
      const mask = this.selectComponent('#mask')
      mask.show()
      console.log(this.properties.tipList);
      console.log(this.properties.info);
      this.setData({
        showModal: true,
        leaveDate: this.properties.info.leave_apply_date
      })

    },
    hideModal() {
      const mask = this.selectComponent('#mask')
      mask.hide()
      this.setData({
        showModal: false
      })
      this.resetModalData()
    },
    bindDateChange(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        leaveDate: e.detail.value
      })
    },
    chooseLeaveTip(e) {
      let index = e.currentTarget.dataset.index
      let detailTips = this.properties.tipList[index].list
      const showTextarea = index === 2 ? true : false
      const showDetailTips = (index === 0 || index === 1) ? true : false

      this.setData({
        leaveCurrentTip: index,
        detailTipList: detailTips,
        showTextarea,
        showDetailTips,
        detailCurrentTip: -1,
        reasonDetailId: 0,
        reasonDetailContent: '',
        otherReason: ''
      })
    },
    chooseDetailTip(e) {
      let id = e.currentTarget.dataset.reasonid
      let reason = e.currentTarget.dataset.reason
      console.log(id, reason);
      let index = e.currentTarget.dataset.index
      this.setData({
        detailCurrentTip: index,
        reasonDetailId: id,
        reasonDetailContent: reason
      })
    },
    textareaChange(e) {
      this.setData({
        otherReason: e.detail.value,
        detail_len: e.detail.value.length
      })
    },
    // 弹层中点击确定提交离职信息
    confirm() {
      let leaveData = this.data.leaveDate
      let reasonDetailId = this.data.reasonDetailId
      let reasonDetailContent = this.data.reasonDetailContent
      let otherReason = this.data.otherReason
      if (!leaveData || (!reasonDetailContent && !otherReason)) {
        wx.showToast({
          title: '信息未填完整',
          icon: 'none',
          mask: true,
          duration: 1500
        })
        return
      }

      this.triggerEvent('removeMember', {
        dmclient: 'weixinxcx',
        project: this.properties.info.project,
        user_id: this.properties.info.user_id,
        reason_id: reasonDetailId,
        leave_reason: otherReason || reasonDetailContent,
        leave_date: leaveData
      })
    }
  }
})