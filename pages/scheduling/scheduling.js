
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
		showAddClickGridMain: false,//是否显示添加排班，true显示，false不显示，默认显示
		showAddScheedulingMain: false,
		userLength:0,
		selectedGridNum:0,
		showDeleteClickGridMain: false,
		selectedGridIndexList:{},//选中的排班索引
		currentSchedleFirstDate:'',
		schedulingEmpty:[],//空排班数据
		showUserScheduleDetail:false,
		userScheduleList:[],

		showUserAddScheedulingMain:false,
		userInfo:{
			user_id: 1,
			date:'',
			user_name:'',
			userIndex:0,
			dateIndex:0,
			userFirstName:'',
			dateStr:'',
			week:'',
			userLogo:'',
		},
		showReplacementCard: false,
		clockInList: [],
		team_id: 10,
		project_id: 18331,
		task_id: 1724371,
		attendance_id: 0,
		userDetailScheduleId:'',
		soruceClockInList:[],//原始打卡记录
		overlay: false,
		showUserEditScheedulingMain:false,//是否显示修改班次
		selectedShiftEdit:{},//选中的班次

	},

	async init() {
		this.getSchedulingDetail = debounce(this.getSchedulingDetailDeb, 1000)
		const now = new Date()
		const nowDate = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
		const nowMonth = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
		const nowYear = now.getFullYear()
		const nowDateStr = `${nowYear}-${nowMonth}-${nowDate}`

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
				'team_id': this.data.team_id,
				'project_id': this.data.project_id,
				'task_id': this.data.task_id,
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
		const user_id = e.currentTarget.dataset.userid;
		const date = e.currentTarget.dataset.date;
		let tableBodyScheduling = this.data.tableBodyScheduling;
		let selectedGridIndexList = this.data.selectedGridIndexList;
		let selectedGridNum = this.data.selectedGridNum;

		//如果selected为true,则取消选中，否则选中
		if (tableBodyScheduling[this.data.bodyCurrent][userIndex].date_schedule[dateIndex].selected) {
			tableBodyScheduling[this.data.bodyCurrent][userIndex].date_schedule[dateIndex].selected = false;
			selectedGridNum--;
			//将取消选中的排班索引从selectedGridIndexList中删除
			selectedGridIndexList[this.data.currentSchedleFirstDate] = selectedGridIndexList[this.data.currentSchedleFirstDate].filter(item => {
				return item.idx != `${userIndex}-${dateIndex}`
			})
		}else {
			tableBodyScheduling[this.data.bodyCurrent][userIndex].date_schedule[dateIndex].selected = true;
			selectedGridNum++;
			selectedGridIndexList[this.data.currentSchedleFirstDate].push({
				idx:`${userIndex}-${dateIndex}`,
				user_id:user_id,
				date:date,
			})
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

		// if(this.data.showAddClickGridMain){
		// 	return;
		// }

		//schedulenum大于0则需要显示当前排班信息
		if(schedulenum > 0 && !this.data.showAddClickGridMain ){
			let userindex = e.currentTarget.dataset.userindex;
			let dateindex = e.currentTarget.dataset.dateindex;
			let userid =  e.currentTarget.dataset.userid;
			let date = e.currentTarget.dataset.date;
			let userScheduleList = this.data.tableBodyScheduling[this.data.bodyCurrent][userindex].date_schedule[dateindex].schedule;
			let user_name = this.data.tableBodyScheduling[this.data.bodyCurrent][userindex].user_name;
			let userFirstName = user_name.substr(0,1);
			let userInfo = {
				user_id: userid,
				date,
				user_name,
				userIndex:userindex,
				dateIndex:dateindex,
				userFirstName,
				dateStr:`${this.data.swiperHeadList[this.data.headerCurrent][dateindex].datestr}`,
				week:this.data.swiperHeadList[this.data.headerCurrent][dateindex].date,
				userLogo:this.data.userList[userindex].userLogo,
			}

			this.setData({
				showUserScheduleDetail:true,
				showClickGrid:true,
				userScheduleList,
				userInfo,
				userDetailScheduleId:userScheduleList[0].schedule_id,
				overlay:true,
			})

			let requestDate = {
				team_id: this.data.team_id,
				project_id: this.data.project_id,
				user_id: userid,
				date: date,
				task_id: this.data.task_id,

			}
			dmNetwork.post(dmNetwork.clockInList,requestDate, (res) => {
				if(res.data.errno == 0){
					//过滤出当前排班id的打卡记录
					if(!res.data?.data){
						return;
					}
					let clockInList = res.data.data.attendance_list.filter(item => {
						return item.schedule_id == userScheduleList[0].schedule_id
					})
					this.setData({
						clockInList,
						soruceClockInList:res.data.data.attendance_list,
					})
				}else{
					wx.showToast({
						title: res.data.errmsg,
						icon: 'none',
						duration: 2000
					})
				}
			})

			return;

		}


		this.setData({
			showAddClickGridMain: true,
			showClickGrid: true,
		})
		this.handleBatchSchedulePro(e);


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
				let userIndex = item.idx.split('-')[0];
				let dateIndex = item.idx.split('-')[1];
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

	//点击取消批量排班
	handleCancelScheduleBtn() {
		const tableBodyScheduling = this.data.tableBodyScheduling;
		let selectedGridIndexList = this.data.selectedGridIndexList;
		selectedGridIndexList = {};
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
			selectSchedulingIdList:[],
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

	//删除批量排班中已选择的排班
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

	//点击确定排班回调
	async handleClickShiftListConfirmBtn(e){		
		let selectedList = e.detail.selectedList;
		let selectedIdList = e.detail.selectedIdList;
		let selectSchedulingList = this.data.selectSchedulingList;
		let selectSchedulingIdList = this.data.selectSchedulingIdList;

		selectedIdList = selectedIdList.concat(selectSchedulingIdList);
		selectedList = selectedList.concat(selectSchedulingList);
		//将selectedIdList 和 selectedList 去重
		selectedIdList = Array.from(new Set(selectedIdList));

		//去重selectedList
		let queSelectedList = [];
		selectedList.forEach(item => {
			let flag = true;
			queSelectedList.forEach(queItem => {
				if(queItem.schedule_id == item.schedule_id){
					flag = false;
				}
			})
			if(flag){
				queSelectedList.push(item);
			}
		})

		this.setData({
			showAddClickGridMain: true,
			showAddScheedulingMain: false,
			selectSchedulingList:queSelectedList,
			selectSchedulingIdList:selectedIdList,
		})
	},

	//最终点击确认排班
	async handleClickConfirmScheduleBtn(){
		const selectedGridIndexList = this.data.selectedGridIndexList;
		const selectSchedulingIdList = this.data.selectSchedulingIdList;
		let date_schedule = [];
		if(selectSchedulingIdList.length == 0){
			wx.showToast({
				title: '请选择排班',
				icon: 'none',
				duration: 2000
			})
			return;
		};

		for (let key in selectedGridIndexList) {
			selectedGridIndexList[key].map(item => {
				date_schedule.push({
					user_id: item.user_id,
					date: item.date,
					schedule_ids: selectSchedulingIdList.join(','),
					position_id: 0,
				})
			})
		};

		if(date_schedule.length == 0){
			wx.showToast({
				title: '请选择格子'	,
				icon: 'none',
				duration: 2000
			})
			return;
		}

		let res = await this.submitAddUserSchedule(date_schedule);

		if(res.errno == 0){
			wx.showToast({
				title: '添加成功',
				icon: 'success',
				duration: 2000
			});
		let resData = await this.getSchedulingDetail(this.data.bodyCurrent);
			this.setData({
				showAddClickGridMain: false,
				showClickGrid: false,
				selectSchedulingList:[],
				selectSchedulingIdList:[],
				selectedGridIndexList:{},
				selectedGridNum:0,
			})
		}else{
			wx.showToast({
				title: res.errmsg,
				icon: 'none',
				duration: 2000
			});
		}
	},


	//给用户添加排班页面点击取消
	handleClickShiftListUserCancelBtn(){
		this.setData({
			showUserAddScheedulingMain:false,
			showUserScheduleDetail:true,
		})
	},

	//给用户添加排班页面点击确定
	async handleClickShiftListUserConfirmBtn(e){
		let selectedList = e.detail.selectedList;
		let selectedIdList = e.detail.selectedIdList;
		let userScheduleList = this.data.userScheduleList;
		let selectSchedulingIdList = this.data.selectSchedulingIdList;

		selectedIdList = selectedIdList.concat(selectSchedulingIdList);
		selectedList = selectedList.concat(userScheduleList);
		//将selectedIdList 和 selectedList 去重
		selectedIdList = Array.from(new Set(selectedIdList));

		//去重selectedList
		let queSelectedList = [];
		selectedList.forEach(item => {
			let flag = true;
			queSelectedList.forEach(queItem => {
				if(queItem.schedule_id == item.schedule_id){
					flag = false;
				}
			})
			if(flag){
				queSelectedList.push(item);
			}
		})

			
		let date_schedule = [
			{
				user_id: this.data.userInfo.user_id,
				date: this.data.userInfo.date,
				schedule_ids: selectedIdList.join(','),
				position_id: 0,
			}
		];

		let res = await this.submitAddUserSchedule(date_schedule);
		
		if(res.errno == 0){
			wx.showToast({
				title: '添加成功',
				icon: 'success',
				duration: 2000
			});

			this.setData({
				showUserAddScheedulingMain: false,
				showUserScheduleDetail:true,
				userScheduleList:queSelectedList,
				selectSchedulingIdList:selectedIdList,
			})

			this.getSchedulingDetail(this.data.bodyCurrent);
		}else{
			wx.showToast({
				title: res.errmsg,
				icon: 'none',
				duration: 2000
			});
		}
	},

	//提交给用户添加排班
	submitAddUserSchedule(date_schedule){
		return new Promise((resolve, reject) => {
			let data = {
				'team_id': this.data.team_id,
				'project_id': this.data.project_id,
				'task_id': this.data.task_id,
				date_schedule:JSON.stringify(date_schedule),
			 }
			dmNetwork.post(dmNetwork.giveShift, data, (res) => {
				resolve(res.data);
			}, (err) => {
				//网络异常处理
				reject(err)
			})
		});
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
		let selectedGridIndexList = {};
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
			selectedGridIndexList,
		})
	},

	//点击确定批量删除排班
	handleDeleteCanfirmBtn(){
		//二次确认是否删除
		wx.showModal({
			title: '提示',
			content: '是否删除选中排班',
			success: (res) => {
				if(res.confirm){
					this.submitDeleteSchedule();
				}else if(res.cancel){
				}
			}
		})
	},

	//提交删除排班
	async submitDeleteSchedule(){
		//删除选中的排班index 遍历出user_id和date 然后将user_id和date作为一个对象放入数组中
		let selectedGridIndexList = this.data.selectedGridIndexList;
		let deleteList = [];
		for (let key in selectedGridIndexList) {
			selectedGridIndexList[key].map(item => {
				deleteList.push({
					user_id:item.user_id,
					choose_date:item.date,
				})
			})
		}
		let resData = await this.submitDeleteScheduleData(deleteList);

		 if(resData.errno == 0){
			 wx.showToast({
				 title: '删除成功',
				 icon: 'success',
				 duration: 2000
			 })
			 this.getSchedulingDetail(this.data.bodyCurrent)
			 this.setData({
				 showDeleteClickGridMain:false,
				 showClickGrid:false,
				 selectedGridIndexList:{},
				 selectedGridNum:0,
			 })
		 }else{
			 wx.showToast({
				 title: resData.errmsg,
				 icon: 'none',
				 duration: 2000
			 })
		 }
	},

	submitDeleteScheduleData(deleteList){
		return new Promise((resolve, reject) => {
			let data = {
				'team_id': this.data.team_id,
				'project_id': this.data.project_id,
				'task_id': this.data.task_id,
				date_schedule:JSON.stringify(deleteList),
			 }
			dmNetwork.post(dmNetwork.delShift, data, (res) => {
				resolve(res.data);
			}, (err) => {
				//网络异常处理
				reject(err)
			})
		})
	},	
		

	//点击关闭用户排班详情
	handleColoseUserScheduleBtn(){
		this.setData({
			showUserScheduleDetail:false,
			showClickGrid:false,
			userScheduleList:[],
			selectSchedulingIdList:[],
			overlay:false,
		})
	},

	//删除当前日期当前用户的排班
	handleClickDeleteUserScheduleBtn(e){
		//二次确认是否删除
		wx.showModal({
			title: '提示',
			content: '是否删除当前排班',
			success: (res) => {
				if (res.confirm) {
					this.submitDeleteUserSchedule(e);
					
				} else if (res.cancel) {
				}
			}
		})
	},

	//提交删除当前用户排班
	async submitDeleteUserSchedule(e){

		let scheduleidx = e.currentTarget.dataset.scheduleidx;
		let userScheduleList = this.data.userScheduleList;
		let schedule_id = userScheduleList[scheduleidx].schedule_id;

		let data = {
			'team_id': this.data.team_id,
			'project_id': this.data.project_id,
			task_id: this.data.task_id,
			user_id: this.data.userInfo.user_id,
			date: this.data.userInfo.date,
			schedule_id,
		 }
		dmNetwork.post(dmNetwork.delShiftUser,data, (res) => {
			if(res.data.errno == 0){
				wx.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 2000
				})
				userScheduleList.splice(scheduleidx, 1);

				this.setData({
					userScheduleList,
				})
				this.getSchedulingDetail(this.data.bodyCurrent)
			}else{
				wx.showToast({
					title: res.data.errmsg,
					icon: 'none',
					duration: 2000
				})
			}
		})
	},


	//给当前用户添加排班
	handleClickAddUserScheduleBtn(){
		let userScheduleList = this.data.userScheduleList;
		let selectSchedulingIdList = [];
		userScheduleList.forEach(item => {
			selectSchedulingIdList.push(item.schedule_id)
		});

		this.setData({
			showUserAddScheedulingMain:true,
			selectSchedulingIdList,
			showUserScheduleDetail:false,
		})

	},

	//帮他补卡
	handleClickHelpClockIn(){
		this.setData({
			showReplacementCard:true,
			showUserScheduleDetail:false,
		})
	},

	handleClickReplacementCardCancelBtn(){
		this.setData({
			showReplacementCard:false,
			showUserScheduleDetail:true,
		})
	},

	handleClickReplacementCardConfirmBtn(){
		this.setData({
			showReplacementCard:false,
		})

	},

	handleClickScheduleTab(e){
		let schedule_id = e.currentTarget.dataset.scheduleid;
		let soruceClockInList = this.data.soruceClockInList;
		//根据schedule_id获取打卡记录
		let clockInList = soruceClockInList.filter(item => {
			return item.schedule_id == schedule_id
		})

		this.setData({
			userDetailScheduleId:schedule_id,
			clockInList,
		})
	},

	//修改班次
	handleClickEditUserScheduleBtn(e){
		let userScheduleList = this.data.userScheduleList;
		let scheduleidx = e.currentTarget.dataset.scheduleidx;
		console.log('scheduleidx',userScheduleList);
		console.log('scheduleidx',userScheduleList[scheduleidx]);
		this.setData({
			showUserEditScheedulingMain:true,
			showUserScheduleDetail:false,
			selectedShiftEdit:userScheduleList[scheduleidx],
		})
	},

	//修改班次取消
	handleClickEditShiftCancelBtn(){
		this.setData({
			showUserEditScheedulingMain:false,
			showUserScheduleDetail:true,
			selectedShiftEdit:{},
		})
	},

	//修改班次确定
	async handleClickEditShiftConfirmBtn(e){
		let selectedList = e.detail.selectedList;
		let selectedIdList = e.detail.selectedIdList;
		let userScheduleList = this.data.userScheduleList;
		let selectSchedulingIdList = this.data.selectSchedulingIdList;
		let record_id = this.data.selectedShiftEdit.record_id;
		let willDeleteScheduleId = this.data.selectedShiftEdit.schedule_id;
		//删除userScheduleList 和 selectSchedulingIdList 中willDeleteScheduleId
		userScheduleList = userScheduleList.filter(item => {
			return item.schedule_id != willDeleteScheduleId
		})
		selectSchedulingIdList = selectSchedulingIdList.filter(item => {
			return item != willDeleteScheduleId
		})

		selectedIdList = selectedIdList.concat(selectSchedulingIdList);
		selectedList = selectedList.concat(userScheduleList);
		//将selectedIdList 和 selectedList 去重
		selectedIdList = Array.from(new Set(selectedIdList));

		//去重selectedList
		let queSelectedList = [];
		selectedList.forEach(item => {
			let flag = true;
			queSelectedList.forEach(queItem => {
				if(queItem.schedule_id == item.schedule_id){
					flag = false;
				}
			})
			if(flag){
				queSelectedList.push(item);
			}
		})

			

		let data = {
			team_id: this.data.team_id,
			project_id: this.data.project_id,
			task_id: this.data.task_id,
			user_id: this.data.userInfo.user_id,
			record_id,
			schedule_id:selectedIdList[0],
		}

		let res = await this.submitEditUserSchedule(data);
		
		if(res.errno == 0){
			wx.showToast({
				title: '修改成功',
				icon: 'success',
				duration: 2000
			});

			this.setData({
				showUserEditScheedulingMain:false,
				showUserScheduleDetail:true,
				selectedShiftEdit:{},
				userScheduleList:queSelectedList,
				selectSchedulingIdList:selectedIdList,
			})

			this.getSchedulingDetail(this.data.bodyCurrent);
		}else{
			wx.showToast({
				title: res.errmsg,
				icon: 'none',
				duration: 2000
			});
		}
	},

	//提交修改某人某天班次
	async submitEditUserSchedule(data){
		return new Promise((resolve, reject) => {
			dmNetwork.post(dmNetwork.editShift,data, (res) => {
				resolve(res.data);
			}, (err) => {
				reject(err)
			})
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