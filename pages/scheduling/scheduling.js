// pages/scheduling/scheduling.js
import {schedule, shift} from './sched.js'
import {
	generateWeekData,
	analysisuserList,
} from './util.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		customStyle: 'background: #ffffff;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);',
		showClickGrid: false,
		current: 0,
		userList:[],
		tableBodyScheduling: [],
		swiperHeadList: [],
		//今天的日期字符串
		nowDateStr: '',
		headerCurrent: 1,
		bodyCurrent: 1,
		headSelectYear: '',
		headSelectMonth: '',

		selectSchedulingList: [],//已选择的排班
		selectSchedulingIdList:[],//已选择的排班id
		//固定排班
		fixedSchedulingList:  [
		],
		//临时排班
		temporarySchedulingList:  [
		],
		showAddClickGridMain: true,
		showAddScheedulingMain: false,
		userLength:0,
	},

	async init() {
		const now = new Date()
		const nowDate = now.getDate()
		const nowMonth = now.getMonth()
		const nowYear = now.getFullYear()
		const nowDateStr = `${nowYear}-${nowMonth + 1}-${nowDate}`
		this.setData({
			nowDateStr,
			headSelectYear: nowYear,
			headSelectMonth: nowMonth + 1
		})

		let data = await this.getSchedulingData();
		let userList = this.setUserList(data);
		let swiperHeadList = this.initSwiperHeadList();
		let tableBodyScheduling = await this.getSchedulingDetail(1)
		
		this.setData({
			userList,
			userLength:userList.length,
			swiperHeadList,
			tableBodyScheduling,
			fixedSchedulingList:shift,
		})

	},


	//获取排班数据，使用schedule中的数据，使用promise模拟远程调用api
	async getSchedulingData(){
		return await this.fetchScheduleData()
	},

	fetchScheduleData() {
		return new Promise((resolve, reject) => {
			// 模拟延迟
			setTimeout(() => {
				const scheduleData = schedule;
				resolve(scheduleData);
			}, 1000); // 模拟 1 秒的网络延迟
		});
	},

	//生成头部swiper数据
	initSwiperHeadList() {
		const swiperHeadList = generateWeekData(new Date())
		return swiperHeadList;
	},

	//生成表格中用户姓名信息
	setUserList(data){
		return analysisuserList(data);

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
		const headSelectYear = firstDate.split('-')[0];
		const headSelectMonth = firstDate.split('-')[1];
		console.log(firstDate, 999)
		//重新生成头部swiper数据
		let swiperHeadList = generateWeekData(new Date(firstDate));

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
			bodyCurrent: current,
			headSelectMonth,
			headSelectYear,
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
	async getSchedulingDetail(current,data) {
		//随机生成userLength个空排班数据，数据中对象的字段带上默认值
		let scheduleData = []
		if(data){
			scheduleData = data;
		}else{
			scheduleData = await this.getSchedulingData();
		}

		let schedulingEmpty = [];
		const userLength = this.data.userLength;
		for (let i = 0; i < userLength; i++) {
			const item = []
			for (let j = 0; j < 7; j++) {
				item.push([
					{
						"task_id": "",
						"schedule_id": "",
						"position_id": "0",
						"schedule_name": "",
						"start_time": "",
						"end_time": "",
						"rest_start_time": "",
						"rest_end_time": "",
						"rest_work_hours": "",
						"rest_work_minute": ":",
						"work_hours": "",
						"position_name": "",
						"type": "",
						"rest": ""
					}
				])
			}
			schedulingEmpty.push(item)
		}
		

		let scheduling = [];
		scheduleData.map( (item,index) =>{
			scheduling.push([])
			item.date_schedule.map((itemS) => {
				scheduling[index].push(itemS.schedule)
			})
		})

		let tableBodyScheduling = [schedulingEmpty, schedulingEmpty, schedulingEmpty]
		tableBodyScheduling[current] = scheduling;

		return tableBodyScheduling;
	},

	//点击取消排班
	handleCancelScheduleBtn() {
		this.setData({
			showClickGrid: false
		})
	},



	//点击添加排班
	handleClickAddScheduleBtn() {
		console.log('handleClickAddScheduleBtn')
		this.setData({
			showAddClickGridMain: false,
			showAddScheedulingMain: true,
		})
	},



	//删除已选择的排班
	handleClickDeleteSeletedScheduleBtn(e) {
		const index = e.currentTarget.dataset.scheduleidx;
		const selectSchedulingList = this.data.selectSchedulingList;
		const selectSchedulingIdList = this.data.selectSchedulingIdList;
		selectSchedulingList.splice(index, 1)
		selectSchedulingIdList.splice(index, 1)
		this.setData({
			selectSchedulingList,
			selectSchedulingIdList
		})
	},

	//选择班次按钮点击
	handleClickSelectScheduleBtn(){
		this.setData({
			showAddClickGridMain:false,
			showAddScheedulingMain:true,
		})
	},

	//点击取消添加排班
	handleClickShiftListCancelBtn() {
		this.setData({
			showAddClickGridMain: true,
			showAddScheedulingMain: false,
		})
	},

	//点击确定排班
	handleClickShiftListConfirmBtn(e){
		const selectedList = e.detail.selectedList;
		const selectedIdList = e.detail.selectedIdList;
		const shiftType = e.detail.shiftType;

		if(shiftType == '1'){
			this.setData({
				showAddClickGridMain: true,
				showAddScheedulingMain: false,
				selectSchedulingList:selectedList,
				selectSchedulingIdList:selectedIdList,
			})
		};

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