// pages/checkAttendance/checkAttendance.js
var dmNetwork = require('../../utils/network.js')
 
Page({

    /**
     * 页面的初始数据
     */
    data: {
			days:[
				{
					day: 1,
					week: '周一',
				}
			],
			selectedDay: '',
			currentDay: '',
			attendances: [],
			scroolLeft: 0,
			prckerSelected:'',
			selectedYear: '',
			selectedMonth: '',
			noMore:true,
			team_id: 10,
			project_id: 18331,
			page_size:10,
			page_no:1,
		},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
			this.init()

    },

		init(){
			// 获取当前日期的月日
			const today = new Date();
			const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1);
			const date = today.getDate() > 9 ? today.getDate() : '0' + today.getDate();
			const year = today.getFullYear();
			const days = this.getMonthDays(today);

			this.setData({
				days,
				selectedDay:month + '-' + date,
				currentDay: year + '-' +month + '-' + date,
				prckerSelected:year + '-' + month + '-' + date,
				selectedYear:year,
				selectedMonth:month,
			})
			this.calculateLeft(days, month + '-' + date)
			this.getAttendanceList()

		},

		// 根据当天日期获取当前日期所在月的第一天到最后一天每一天的日期和星期
		getMonthDays(today){
			let days = []

			// 获取当前月份的第一天和最后一天
			const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

			// 遍历当前月份的每一天
			for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
				// 获取日期yy-dd和星期 周一
				const month = day.getMonth() + 1 > 9 ? day.getMonth() + 1 : '0' + (day.getMonth() + 1);
				const date = day.getDate() > 9 ? day.getDate() : '0' + day.getDate();
				const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day.getDay()];
				days.push({
					day: month + '-' + date,
					week: week,
					dateStr: day.getFullYear() + '-' + month + '-' + date,
				});
			}
			return days;
		},

		selectDay(e){
			let index = e.currentTarget.dataset.index;
			this.setData({
				selectedDay: this.data.days[index].day,
				prckerSelected: this.data.days[index].dateStr,
				page_no:1,
				attendances:[],
				noMore:false
			})

			this.getAttendanceList()
		},

		bindDateChange(e){
			let date = e.detail.value;
			const today = new Date();
			let days = this.getMonthDays(today);
			let selectedDay = date.split('-')[1] + '-' + date.split('-')[2];


			this.setData({
				days:days,
				prckerSelected:date,
				selectedYear:date.split('-')[0],
				selectedMonth:date.split('-')[1],
				selectedDay,
			})
			this.calculateLeft(days, selectedDay)

			this.getAttendanceList()
		},

		getAttendanceList(){
			// 获取考勤列表
			let data = {
				team_id: this.data.team_id,
				project_id: this.data.project_id,
				page_size: this.data.page_size,
				page_no: this.data.page_no,
				date: this.data.prckerSelected,
				user_id:''
			}
			dmNetwork.post(dmNetwork.checkClockIn,data,(res) => {
				console.log(res)
				let data = res.data;
				if(data.errno == 0){

					let attendances = data.data.results;
					let index = 0;

					attendances.forEach((item) => {
						item.firstname = item.name.substr(0,1);
						item.nameIndex = index;
						index++;

						if(index > 4){
							index = 0;
						}
					})

					this.setData({
						attendances:this.data.attendances.concat(attendances),
						noMore:data.data.isEnd
					})
				}
			})

		},

		//计算向左滑动距离
		calculateLeft(days, selectedDay){
			let scroolLeft = 0;
			if([1,2,3].includes(selectedDay.split('-')[1])){
				scroolLeft = 0;
				this.setData({
					scroolLeft:scroolLeft
				})
				return;
			}

			//如果是最后五天
			if([days[days.length - 1].day.split('-')[1] - selectedDay.split('-')[1] <= 5]){
				scroolLeft = 50 * (selectedDay.split('-')[1] - 5);
				this.setData({
					scroolLeft:scroolLeft
				})
				return;
			}

			scroolLeft = 50 * (selectedDay.split('-')[1] - 1);
			this.setData({
				scroolLeft:scroolLeft
			})
		},

		handleTapGoSchedule(){
			wx.navigateTo({
				url: '/pages/scheduling/scheduling',
			})
		},

		//拨打电话
		handleTapPhone(e){
			let phone = e.currentTarget.dataset.phone;
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		},

		//滚动到底部
		handleScrollToLower(){
			if(this.data.noMore){
				return;
			}

			this.setData({
				page_no:this.data.page_no + 1
			})

			this.getAttendanceList()
		},

		//确认工时
		handleTapGoConfirmWorkTime(){
			wx.navigateTo({
				url: '/pages/confirmationWorkTime/ConfirmationWorkTime',
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