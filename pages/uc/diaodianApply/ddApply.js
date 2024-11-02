// pages/uc/diaodianApply/ddApply.js

var dmNetwork = require("../../../utils/network.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeId:1,
        project_id:'',
        team_id:'',
        apply_reason:'',
        storeList:[],
        storeSourceList:[],
        disabled:false,
        applyRecordList:[],
        current_group_id:'',
        target_group_id:'',
        targetStore:'请选择',
        currentStore:'请选择',
        change_start_at:'请选择',
        change_end_at:'请选择',
        hourMinuteSecond: '',//时分，根据需要选择
        timeDivision: '',//时分秒，根据需要选择
        recordListLoading:true,
        applyStatusStyle:{
          1:'pending',
          2:'success',
          3:'reject',
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setData({
        project_id:options.project_id,
        team_id:options.team_id,
      })
      this.getStoreList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    getStoreList(){
      dmNetwork.get(
        dmNetwork.getStoreList,
        {
          project_id:this.data.project_id
        },
        (res) => {
          if(res.data.errno == 0 && Array.isArray(res.data.data)){
            let storeSourceList = res.data.data.filter(item => {
              return item.children.length > 0;
            })

            this.setData({
              storeSourceList,
            })
          }

          this.formatStoreList()
        }
      )
    },

    formatStoreList(firstIndex = 0 ){
      if(this.data.storeSourceList.length == 0) return;

      let firstList = [];
      let secendList = []
      this.data.storeSourceList.map(item => {
        firstList.push(item.name);
      })

      this.data.storeSourceList[firstIndex].children.map(item => {
        secendList.push(item.name)
      })

      this.setData({
        storeList:[firstList,secendList],
      })

    },

    //提交表单
    submitChangeStoreData(){
      if(this.data.disabled) return;
      
      let {
        apply_reason,
        target_group_id,
        current_group_id, 
        project_id,
        change_start_at,
        change_end_at,
        team_id
      } = this.data;

      if(change_start_at == '请选择' || change_end_at == '请选择' || !apply_reason || !target_group_id || !current_group_id){
        wx.showToast({
          title: '请完成必填项',
          icon:'none'
        })
        return;
      }

      if(apply_reason.length > 60 ){
        wx.showToast({
          title: '外出原因不超过60个字符',
          icon:'none'
        })
        return;
      }

      this.setData({
        disabled:true,
      })
      wx.showLoading({
        title: '',
      })
      dmNetwork.post(
        dmNetwork.changeStoreApply,
        {
          change_start_at,
          change_end_at,
          apply_reason,
          target_group_id,
          current_group_id,
          project_id,
          team_id
        },
        (res) => {

          wx.hideLoading()
          if(res.data.errno == 0){
            wx.showToast({
              title: '申请成功',
            })
            setTimeout(() => {
              this.setData({
                activeId:2,
                change_start_at:'请选择',
                change_end_at:'请选择',
                apply_reason:'',
                target_group_id:'',
                current_group_id:'',
                targetStore:'请选择',
                currentStore:'请选择',
              });
              this.getChangeStoreApplyRecordList()
            },1300)
          }else{
            wx.showToast({
              title: res.data.errmsg,
              icon:'error'
            })
          };

          this.setData({
            disabled:false
          })
        },
        ()=>{

          wx.showToast({
            title: '网络错误',
          })
          this.setData({
            disabled:false,
          })
        }
      )
    },

    //切换tab
    handleTabChange(ev){
        let activeId = ev.currentTarget.dataset.activeid;
        this.setData({activeId});
        if(activeId == 2) this.getChangeStoreApplyRecordList()
    },

    //外出店colunm滚动触发
    bindColumnChangeTragetStore(e){
      if(e.detail.column == 0){
        this.formatStoreList(e.detail.value);
      }
    },

    //隶属店colunm滚动触发
    bindColumnChangeCurretStore(e){
      if(e.detail.column == 0){
        this.formatStoreList(e.detail.value);
      }

    },

    //获取申请记录
    getChangeStoreApplyRecordList(){
      wx.showLoading({
        title: '',
      })
      
      dmNetwork.post(
        dmNetwork.changeStoreRecord,
        {
          page:1,
          page_size:100
        },
        (res) => {
          wx.hideLoading()
          if(res.data.errno == 0){
            this.setData({
              applyRecordList:res.data.data.list,
              recordListLoading:false,
            })
          }else{
            wx.showToast({
              title: res.data.errmsg,
              icon:'none'
            })
          }
        }
      )

    },


    //外出店选项变动
    bindSelectorTragetStoreChange(e){
      let data = this.data.storeSourceList[e.detail.value[0]];
      let target_group_id = data.children[e.detail.value[1]].id;

      if(this.data.current_group_id == target_group_id ){
        wx.showToast({
          title: '外出店不能与隶属店相同',
          icon:'none'
        })

        return;
      }
      this.setData({
        targetStore: data.name + '-' + data.children[e.detail.value[1]].name,
        target_group_id,
      })

    },

    //原来店选项变动
    bindSelectorCurrentStoreChange(e){
      let data = this.data.storeSourceList[e.detail.value[0]];
      let current_group_id = data.children[e.detail.value[1]].id;

      if(this.data.target_group_id == current_group_id ){
        wx.showToast({
          title: '隶属店不能与外出店相同',
          icon:'none'
        })

        return;
      }

      this.setData({
        currentStore: data.name + '-' + data.children[e.detail.value[1]].name,
        current_group_id,
      })

    },

    //外出原因
    bandTextareChange(e){
      this.setData({
        apply_reason:e.detail.value
      })
    },

    //外出开始时间
    selectStartDateMinuteChange(e) {
      let time = e.detail.value + '0';
      if(this.data.change_end_at && new Date(time.replace('T',' ')) >= new Date(this.data.change_end_at.replace('T',' '))){
        wx.showToast({
          title: '外出开始时间不能晚于结束时间',
          icon:'none'
        })
        return
      }

      this.setData({
        change_start_at: time,
      })
    },

    //外出结束时间
    selectEndDateMinuteChange(e) {
      let time = e.detail.value + '0';
      if(this.data.change_start_at && new Date(time.replace('T',' ')) <= new Date(this.data.change_start_at.replace('T',' '))){
        wx.showToast({
          title: '外出结束时间不能早于开始时间',
          icon:'none'
        })
        return
      }
      this.setData({
        change_end_at: time,
      })
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