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
		scheduling: [
			[
				{
					day: '周一',
					date: '2021-08-23',
					startTime: '08:00',
					endTime: '12:00',
					rest: false,
				},
				{
					day: '周二',
					date: '2021-08-23',
					startTime: '14:00',
					endTime: '18:00',
					rest: false,
				},
				{
					day: '周三',
					date: '2021-08-23',
					startTime: '19:00',
					endTime: '21:00',
					rest: false,
				},
				{
					day: '周四',
					date: '2021-08-23',
					startTime: '21:00',
					endTime: '23:00',
					rest: false,
				},
				{
					day: '周五',
					date: '2021-08-23',
					startTime: '08:00',
					endTime: '12:00',
					rest: false,
				},
				{
					day: '周六',
					date: '2021-08-23',
					startTime: '08:00',
					endTime: '12:00',
					rest: false,
				},
				{
					day: '周日',
					date: '2021-08-23',
					startTime: '08:00',
					endTime: '12:00',
					rest: false,
				},
			],
		]
			
	},

	init() {
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

		//生成20个scheduling
		const scheduling = []
		for (let i = 0; i < 20; i++) {
			const item = []
			for (let j = 0; j < 7; j++) {
				item.push({
					day: '周一',
					date: '2021-08-23',
					startTime: '08:00',
					endTime: '12:00',
					rest: false,
				})
			}
			scheduling.push(item)
		}
		this.setData({
			scheduling
		})


		console.log(scheduling)
	},

	handleClickGridScheduling() {
		console.log(99)
		this.setData({
			showClickGrid: true
		})
	},

	handleHeadSwiperChange(e) {
		console.log(e)
	},

	handleBodySwiperChange(e) {
		console.log(e)
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