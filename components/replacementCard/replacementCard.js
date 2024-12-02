// pages/replacementCard/replacementCard.js../../../utils/network.js
var dmNetwork = require('../../utils/network')
Component({
    /**
     * 页面的初始数据
     */
    properties: {
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
				user_id: {
						type: String,
						value: '',
				},
				date: {
						type: String,
						value: '',
				},
				schedule_id: {
						type: String,
						value: '',
				},
        
    },

    data: {
        resultImages: [
            'http://cdn.doumistatic.com/70,8f35c1ac0c4043.png',
            'http://cdn.doumistatic.com/73,8f35c896c5d8ae.png',
            'http://cdn.doumistatic.com/71,8f35cbdf62bf1b.png'
        ],
        result_statu: 0,
        resultText: '补卡成功',
        resultInfo: '',
        isShowDialog: false,
        // 补卡信息
        replacementCardInfo: {},
        startDisabled: false,
        endDisabled: false,
    },
    start_time: '',
    end_time: '',
    apply_reason: '',
    errorReason: '',
    /**
     * 生命周期函数--监听页面加载
     */
    attached () {
    },
    methods: {
        onStartDateChange: function (ev) {
            console.log('onStartDateChange', ev)
            const { value } = ev.detail;
            let start_time = value;
						this.setData({
							start_time
						})
        },
        onEndDateChange: function (ev) {
            console.log('onEndDateChange', ev)
            const { value } = ev.detail;
						let end_time = value;
						this.setData({
							end_time
						})
        },
        onTextareaChange: function (ev) {
            console.log('vvvvvvvvvvvvvvvvvvvvvv', ev)
            const { value } = ev.detail;
						let apply_reason = value;
						this.setData({
							apply_reason
						})
        },
        textErrorReason: function (e) {
            console.log('vvvvvvvvvvvvvvvvvvvvvv', e)
						const { value } = e.detail;
						let errorReason = value;
						this.setData({
							errorReason
						})
        },
        setReplacementCard: function () {
            // this.back();
            // return
            this.validate().then(_ => {
                this.submit()
            })
        },
        submit: function () {
            const that = this;
            const { 
							start_time, 
							end_time, 
							apply_reason, 
							team_id, 
							project_id, 
							task_id,
							date ,
							schedule_id,
							user_id
							} = this.data;
            const params = {
                team_id,
                project_id,
                task_id,
                start_time,
                end_time,
                apply_reason,
								user_id,
								schedule_id,
                day:date
            }
            dmNetwork.post(dmNetwork.reClockIn, params, (res) => {
                console.log('ressssssss', res)

                const data = res.data;
                if (data.errno == '43009') {
                    wx.showToast({
                        title: '补卡成功',
                        icon: 'success',
                        duration: 1500,
                    })
                    that.triggerEvent('confirm')
                } else {
                    wx.showToast({
                        title: data.errmsg,
                        icon: 'error',
                        duration: 1500,
                    })
                }
            }, (error) => {
                wx.showToast({
                    title: '已发送',
                    icon: 'success',
                    duration: 1500,
                })
            }, (network) => {
                wx.showToast({
                    title: '服务器错误，请重试！',
                    icon: 'success',
                    duration: 1500,
                })
            })
        },

        cancelAtten:function(){
            this.triggerEvent('cancel')
        },
        back: function () {
            const that = this;
            wx.navigateBack({
                delta: 1,
            })
            // wx.redirectTo({
            //     url: `/pages/attdance/record/record?team_id=${this.team_id}&&project_id=${this.project_id}`
            // })
        },
        validate: function () {
            const that = this;
            return new Promise((resolve, reject) => {
                if (!that.data.task_id) {
                    wx.showToast({
                        title: '未识别到task_id，请退出重试！',
                        mask: true,
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }

                if (!that.data.start_time) {
                    wx.showToast({
                        title: '请选择开始时间！',
                        mask: true,
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }

                if (!that.data.end_time) {
                    wx.showToast({
                        title: '请选择结束时间！',
                        mask: true,
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }

                if (!that.data.apply_reason) {
                    wx.showToast({
                        title: '请输入缺卡原因！',
                        mask: true,
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
                resolve()
            })
        },
    }
})