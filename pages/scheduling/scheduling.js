// pages/scheduling/scheduling.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showClickGrid: false,
		current: 0,
		user:[{
			name: '张三',
			firstName: '张',
		}],
		week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
		tableBodyScheduling: [],
		swiperHeadList: [],
		//今天的日期字符串
		nowDateStr: '',
		headerCurrent: 1,
		bodyCurrent: 1,
	},

	init() {
		const now = new Date()
		const nowDate = now.getDate()
		const nowMonth = now.getMonth()
		const nowYear = now.getFullYear()
		const nowDateStr = `${nowYear}-${nowMonth + 1}-${nowDate}`
		this.setData({
			nowDateStr
		})

		//生成20个user
		const user = []
		for (let i = 0; i < 20; i++) {
			user.push({
				name: '张三' + i,
				firstName: '张',
			})
		}
		this.setData({
			user
		})

		this.initSwiperHeadList()
		this.getSchedulingDetail(1)

	},

	//生成头部swiper数据
	initSwiperHeadList() {
		const swiperHeadList = this.generateWeekData(new Date())
		this.setData({
			swiperHeadList
		})
	},

	//生成当前日期的当前周，上一周，下一周的数据
	generateWeekData(date) {
		console.log(date, 666)
		const weekData = [];
		const dayMilliseconds = 24 * 60 * 60 * 1000;
		const weekMilliseconds = 7 * dayMilliseconds;
		const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
	
		const getWeekArray = (startDate) => {
			const weekArray = [];
			for (let i = 0; i < 7; i++) {
				const currentDate = new Date(startDate.getTime() + i * dayMilliseconds);
				weekArray.push({
					date: weekDays[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1],
					day: currentDate.getDate(),
					datestr: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
					month: currentDate.getMonth() + 1
				});
			}
			return weekArray;
		};
	
		const inputDate = new Date(date);
		const currentDay = inputDate.getDay();
		const startOfWeek = new Date(inputDate.getTime() - ((currentDay === 0 ? 7 : currentDay) - 1) * dayMilliseconds);
	
		// 上一周
		weekData.push(getWeekArray(new Date(startOfWeek.getTime() - weekMilliseconds)));
		// 当前周
		weekData.push(getWeekArray(startOfWeek));
		// 下一周
		weekData.push(getWeekArray(new Date(startOfWeek.getTime() + weekMilliseconds)));
		console.log(weekData,888)
	
		return weekData;
	},

	//点击排班格子
	handleClickGridScheduling() {
		this.setData({
			showClickGrid: true,
		})
	},

	//头部swiper切换
	handleHeadSwiperChange(e) {
		let current = e.detail.current;
		console.log('handleHeadSwiperChange', current)
		//当前current第一天的日期
		const firstDate = this.data.swiperHeadList[current][0].datestr;
		console.log(firstDate, 999)
		//重新生成头部swiper数据
		let swiperHeadList = this.generateWeekData(new Date(firstDate));

		//如果current 为0,需要对swiperHeadList重新排序，把当前周放在第一个，下一周放在第二个，上一周放在第三个
		if(current === 0) {
			const temp = swiperHeadList[0]
			swiperHeadList[0] = swiperHeadList[1];
			swiperHeadList[1] = swiperHeadList[2];
			swiperHeadList[2] = temp;
		}
		//如果current 为2,需要对swiperHeadList重新排序，把当前周放在第三个，下一周放在第一个，上一周放在第二个
		if (current === 2) {
			const temp = swiperHeadList[2]
			swiperHeadList[2] = swiperHeadList[1];
			swiperHeadList[1] = swiperHeadList[0];
			swiperHeadList[0] = temp;
		}
		
		this.setData({
			swiperHeadList,
			bodyCurrent: current
		})
	},

	//body swiper切换
	handleBodySwiperChange(e) {
		console.log('handleBodySwiperChange')
		this.setData({
			headerCurrent: e.detail.current
		});
		this.getSchedulingDetail(e.detail.current)
		
	},

	//获取详细排班数据
	getSchedulingDetail(current) {
		//随机生成二十个排班数据，数据中对象的字段带上默认值
		const scheduling = [];
		let startTimeList = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00','16:00','17:00'];
		let endTimeList = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00','16:00','17:00','18:00'];
		for (let i = 0; i < 20; i++) {
			const item = []
			for (let j = 0; j < 7; j++) {
				//给随机生成的排班数据添加默认值
				const day = Math.floor(Math.random() * 30) + 1;
				const date = `${this.data.swiperHeadList[this.data.bodyCurrent][j].month}-${day}`;
				const startTime = startTimeList[Math.floor(Math.random() * 10)];
				const endTime = endTimeList[Math.floor(Math.random() * 10)];
				const rest = false;
				item.push({
					day,
					date,
					startTime,
					endTime,
					rest,
				})
			}
			scheduling.push(item)
		}
		//生成20个空scheduling
		const schedulingEmpty = []
		for (let i = 0; i < 20; i++) {
			const item = []
			for (let j = 0; j < 7; j++) {
				item.push({
					day: '',
					date: '',
					startTime: '',
					endTime: '',
					rest: false,
				})
			}
			schedulingEmpty.push(item)
		}

		let tableBodyScheduling = [schedulingEmpty, schedulingEmpty, schedulingEmpty]
		tableBodyScheduling[current] = scheduling;
		setTimeout(() => {
			this.setData({
				tableBodyScheduling
			})
		}, 500)
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.init()
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