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
        schedule_id:'',
        date:'',
        extra_info:{},
        work_time_range:[],
        attendance_list:[]
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
        this.setData({
            schedule_id,
            user_id,
            date,
            team_id,
            project_id,
            task_id
        })
        this.getDetail()
    },

    // 获取详情
    getDetail(){
        let schedule_id = this.data.schedule_id
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
                    work_time_range:data.work_time_range,
                    attendance_list:data.attendance_list
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