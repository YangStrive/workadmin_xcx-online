const util = require("../../utils/util");
import { geSalaryList, isSignAnAgreement, isMember, submitApply, protocolSign, getWxPay, protocol_detail, orderNotice } from './use';
Page({
  data: {
    list: [],
    memberInfo: {//会员信息
      isVip: false,
      start_time: '',
      end_time: ''
    },
    goodsInfo: {
      goods_amount: '',
      good_days: '',
      good_id: '',
    },
    isAgreement: false,// 是否已经签过协议
    agreement: false, // 点击/取消协议勾选
    totalNums: 0,
    dialogwxPay: false,
    dialogwxPaySuccess: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onload..............');
    this.onCustomData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady..............');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.isWxPayCallback) {
      console.log('onShow isWxPayCallback..............');
      this.isWxPayCallback = false
      return
    }
    console.log('onShow..............');
    this.onInit();
  },
  onCustomData () {
    // 非页面渲染的数据,不会再wxml中渲染，增加性能
    this.submitAmountInfo = {
      submitTotalAmount: 0,
      submitTotalInterest: 0
    };
    this.selectedItem = {};
    this.selectedIndex = 0;
    this.protocol_order_ids = [];
    this.checkedIds = [];
    this.isWxPayCallback = false; // 是否是支付的回调触发的onshow
    this.wxPayParams = {};
    this.order_id = ''
  },
  onInit () {
    geSalaryList().then(list => {
      this.handleInitListData(list);
    })
    isSignAnAgreement().then(data => {
      const isSign = data.protocol_order_ids[0].is_sign;
      this.protocol_order_ids = data.protocol_order_ids;
      this.setData({
        isAgreement: !!isSign,
        agreement: !!isSign
      })
    })
  },
  // 申请提交预支工资
  submitSalaryAdvance () {
    // wx.navigateTo({
    //   url: `/pages/advancePayrollProgress/advancePayrollProgress?apply_id=`,
    //   success: (result) => { },
    //   fail: () => { },
    //   complete: () => { },
    // });
    // return
    if (!this.validateSalaryAdvance()) {
      return
    }
    // 1.判断是否是会员
    isMember(this.selectedItem).then(isMember => {
      if (isMember) {
        // 2.判断是否已经签订协议
        isSignAnAgreement().then(data => {
          const isSign = data.protocol_order_ids[0].is_sign
          if (!!isSign) {
            // 4.提交申请
            this.submitApply()
          } else {
            // 3.签订协议
            const request_data = this.formatProtocolParams(data);
            protocolSign(request_data).then(() => {
              // 4.提交申请
              this.submitApply()
            }).catch(err => {
              wx.showToast({
                title: err,
                icon: 'none',
              })
            })
          }
        }).catch(err => {
          wx.showToast({
            title: err,
            icon: 'none',
          })
        })
      } else {
        this.wxPay()
      }
    }).catch(err => {
      console.log('ERROR:', err)
      wx.showToast({
        title: err,
        icon: 'none',
      })
    })
  },
  // 校验提交预支工资必选信息
  validateSalaryAdvance () {
    if (this.checkedIds.length == 0) {
      wx.showToast({
        title: '请先选择需要申请的选项',
        icon: 'none',
      })
      return false
    }
    if (!this.data.isAgreement && !this.data.agreement) {
      wx.showToast({
        title: '请先勾选《平台借款协议》',
        icon: 'none',
      })
      return false
    }
    return true
  },
  // 提交预支工资申请
  submitApply () {
    const checkedIds = this.checkedIds;
    const data = this.data.list.filter(v => {
      return checkedIds.includes(v.project_id)
    }).map(v => {
      return {
        project_id: v.project_id,
        team_id: v.team_id,
        amount: v.amount_total,
        interest: v.interest
      }
    });
    const { submitTotalAmount, submitTotalInterest } = this.submitAmountInfo;
    let params = {
      data,
      total_amount: submitTotalAmount,
      total_interest: submitTotalInterest
    }
    // return
    submitApply(params).then(apply_id => {
      this.resetData()
      wx.showToast({
        title: '申请预支工资成功',
        icon: 'none',
      })
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/advancePayrollProgress/advancePayrollProgress?apply_id=${apply_id}`,
          success: (result) => { },
          fail: () => { },
          complete: () => { },
        });
      }, 1000)
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none',
      })
    })
  },
  // 打开支付弹窗
  wxPay () {
    this.setData({
      dialogwxPay: !this.data.dialogwxPay
    })
  },
  // 发起支付
  submitWxPay () {
    const that = this;
    // const payData = {
    //   "timeStamp": "1673595018",
    //   "nonceStr": "c75ee4a1c097db29a40a4e94c6817699",
    //   "package": "prepay_id=wx13153018013323bacc8db90eb65b350000",
    //   "signType": "RSA",
    //   "paySign": "jJgLB6bPt821smgnMZ7sw7mG2t0hO82+jIZXvbuja/BELeOh/gHsvay3DTi5UFyOiEMY1FoJn/i+okOerH2/mGJTEUtZChhE/5LSMesuKHY+FAk+ngiS5zFTHT8LwsoS+X6i3B85RbL7qmu/KxbhVNaMoW8HCe0hEAMOAZJn1S4MSzoGQbhZZjFYf0+v7BGGntzpAADOAlTwcYnxMwXq2iT8i6Jt9/FYIffEKpd7awrS1SKktkkbm/E7AHBGtP19jjzCpvLxJir8Se2Nzx9aq9Fw5dVZMJXBmgD6JlFWMhVK7G25gIgJaCWY4QG1Z9+1So9GTh7NsX1XOQBYNemHEw==",
    // }
    // that.isWxPayCallback = true
    // wx.requestPayment({
    //   ...payData,
    //   success (res) {
    //     console.log('success>>>>>>', res)
    //     that.wxPay();
    //     that.setData({
    //       dialogwxPaySuccess: true
    //     }, () => {
    //       orderNotice().then(() => {
    //         geSalaryList().then(listData => {
    //           that.updateData(listData);
    //         })
    //       }).catch(err => {
    //         wx.showToast({
    //           title: err,
    //           icon: 'none',
    //         })
    //       })
    //     })
    //   },
    //   fail (fail) {
    //     console.log('fail>>>>>>', fail)
    //   },
    //   complete (complete) {
    //     console.log('complete>>>>>>', complete)
    //   }
    // })
    // return
    const { project_id, team_id, good_id, goods_amount } = this.selectedItem;
    const params = {
      project_id,
      team_id,
      goods_id: good_id,
      amount: goods_amount
    };
    console.log('params', params)
    getWxPay(params).then(data => {
      console.log('getWxPay', data)
      const that = this;
      // const payData = {
      //   "timeStamp": "1673429318",
      //   "nonceStr": "3e0b321a7d1b59a8a151cc13f9ce12bb",
      //   "package": "prepay_id=wx11172838155535f1b4282fc77058a30000",
      //   "signType": "RSA",
      //   "paySign": "5ysPXk+EikaoazyPMpqBDn14H/LYReuWm6ed64EjdHy+l5B9/OG0CElIcPtsDLiRx+5KzkMQaMGhv+lfk/0LisAZBZmdPo5vAgeIscKaX8k/pG4CAcS9w9UQCNj9yLU/6xGp8vEix0XgYz/i8WYpJ4Uca/L39oVzi6g/XienuGN7McQWNFh6y3PczHpjAGuqtl8of8H6pDyQ6npCrB0Q8BMyCI50qz2wTrsPzWnUwc/5MVD1oH/JYmFM6+nqfBoAGXBFvwHBuirporQXVOmnalubDHMQT+bmoYcgcCmMey53zH8r7BHCY0Qp6rB+Hx5FJpPJ1FkzUHpVkW8nQ2nllw=="
      // }
      const { timeStamp, nonceStr, signType, paySign, package: packageN } = data.doubao_data;
      const { id } = data.saas_data;
      const payData = {
        timeStamp,
        nonceStr,
        package: packageN,
        signType,
        paySign
      }
      that.isWxPayCallback = true
      this.order_id = id
      console.log('payData', payData)
      // return
      wx.requestPayment({
        ...payData,
        success (res) {
          console.log('success>>>>>>', res)
          that.wxPay();
          const params = {
            order_id: that.order_id,
            project_id,
            team_id
          }
          console.log('orderNotice', params)
          orderNotice(params).then(() => {
            geSalaryList().then(listData => {
              that.updateData(listData);
            })
          }).catch(err => {
            wx.showToast({
              title: err,
              icon: 'none',
            })
          })
        },
        fail (fail) {
          console.log('fail>>>>>>', fail)
        },
        complete (complete) {
          console.log('complete>>>>>>', complete)
        }
      })
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none',
      })
    })
  },
  // 格式化签署协议参数
  formatProtocolParams (data) {
    const protocol_order_id = data.protocol_order_ids[0].protocol_order_id;
    const request_data = {
      protocol_order_id,
      team_id: 0,
      project_id: 0,
      lat: 0,
      lng: 0,
      type: 1
    };
    return request_data
  },
  // 跳转平台借款协议
  goElectronicProtocols () {
    if (this.data.isAgreement) {
      protocol_detail(this.protocol_order_ids)
      return
    }
    wx.navigateTo({
      url: `/pages/electronicProtocols/electronicProtocols`,
      success: (result) => { },
      fail: () => { },
      complete: () => { },
    });
  },
  // 处理获取的列表数据
  handleInitListData (listData) {
    if (listData.length == 0) {
      this.setData({
        list: []
      })
      return
    };
    const item = listData[0];
    const { start_time, end_time, goods_amount, good_days, good_id, project_id } = item;
    const { list } = this.setSelectedList(item, listData);
    const { totalNums } = this.handleAmount(item);
    this.selectedItem = item;
    this.selectedIndex = 0;
    this.checkedIds = [project_id];
    // this.goodsInfo = {
    //   goods_amount,
    //   good_days,
    //   good_id,
    // };
    this.setData({
      list,
      totalNums,
      'memberInfo.isVip': start_time && end_time,
      'memberInfo.start_time': start_time,
      'memberInfo.end_time': end_time,
      'goodsInfo.goods_amount': goods_amount,
      'goodsInfo.good_days': good_days,
      'goodsInfo.good_id': good_id
    })
  },
  // 列表单选
  checkBoxChane (e) {
    const item = e.currentTarget.dataset.item;
    if (item.checked) {
      return
    }
    const index = e.currentTarget.dataset.index; //当前选中的列表索引
    const list = this.data.list;
    const preSelectedIndex = list.findIndex((v) => v.checked); //上一个选中的列表索引
    const { totalNums } = this.handleAmount(item);
    const { start_time, end_time, goods_amount, good_days, good_id, project_id } = item;
    this.selectedItem = item;
    this.selectedIndex = index;
    this.checkedIds = [project_id];
    // this.goodsInfo = {
    //   goods_amount,
    //   good_days,
    //   good_id,
    // };
    this.setData({
      [`list[${index}].checked`]: true,
      [`list[${preSelectedIndex}].checked`]: false,
      totalNums,
      'memberInfo.isVip': start_time && end_time,
      'memberInfo.start_time': start_time,
      'memberInfo.end_time': end_time,
      'goodsInfo.goods_amount': goods_amount,
      'goodsInfo.good_days': good_days,
      'goodsInfo.good_id': good_id
    })
  },
  // 更新数据
  updateData (listData) {
    const { list } = this.setSelectedList(this.selectedItem, listData);
    this.selectedItem = listData.filter(v => {
      return v.project_id == this.selectedItem.project_id
    })[0]
    
    const { start_time, end_time } = this.selectedItem;
    console.log('starttime', start_time)
    console.log('end_time', end_time)
    this.setData({
      list,
      'memberInfo.isVip': start_time && end_time,
      'memberInfo.start_time': start_time,
      'memberInfo.end_time': end_time
    })
  },
  // 设置选中的列表
  setSelectedList (item, list) {
    list = list.map(v => {
      v.checked = v.project_id == item.project_id;
      return v
    })
    return { list }
  },
  // 处理选中状态列表
  handleListCheckBox (item, index) {
    const list = this.data.list.map(v => {
      v.checked = v.project_id == item.project_id;
      return v
    })
    return list
  },
  // 处理单选金额
  handleAmount (item) {
    const amount_total = item.amount_total;
    const interest = item.interest;
    const totalNums = util.formatAmount(amount_total, 2);
    this.submitAmountInfo.submitTotalAmount = amount_total
    this.submitAmountInfo.submitTotalInterest = interest
    return {
      totalNums
    }
  },
  // 勾选平台借款协议
  platformCheckBoxChane () {
    if (this.data.isAgreement) {
      return
    }
    this.setData({
      agreement: !this.data.agreement
    })
  },
  resetData () {
    this.isWxPayCallback = false
    this.wxPayParams = {}
    this.setData({
      dialogwxPay: false
    })
  },
  goPlatformAgreement () {
    wx.navigateTo({
      url: `/pages/wageAgreement/wageAgreement`,
      success: (result) => { },
      fail: () => { },
      complete: () => { },
    });
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