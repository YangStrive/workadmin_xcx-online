// pages/replacementCard/replacementCard.js../../../utils/network.js
var dmNetwork = require('../../utils/network')
Page({
    /**
     * 页面的初始数据
     */
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
    team_id: '',
    project_id: '',
    start_time: '',
    end_time: '',
    apply_reason: '',
    errorReason: '',
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        const { team_id, project_id } = options;
        this.team_id = team_id;
        this.project_id = project_id;
        wx.setStorageSync('fromReplaceMentCard', JSON.stringify({ team_id, project_id }))
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {
        const replacementCardInfo = JSON.parse(wx.getStorageSync('replacementCardInfo'));
        this.start_time = replacementCardInfo.startDisabled ? replacementCardInfo.start_require_time : '';
        this.end_time = replacementCardInfo.endDisabled ? replacementCardInfo.end_require_time : '';
        this.setData({
            replacementCardInfo
        })
    },
    onStartDateChange: function (ev) {
        console.log('onStartDateChange', ev)
        const { value } = ev.detail;
        this.start_time = value;
    },
    onEndDateChange: function (ev) {
        console.log('onEndDateChange', ev)
        const { value } = ev.detail;
        this.end_time = value;
    },
    onTextareaChange: function (ev) {
        console.log('vvvvvvvvvvvvvvvvvvvvvv', ev)
        const { value } = ev.detail;
        this.apply_reason = value;
    },
    textErrorReason: function (e) {
        console.log('vvvvvvvvvvvvvvvvvvvvvv', e)
        this.errorReason = e.detail.value
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
        const { start_time, end_time, apply_reason, team_id, project_id } = this;
        const { replacementCardInfo: { attendance_id, attendance_after_id, task_id, date: day } } = this.data;
        const params = {
            team_id,
            project_id,
            task_id,
            attendance_id,
            attendance_after_id,
            start_time,
            end_time,
            apply_reason,
            day,
        }
        dmNetwork.post(dmNetwork.punch_apply_create, params, (res) => {
            console.log('ressssssss', res)

            const data = res.data;
            if (data.errno == '0') {
                wx.showToast({
                    title: '补卡成功',
                    icon: 'success',
                    duration: 1500,
                })
                setTimeout(() => {
                    that.back();
                }, 1500)
                // const { punch_id, status, status_code } = data.data;
                // this.setData({
                //     isShowDialog: true,
                //     result_statu: 0,
                //     resultText: '补卡成功'
                // })
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
    confirmAtten: function () {
        const that = this
        if (that.data.result_statu == 0) {
            that.back()
        } else {
            const { attendance_id, team_id, project_id, errorReason } = that;
            dmNetwork.get(dmNetwork.abnormal_reason, {
                team_id: team_id,
                project_id: project_id,
                reason: errorReason,
                attendance_id: attendance_id
            }, (res) => {
                if (res.data.errno == 0) {
                    wx.showToast({
                        title: '已发送',
                        icon: 'success',
                        duration: 1500,
                    })
                    setTimeout(function () {
                        that.back()
                    }, 1500)
                } else {
                    wx.showToast({
                        title: res.data.errmsg,
                        icon: "none",
                        duration: 1500
                    })
                }
            }, (error) => {

            })
        }
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
            if (!that.data.replacementCardInfo.task_id) {
                wx.showToast({
                    title: '未识别到task_id，请退出重试！',
                    mask: true,
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            console.log('afsjkejfke', this.data.replacementCardInfo)
            if (!that.data.replacementCardInfo.attendance_id) {
                wx.showToast({
                    title: '未识别到attendance_id，请退出重试！',
                    mask: true,
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            if (!that.start_time) {
                wx.showToast({
                    title: '请选择开始时间！',
                    mask: true,
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            if (!that.end_time) {
                wx.showToast({
                    title: '请选择结束时间！',
                    mask: true,
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            if (!that.apply_reason) {
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {
        wx.removeStorageSync('replacementCardInfo');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    }
})