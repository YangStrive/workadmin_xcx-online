// pages/confirmWorkTimeDetail/confirmWorkTimeDetail.jsvar 
var dmNetwork = require('../../utils/network.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        team_id: 10,
        project_id: 18331,
        task_id: '',
        schedule_id: '',
        user_id: '',
        date:'',
        extra_info:{},
        work_time_range:[],
        attendance_list:[],
		customStyle: 'background: #ffffff;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);',
        showClickGrid: false,
        overlay: true,
        showUserEditScheedulingMain: false,
        showReplacementCard: false,
        selectedShiftEdit:{},
        schedule_info:[],
        statusTag:'',
		attend_status_list:['考勤正常','全天旷工','考勤中','考勤异常','考勤未开始'],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let schedule_id = options.schedule_id
        let user_id = options.user_id
        let date = options.date
        let team_id = options.team_id
        let project_id = options.project_id
        let task_id = options.task_id
        //根据date 获取 星期几
        let week = this.getWeek(date)
        this.setData({
            schedule_id,
            user_id,
            date,
            team_id,
            project_id,
            task_id,
            week
        })
        this.getDetail()
    },  

    //根据date 获取 星期几
    getWeek(date){
        let week = ['周日','周一','周二','周三','周四','周五','周六']
        return week[new Date(date).getDay()]
    },

    // 获取详情
    getDetail(id){
        let schedule_id = id || this.data.schedule_id
        let user_id = this.data.user_id
        let date = this.data.date
        let team_id = this.data.team_id
        let project_id = this.data.project_id
        let task_id = this.data.task_id

        dmNetwork.post(dmNetwork.checkClockInDetail,{
            schedule_id,
            user_id,
            date,
            team_id,
            project_id,
            task_id
        },(res) => {
            if(res.data.errno == 0){
                let data = res.data.data;
                data.extra_info.firstname = data.extra_info.user_name.substr(0,1);
                this.setData({
                    extra_info:data.extra_info,
                    schedule_info:data.schedule_info,
                    attendance_list:data.attendance_list,
                    selectedShiftEdit:data.schedule_info[0],
                    statusTag:'status_' + this.data.attend_status_list.indexOf(data.extra_info.attend_status)
                })
            }else{
                wx.showToast({
                    title: res.data.errmsg,
                    icon: 'none'
                })
            }
        })
    },

    
    // 删除排班
    handleTapDeleteSchedule(){
        //二次确认
        wx.showModal({
            title: '提示',
            content: '是否删除该人的排班',
            success:(res) => {
                if(res.confirm){
                    this.deleteSchedule()
                }
            }
        })
    },

    deleteSchedule(){
        let schedule_id = this.data.schedule_id
        let user_id = this.data.user_id
        let date = this.data.date
        let team_id = this.data.team_id
        let project_id = this.data.project_id
        let task_id = this.data.task_id
        let data = {
            schedule_id,
            user_id,
            task_id,
            date: this.data.date,
            team_id: this.data.team_id,
            project_id: this.data.project_id,
        }

        dmNetwork.post(dmNetwork.delShiftUser,data,(res) => {
            let data = res.data;
            if(data.errno == 0){
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                })

                setTimeout(() => {
                    this.getDetail()
                },2000)

            }
        })

    },

    handleTapConfirmWorkTime(){
        //二次确认
        wx.showModal({
            title: '提示',
            content: '是否确认该人的工时',
            success:(res) => {
                if(res.confirm){
                    this.confirmWorkTime()
                }
            }
        })

    },  

    //确认工时
    confirmWorkTime(){
        let date_attendances = [{
            user_id:this.data.user_id,
            date:this.data.date,
            task_id:this.data.task_id,
            schedule_id:this.data.schedule_id,
        }]
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
                this.getDetail()
              }, 2000)
            }else{
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none',
                duration: 2000,
              })
            }
          })
    },

    //修改排班
    handleTapEditSchedule(){
		this.setData({
			showUserEditScheedulingMain:true,
            showClickGrid:true,
		})
    },

    //修改排班取消
    handleClickEditShiftCancelBtn(){
        this.setData({
            showUserEditScheedulingMain:false,
            showClickGrid:false,
        })
    },

    //修改排班确认
    async handleClickEditShiftConfirmBtn(e){
		let selectedList = e.detail.selectedList;
		let selectedIdList = e.detail.selectedIdList;
			
		let data = {
			team_id: this.data.team_id,
			project_id: this.data.project_id,
			task_id: this.data.task_id,
			user_id: this.data.user_id,
			record_id:this.data.selectedShiftEdit.record_id,
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
                showClickGrid:false,
            })
            this.getDetail(selectedIdList[0])
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

    //切换tab
    handleTapReplacementCard(){
        this.setData({
            showReplacementCard:true,
            showClickGrid:true,
        })
    },

    //撤回工时确认
    handleTapRetrunWorkTime(){
        wx.showModal({
            title: '提示',
            content: '是否撤回工时确认',
            success:(res) => {
                if(res.confirm){
                    this.retrunWorkTime()
                }
            }
        })
    },

    retrunWorkTime(){
        let date_attendances = [{
            user_id:this.data.user_id,
            date:this.data.date,
            task_id:this.data.task_id,
            schedule_id:this.data.schedule_id,
        }]
        let data = {
        team_id: this.data.team_id,
        project_id: this.data.project_id,
        date_attendances:JSON.stringify(date_attendances),
        }
    
        dmNetwork.post(dmNetwork.retrunClockIn,data, res => {
            if(res.data.errno == 0){
                wx.showToast({
                title: '撤回成功',
                icon: 'success',
                duration: 2000,
                })
                setTimeout(() => {
                this.getDetail()
                }, 2000)
            }else{
                wx.showToast({
                title: res.data.errmsg,
                icon: 'none',
                duration: 2000,
                })
            }
        })
    },

    //取消补卡
    handleClickReplacementCardCancelBtn(){
        this.setData({
            showReplacementCard:false,
            showClickGrid:false,
        })
    },

    //补卡成功
    handleClickReplacementCardConfirmBtn(){
        this.setData({
            showReplacementCard:false,
            showClickGrid:false,
        })

        this.getDetail()
    },

    handleTapCall(){
        wx.makePhoneCall({
            phoneNumber: this.data.extra_info.mobile,
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