import {shift} from './sched.js'

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


	},
	data: {
		// 组件内部数据
		addSchedulingTab: 1,
		shiftList: [],
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

		temporaryRestStartTime: '请选择',
		temporaryRestEndTime: '请选择',
		temporaryRestTimeHourIndex:'',
		temporaryRestTimeMinuteIndex:'',
		restTimeHourList: [1,2,3,4],
		restTimeMinuteList:[0,5,10,15,20,25,30,35,40,45,50,55],
		temporaryRestType: 1,



	},
	attached() {
		console.log('组件实例刚刚被创建');
		this.init()
	},
	methods: {

		// 组件方法
		init(){
			console.log('组件实例刚刚被创建',shift);
			this.setData({
				fixedSchedulingList:shift,
				addSchedulingTab:this.data.shiftType,
				currentSelectEdShiftIdList:this.data.selectedShiftIdList,
			})


			console.log('组件实例刚刚被创建',this.data.currentSelectEdShiftIdList);

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
	
			temporarySchedulingList[index][type] = value;
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
				}
			}
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

      return true;
    },

		handleTemporaryRestStartTimeChange(e){
			const value = e.detail.value;
			this.setData({
				temporaryRestStartTime:value
			})
		},

		handleTemporaryRestEndTimeChange(e){
			const value = e.detail.value;
			this.setData({
				temporaryRestEndTime:value
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