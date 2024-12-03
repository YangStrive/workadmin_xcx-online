// pages/confirmationWorkTime/ConfirmationWorkTime.js
var dmNetwork = require('../../utils/network.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
      confirmWorkTimeList:[],
			team_id: 10,
			project_id: 18331,
			page_size:10,
			page_no:1,
      group_id: 0,
      noMore:false,
      allChecked:false,
      //已选择排班数量
      checkedCount:0,
      //总工时
      totalWorkTime:0,
      //总金额
      totalMoney:0,
      userName:'',
      user_id:'',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.init()
    },

    init(){
      this.setData({
        confirmWorkTimeList:[],
        page_no:1,
        noMore:false,
        allChecked:false,
        checkedCount:0,
        totalWorkTime:0,
        totalMoney:0,
      })

      this.getConfirmWorkTimeList()
    },

    //获取确认工时列表
    getConfirmWorkTimeList(){
      let data = {
        team_id: this.data.team_id,
        project_id: this.data.project_id,
        page_size: this.data.page_size,
        page_no: this.data.page_no,
        group_id: this.data.group_id,
        user_id: this.data.user_id,
        status:'',
      }
      dmNetwork.post(dmNetwork.confirmClockInList,data, res => {
        if(res.data.errno == 0){
          let data = res.data.data
          let results = data.results;
          let index = 0;

          results.forEach(item => {
            item.list.forEach(item2 => {
              item2.checked = false;
              item2.firstName = item2.name.substring(0,1);
              item2.nameIndex = index;
              item2.date = item.date
              index++;

              if(index > 4){
                index = 0;
              }
            })
          })
          this.setData({
            confirmWorkTimeList:this.data.confirmWorkTimeList.concat(results),
            noMore:data.isEnd,
          })
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 2000,
          })
        }
      })
    },

    //选择人员
    handleTapCheckbox(e){
      let index = e.currentTarget.dataset.index;
      let lindex = e.currentTarget.dataset.lindex;
      let confirmWorkTimeList = this.data.confirmWorkTimeList;
      let item = confirmWorkTimeList[index].list[lindex];
      item.checked = !item.checked;
      confirmWorkTimeList[index].list[lindex] = item;
      //判断是否全选
      let allChecked = true;
      confirmWorkTimeList.forEach(item => {
        item.list.forEach(item => {
          if(!item.checked){
            allChecked = false;
          }
        })
      })

      this.setData({
        confirmWorkTimeList,
        allChecked,
      });

      this.calculateTotal()
    },

    //全选
    handleTapAllChecked(){
      let confirmWorkTimeList = this.data.confirmWorkTimeList;
      let allChecked = !this.data.allChecked;
      confirmWorkTimeList.forEach(item => {
        item.list.forEach(item => {
          item.checked = allChecked;
        })
      })

      this.setData({
        confirmWorkTimeList,
        allChecked,
      });

      this.calculateTotal()
    },

    handleScrollToLower(){
      if(this.data.noMore){
        return
      }
      this.setData({
        page_no:this.data.page_no + 1,
        allChecked:false,
      })
      this.getConfirmWorkTimeList()
    },

    //计算总工时和总金额等
    calculateTotal(){
      let confirmWorkTimeList = this.data.confirmWorkTimeList;
      let totalWorkTime = 0;
      let totalMoney = 0;
      let checkedCount = 0;
      confirmWorkTimeList.forEach(item => {
        item.list.forEach(item => {
          if(item.checked){
            totalWorkTime += +item.point_time;
            totalMoney += +item.amount;
            checkedCount++;
          }
        })
      })

      this.setData({
        totalWorkTime:totalWorkTime.toFixed(2),
        totalMoney:totalMoney.toFixed(2),
        checkedCount: checkedCount,
      })
    },

    //确认工时
    handleTapConfirmWorkTime(){
      let confirmWorkTimeList = this.data.confirmWorkTimeList;
      let date_attendances = [];
      confirmWorkTimeList.forEach(item => {
        item.list.forEach(item => {
          if(item.checked){
            date_attendances.push({
              user_id:item.user_id,
              date:item.date,
              task_id:item.task_id,
              schedule_id:item.schedule_id,
            })
          }
        })
      })

      if(date_attendances.length == 0){
        wx.showToast({
          title: '请选择需要确认的人员',
          icon: 'none',
          duration: 2000,
        })
        return
      }

      let data = {
        team_id: this.data.team_id,
        project_id: this.data.project_id,
        date_attendances:JSON.stringify(date_attendances),
      }

      dmNetwork.post(dmNetwork.confirmClockIn,data, res => {
        if(res.data.errno == 0){
          wx.showToast({
            title: '确认成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(() => {
            this.init()
          }, 3000)
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 2000,
          })
        }
      })
    },

		handleTapClearSearchInput(){
			this.setData({
				userName:'',
				user_id:'',
				confirmWorkTimeList:[],
				page_no:1,
				noMore:false,
			})
			this.getConfirmWorkTimeList()
		},

		//搜索人员页面回调 设置人员
		setPerson(person){
			let user_id = person.user_id;
			let userName = person.user_name;
			console.log(person)
			this.setData({
				userName,
				user_id,
				confirmWorkTimeList:[],
				page_no:1,
				noMore:false,
			})

			this.getConfirmWorkTimeList()
		},

		handleInputFocus(){
			wx.navigateTo({
				url: '/pages/searchPerson/searchPerson?team_id=' + this.data.team_id + '&project_id=' + this.data.project_id,
			})
		},

    //查看详情
		handleTapDetail(e){
			let index = e.currentTarget.dataset.index;
			let lindex = e.currentTarget.dataset.lindex;
			let userData = this.data.confirmWorkTimeList[index].list[lindex];
			let schedule_id = userData.schedule_id;
			let team_id = this.data.team_id;
			let task_id = userData.task_id;
			let user_id = userData.user_id;
			let date = userData.date;
			let project_id = this.data.project_id;
			wx.navigateTo({
				url:'/pages/confirmWorkTimeDetail/confirmWorkTimeDetail?schedule_id=' + schedule_id + '&user_id=' + user_id + '&date=' + date + '&team_id=' + team_id + '&project_id=' + project_id + '&task_id=' + task_id,
			})
		},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})