import {shift} from './sched.js'
var dmNetwork = require('../../utils/network.js')

Component({
	properties: {
		shiftType: {
			type: Number,
			value: 1,
		},
		selectedShiftIdList: {
			type: Array,
			value: [],
		},
		team_id: {
			type: String,
			value: '',
		},
		project_id: {
			type: String,
			value: '',
		},
		task_id: {
			type: String,
			value: '',
		},


	},
	data: {
		shiftList:[],
		// 组件内部数据
		addSchedulingTab: 1,
		currentSelectEdShiftIdList:[],//已选择的排班id
		fixedSchedulingList:[],
		temporarySchedulingList: [],
		restTypeList: [
			{
				value: 1,
				label: '固定时间',
			},
			{
				value: 2,
				label: '不启用',
			},
			{
				value: 3,
				label: '动态时间',
			},
		],

		temporaryRestStartTime: '12:00',
		temporaryRestEndTime: '13:00',
		temporaryRestStartTimeIndex: [12, 0],
		temporaryRestEndTimeIndex: [13, 0],
		temporaryRestTimeHourIndex:'1',
		temporaryRestTimeMinuteIndex:'30',
		temporaryRestType: 1,
		timeRange: [[], []], // 用于存储小时和分钟的数组

	},
	attached() {
		console.log('组件实例刚刚被创建');
		this.init()
	},
	methods: {

		// 组件方法
		async init(){
			console.log('组件实例刚刚被创建',shift);
			let shiftList = await this.getShiftList();
			let temporarySchedulingList = [];
			if(temporarySchedulingList.length === 0){
				temporarySchedulingList = [{
					schedule_name: '',
					schedulingColor: '',
					start_time: '08:00',
					end_time: '16:00',
					work_hours: '',
					rest_start_time: '',
					rest_end_time: '',
					timeStartIndex:[8,0],
					timeEndIndex:[16,0],
					timeRestStartIndex:[12,0],//12:00 
					timeRestEndIndex:[13,0],//13:00
				}]
			}

			this.setData({
				fixedSchedulingList:shiftList.fixedSchedules,
				currentSelectEdShiftIdList:this.data.selectedShiftIdList,
				temporarySchedulingList,
			})
			this.setTimeRange()

		},

	//setTimeRange
	setTimeRange(){
    const hours = [];
    const minutes = [];
    
    for (let i = 0; i < 24; i++) {
      hours.push(i < 10 ? '0' + i : '' + i);
    }
    
    for (let i = 0; i < 60; i += 15) {
      minutes.push(i < 10 ? '0' + i : '' + i);
    }
    
    this.setData({
      timeRange: [hours, minutes]
    });
	},


	//获取排班数据
	getShiftList() {
		return new Promise((resolve, reject) => {    
			let data = {
				'team_id': this.data.team_id,
				'project_id': this.data.project_id,
				'task_id': this.data.task_id,
			 }
			dmNetwork.get(dmNetwork.getShiftList, data, (res) => {
				resolve(res.data.data);
			}, (err) => {
				//网络异常处理
				reject(err)
			})
			//resolve(schedule)
		});
	},

		handleAddSchedulingTab(e) {
			const tabid = e.currentTarget.dataset.tabid;
			this.setData({
				addSchedulingTab:tabid,
			})
		},

		//点击选择某一项固定排班
		handleClickSelectScheduleItme(e) {
			let index = e.currentTarget.dataset.scheduleidx;
			const fixedSchedulingList = this.data.fixedSchedulingList;
			const currentSelectEdShiftIdList = this.data.currentSelectEdShiftIdList;
			const schedule = fixedSchedulingList[index];
			const scheduleId = schedule.id;
			let isExist = false;

			if(currentSelectEdShiftIdList.includes(scheduleId)){
				isExist = true;
			}

			if(!isExist){
				currentSelectEdShiftIdList.push(scheduleId)
				this.setData({
					currentSelectEdShiftIdList
				})
			}else{
				//提示已经选择过了，从currentSelectEdShiftIdList中删除
				const idx = currentSelectEdShiftIdList.indexOf(scheduleId);
				currentSelectEdShiftIdList.splice(idx,1);
				this.setData({
					currentSelectEdShiftIdList
				})
			}
		},

		//点击添加临时排班
		handleAddTemporarySchedulingBtn() {
			//给临时排班添加一项，值为空
			const temporarySchedulingList = this.data.temporarySchedulingList
			temporarySchedulingList.push({
				schedule_name: '',
				schedulingColor: '',
				start_time: '08:00',
				end_time: '16:00',
				work_hours: '',
				rest_start_time: '',
				rest_end_time: '',
			})
			this.setData({
				temporarySchedulingList
			})
	
		},
	
		//删除临时排班
		handleClickDeleteTempScheduleBtn(e){
			const index = e.currentTarget.dataset.scheduleidx;
			const temporarySchedulingList = this.data.temporarySchedulingList;
			temporarySchedulingList.splice(index, 1)
			this.setData({
				temporarySchedulingList
			})
	
		},
	
		//临时班次选择时间
		handleTemporaryScheduleTimeChange(e,) {
			const temporarySchedulingList = this.data.temporarySchedulingList;
			const index = e.currentTarget.dataset.scheduleidx;
			const value = e.detail.value;
			const type = e.currentTarget.dataset.timetype;
			const timeRange = this.data.timeRange;
			let timeStr = timeRange[0][value[0]] + ':' + timeRange[1][value[1]];
	
			temporarySchedulingList[index][type] = timeStr;
			if(type == 'start_time'){
				temporarySchedulingList[index].timeStartIndex = value;
			}
			if(type == 'end_time'){
				temporarySchedulingList[index].timeEndIndex = value;
			}
			this.setData({
				temporarySchedulingList
			})
		},
	
		//取消排班选择
		handleAddSchedulingBtn() {
			this.triggerEvent('cancel')
		},
	
		//确认排班选择
		handleCloseAddScheduling(){
			//如果没有选择排班
			if(this.data.currentSelectEdShiftIdList.length === 0 && this.data.temporarySchedulingList.length === 0){
				wx.showToast({
					title: '请选择排班',
					icon: 'none',
					duration: 2000
				})
				return;
			}

			//如果是固定排班需要
			if(this.data.addSchedulingTab == 1){
				//从所有排班中遍历出已选择的排班
				let selectedList = [];
				this.data.fixedSchedulingList.map((item) => {
					if(this.data.currentSelectEdShiftIdList.includes(item.id)){
						selectedList.push(item)	
					}
				})

				this.triggerEvent('confirm', {
					selectedIdList:this.data.currentSelectEdShiftIdList,
					shiftType:this.data.addSchedulingTab,
					selectedList,
				})
			}

			//如果是临时排班需要
			if(this.data.addSchedulingTab == 2){
				//this.triggerEvent('addTemporaryScheduling', this.data.temporarySchedulingList)
				if(this.checkTemporarySchedulingData()){
					this.saveTemporarySchedule();
				}
			}
		},

		//临时排班
		async saveTemporarySchedule(){
			let schedule_list = [];
			let temporarySchedulingList = this.data.temporarySchedulingList;
			if(temporarySchedulingList.length == 1){
				if(this.data.temporaryRestType == 1){
					schedule_list.push({
						start_time:  temporarySchedulingList[0].start_time,
						end_time: temporarySchedulingList[0].end_time,
						rest_start_time: this.data.temporaryRestStartTime,
						rest_end_time: this.data.temporaryRestEndTime,
						type:'0',
						id:temporarySchedulingList[0].id ? temporarySchedulingList[0].id : '0',
						name:temporarySchedulingList[0].name ? temporarySchedulingList[0].name : '',
						cross:'0',
					})

				}
				if(this.data.temporaryRestType == 2){
					schedule_list.push({
						start_time:  temporarySchedulingList[0].start_time,
						end_time: temporarySchedulingList[0].end_time,
						rest_start_time: '',
						rest_end_time: '',
						type:'0',
						id:temporarySchedulingList[0].id ? temporarySchedulingList[0].id : '0',
						name:temporarySchedulingList[0].name ? temporarySchedulingList[0].name : '',
						cross:'0',
					})

				}
				if(this.data.temporaryRestType == 3){
					let rest_start_time = this.data.temporaryRestTimeHourIndex + ':' + this.data.temporaryRestTimeMinuteIndex;

					schedule_list.push({
						start_time:  temporarySchedulingList[0].start_time,
						end_time: temporarySchedulingList[0].end_time,
						rest_start_time: '',
						rest_end_time: rest_start_time,
						type:'0',
						id:temporarySchedulingList[0].id ? temporarySchedulingList[0].id : '0',
						name:temporarySchedulingList[0].name ? temporarySchedulingList[0].name : '',
						cross:'0',
					})
					
				}
			}else{
				temporarySchedulingList.forEach(item => {
					schedule_list.push({
						start_time: item.start_time,
						end_time: item.end_time,
						rest_start_time: '',
						rest_end_time: '',
						type:'0',
						id:item.id ? item.id : '0',
						name:item.name ? item.name : '',  
						cross:'0',
					})
				})
			}
			let res = await this.sumbitTempSchedule(schedule_list);

			if(res.data.errno == 0){
				this.triggerEvent('confirm', {
					selectedIdList:[res.data.data.schedule_list[0].id],
					shiftType:2,
					selectedList:res.data.data.schedule_list,
				})
			}
		},

		sumbitTempSchedule(data){
			//saveTempShift
			let schedule_list = JSON.stringify(data);
			return new Promise((resolve, reject) => {    
				let data = {
					'dmclient': 'pcweb',
					'X-Doumi-Agent': 'weixinqy',
					'team_id': 10,
					'project_id': 18331,
					'task_id': 1724371,
					schedule_list
				}
				dmNetwork.post(dmNetwork.saveTempShift, data, (res) => {
					resolve(res);
				}, (err) => {
					//网络异常处理
					reject(err)
				})
				//resolve(schedule)
			});
		},


		//校验临时排班数据
		checkTemporarySchedulingData(){
      let workTimetList = this.data.temporarySchedulingList;
      let workTimetListLength = workTimetList.length;
      let isCross = false;
      let isRepeat = false;
      let isEndBeforeStart = false;

      for(let i = 0; i < workTimetListLength; i++){
        for(let j = i + 1; j < workTimetListLength; j++){
					let start_time = '2022-01-01 ' + workTimetList[i].start_time;
					let end_time ='2022-01-01 ' +  workTimetList[i].end_time;
					let start_time_j = '2022-01-01 ' + workTimetList[j].start_time;
					let end_time_j = '2022-01-01 ' + workTimetList[j].end_time;
          if(new Date(start_time) < new Date(end_time_j) && new Date(end_time) > new Date(start_time_j)){
            isCross = true;
            break;
          }
        }
      }

      if(isCross){
				wx.showToast({
					title: '工作时间不能重叠',
					icon: 'none',
					duration: 2000
				})
        return false;
      }

      for(let i = 0; i < workTimetListLength; i++){
        for(let j = i + 1; j < workTimetListLength; j++){
					let start_time = '2022-01-01 ' + workTimetList[i].start_time;
					let end_time ='2022-01-01 ' +  workTimetList[i].end_time;
					let start_time_j = '2022-01-01 ' + workTimetList[j].start_time;
					let end_time_j = '2022-01-01 ' + workTimetList[j].end_time;

					if(new Date(start_time) === new Date(start_time_j) && new Date(end_time) === new Date(end_time_j)){
						isRepeat = true;
						break;
					}
        }
      }


      if(isRepeat){
				wx.showToast({
					title: '工作时间不能重复',
					icon: 'none',
					duration: 2000
				})
        return false;
      }

      for(let i = 0; i < workTimetListLength; i++){
				let start_time = '2022-01-01 ' + workTimetList[i].start_time;
				let end_time ='2022-01-01 ' +  workTimetList[i].end_time;

				if(new Date(start_time) > new Date(end_time)){
					isEndBeforeStart = true;
					break;
				}
      }

      if(isEndBeforeStart){
				wx.showToast({
					title: '结束时间不能早于开始时间',
					icon: 'none',
					duration: 2000
				})

        return false;
      }

			if(workTimetListLength == 1 && this.data.temporaryRestType == 1){
				//请填写休息时间
				if(this.data.temporaryRestStartTime == '请选择' || !this.data.temporaryRestEndTime  == '请选择'){
					wx.showToast({
						title: '请填写休息时间',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
			}

      return true;
    },

		handleTemporaryRestStartTimeChange(e){
			const value = e.detail.value;
			let temporaryRestStartTime = this.data.timeRange[0][value[0]] + ':' + this.data.timeRange[1][value[1]];
			this.setData({
				temporaryRestStartTime:temporaryRestStartTime,
				temporaryRestStartTimeIndex:value
			})
		},

		handleTemporaryRestEndTimeChange(e){
			const value = e.detail.value;
			let temporaryRestEndTime = this.data.timeRange[0][value[0]] + ':' + this.data.timeRange[1][value[1]];
			this.setData({
				temporaryRestEndTime:temporaryRestEndTime,
				temporaryRestEndTimeIndex:value
			})
		},

		handleRestTypeRadioChange(e){
			const value = e.detail.value;
			this.setData({
				temporaryRestType:value
			})
		}
	}
});