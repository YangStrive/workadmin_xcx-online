// pages/scheduling/scheduling.js
import {schedule, shift} from './sched.js'
var dmNetwork = require('../../utils/network.js')

import {
	generateWeekData,
	analysisuserList,
	debounce
} from './util.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		customStyle: 'background: #ffffff;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);',
		showClickGrid: false,
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
		showAddClickGridMain: false,//是否显示添加排班，true显示，false不显示，默认显示
		showAddScheedulingMain: false,
		userLength:0,
		selectedGridNum:0,
		showDeleteClickGridMain: false,
		selectedGridIndexList:{},//选中的排班索引
		currentSchedleFirstDate:'',
		schedulingEmpty:[],//空排班数据
		showUserScheduleDetail:false,
	},

	async init() {
		this.getSchedulingDetail = debounce(this.getSchedulingDetailDeb, 1000)
		const now = new Date()
		const nowDate = now.getDate()
		const nowMonth = now.getMonth()
		const nowYear = now.getFullYear()
		const nowDateStr = `${nowYear}-${nowMonth + 1}-${nowDate}`
		this.setData({
			nowDateStr,
			headSelectYear: nowYear,
			headSelectMonth: nowMonth + 1
		});



		let swiperHeadList = this.initSwiperHeadList(nowDateStr);
		
		this.setData({
			swiperHeadList,
		})

		let data = await this.getSchedulingData();
		let userList = this.setUserList(data);
		this.setEmptySchedulingData(data);
		this.getSchedulingDetail(1,data)
		
		this.setData({
			userList,
			userLength:userList.length,
			swiperHeadList,
			fixedSchedulingList:shift,
		})

	},


	//获取排班数据，使用schedule中的数据，使用promise模拟远程调用api
	async getSchedulingData(){
		return await this.fetchScheduleData()
	},

	fetchScheduleData() {
		return new Promise((resolve, reject) => {    
			let data = {
				'dmclient': 'pcweb',
				'X-Doumi-Agent': 'weixinqy',
				'team_id': 10,
				'project_id': 18331,
				'task_id': 1724371,
				'start_date': this.data.swiperHeadList[this.data.headerCurrent][0].datestr,
				'group_ids':'',
			 }
			dmNetwork.get(dmNetwork.getScheduleDetail, data, (res) => {
				resolve(res.data.data);
			}, (err) => {
				//网络异常处理
				reject(err)
			})
			//resolve(schedule)
		});
	},

	//生成头部swiper数据
	initSwiperHeadList(date) {
		const swiperHeadList = generateWeekData(new Date(date));
		return swiperHeadList;
	},

	//生成表格中用户姓名信息
	setUserList(data){
		return analysisuserList(data);
	},

	//点击批量排班
	handleBatchScheduleBtn(){
		this.setData({
			showAddClickGridMain: true,
			showClickGrid: true,
		})
	},

	//批量排班
	handleBatchSchedulePro(e){
		const schedulenum = e.currentTarget.dataset.schedulenum;

		//如果schedulenum大于0则不做任何操作
		if(schedulenum > 0 ){
			return;
		}

		this.handleSelectGridScheduling(e);

	},

	//公共方法处理选择和反选格子
	handleSelectGridScheduling(e){
		const dateIndex = e.currentTarget.dataset.dateindex;
		const userIndex = e.currentTarget.dataset.userindex;
		let tableBodyScheduling = this.data.tableBodyScheduling;
		let selectedGridIndexList = this.data.selectedGridIndexList;
		let selectedGridNum = this.data.selectedGridNum;

		//如果selected为true,则取消选中，否则选中
		if (tableBodyScheduling[this.data.bodyCurrent][userIndex].date_schedule[dateIndex].selected) {
			tableBodyScheduling[this.data.bodyCurrent][userIndex].date_schedule[dateIndex].selected = false;
			selectedGridNum--;
			//将取消选中的排班索引从selectedGridIndexList中删除
			selectedGridIndexList[this.data.currentSchedleFirstDate] = selectedGridIndexList[this.data.currentSchedleFirstDate].filter(item => {
				return item != `${userIndex}-${dateIndex}`
			})
		}else {
			tableBodyScheduling[this.data.bodyCurrent][userIndex].date_schedule[dateIndex].selected = true;
			selectedGridNum++;
			selectedGridIndexList[this.data.currentSchedleFirstDate].push(`${userIndex}-${dateIndex}`)
		}
		this.setData({
			tableBodyScheduling,
			selectedGridNum
		})
	},

	//点击排班格子
	handleClickGridScheduling(e) {
		const schedulenum = e.currentTarget.dataset.schedulenum;
		
		//如果是删除状态
		if(this.data.showDeleteClickGridMain){
			this.handleDeleteGridScheduling(e);
			return;
		}

		if(this.data.showAddClickGridMain){
			this.handleBatchSchedulePro(e);
			return;
		}

		//schedulenum大于0则需要显示当前排班信息
		if(schedulenum > 0 ){
			this.setData({
				showUserScheduleDetail:true,
				showClickGrid:true,
			})
		}
	},

	//头部swiper切换
	async handleHeadSwiperChange(e) {
		let current = e.detail.current;
		console.log('handleHeadSwiperChange', current)
		//当前current第一天的日期
		const firstDate = this.data.swiperHeadList[current][0].datestr;
		const headSelectYear = firstDate.split('-')[0];
		const headSelectMonth = firstDate.split('-')[1];
		let schedulingEmpty = this.data.schedulingEmpty
		
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
			tableBodyScheduling: [schedulingEmpty,schedulingEmpty,schedulingEmpty],
		})


		this.getSchedulingDetail(current)
	},

	//body swiper切换
	async handleBodySwiperChange(e) {
		console.log('handleBodySwiperChange')
		let schedulingEmpty = this.data.schedulingEmpty
		this.setData({
			headerCurrent: e.detail.current,
			tableBodyScheduling: [schedulingEmpty,schedulingEmpty,schedulingEmpty],
		});
		this.getSchedulingDetail(e.detail.current)
		
	},

	//生成空格子数据
	setEmptySchedulingData(data){
		let schedulingEmpty = [];
		const userLength = data.length;
		for (let i = 0; i < userLength; i++) {
			let item = {
				user_id: data[i].user_id,
				user_name: data[i].user_name,
				date_schedule:[],
			}
			for (let j = 0; j < 7; j++) {
				item.date_schedule.push({
					date: '',
					selected:false,
					schedule:[
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
							"rest": "",
						}
					]
				})
			}
			schedulingEmpty.push(item)
		}

		this.setData({
			schedulingEmpty,
		})
	},

	//设置详细排班数据
	async getSchedulingDetailDeb(current,data) {
		//随机生成userLength个空排班数据，数据中对象的字段带上默认值
		let scheduleData = []
		if(data){
			scheduleData = data;
		}else{
			scheduleData = await this.getSchedulingData();
		}

		//将scheduleData中date_schedule字段增加一个selected字段，用于标记是否被选中
		scheduleData.forEach((item, index) => {
			item.date_schedule.forEach((dateItem, dateIndex) => {
				dateItem.selected = false;
			})
		})

		//当前排班第一天的日期
		let currentSchedleFirstDate = scheduleData[0].date_schedule[0].date;
		let selectedGridIndexList = this.data.selectedGridIndexList;

		if(!selectedGridIndexList[currentSchedleFirstDate]){
			selectedGridIndexList[currentSchedleFirstDate] = [];
		}

		//如果之前已经选择了排班，需要将已选择的排班选中
		if(selectedGridIndexList[currentSchedleFirstDate].length > 0){
			selectedGridIndexList[currentSchedleFirstDate].map(item => {
				let userIndex = item.split('-')[0];
				let dateIndex = item.split('-')[1];
				//选中已选择的排班
				scheduleData[userIndex].date_schedule[dateIndex].selected = true
			})
		}

		this.setData({
			currentSchedleFirstDate,
			selectedGridIndexList
		})

		let schedulingEmpty = this.data.schedulingEmpty;
		let tableBodyScheduling = [schedulingEmpty, schedulingEmpty, schedulingEmpty]
		tableBodyScheduling[current] = scheduleData;
		console.log('getSchedulingDetail', tableBodyScheduling)

		this.setData({
			tableBodyScheduling,
		})
	},

	//点击取消排班
	handleCancelScheduleBtn() {
		const tableBodyScheduling = this.data.tableBodyScheduling;
		let selectedGridIndexList = this.data.selectedGridIndexList;
		selectedGridIndexList[this.data.currentSchedleFirstDate] = [];

		//取消所有选中的排班
		tableBodyScheduling[this.data.bodyCurrent].forEach((item, index) => {
			item.date_schedule.forEach((dateItem, dateIndex) => {
				dateItem.selected = false;
			})
		})

		this.setData({
			showClickGrid: false,
			selectedGridNum:0,
			tableBodyScheduling,
			selectedGridIndexList,
			showAddClickGridMain:false,
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
	 * 删除已存在的排班逻辑
	 */

	//点击批量删除排班
	handleClickAllDeleteBtn(){
		this.setData({
			showDeleteClickGridMain:true,
			showClickGrid:true,
			showAddClickGridMain:false,
		})

	},

	//删除排班格子
	handleDeleteGridScheduling(e){
		const schedulenum = e.currentTarget.dataset.schedulenum;
		if(schedulenum == 0 ){
			return;
		}
		this.handleSelectGridScheduling(e);
	},

	//点击取消批量删除排班
	handleDeleteCancelScheduleBtn(){
		const tableBodyScheduling = this.data.tableBodyScheduling;
		let selectedGridIndexList = this.data.selectedGridIndexList;
		selectedGridIndexList[this.data.currentSchedleFirstDate] = [];
		//取消所有选中的排班
		tableBodyScheduling[this.data.bodyCurrent].forEach((item, index) => {
			item.date_schedule.forEach((dateItem, dateIndex) => {
				dateItem.selected = false;
			})
		})

		this.setData({
			showDeleteClickGridMain:false,
			selectedGridNum:0,
			tableBodyScheduling,
			selectedGridIndexList:{},
		})
	},

	//点击确定批量删除排班
	handleDeleteCanfirmBtn(){

	},

	//点击关闭用户排班详情
	handleColoseUserScheduleBtn(){
		this.setData({
			showUserScheduleDetail:false,
			showClickGrid:false,
		})
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