// pages/searchPerson/searchPerson.js 
var dmNetwork = require('../../utils/network.js')


Page({

    /**
     * 页面的初始数据
     */
    data: {

        task_id: 0,
        team_id: 10,
        project_id: 18331,
        personList: [],
        focus: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let team_id = options.team_id;
        let project_id = options.project_id;
        //让

        this.setData({
            team_id: team_id,
            project_id: project_id,
        })

        this.search = this.debounce(this.searchUser, 500);

    },

    handleInputSearch(e){
        let key = e.detail.value;
        this.search(key);
    },
    //实现一个防抖函数
    debounce(fn, delay) {
        let timer = null;
        return function() {
            if(timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments);
            }, delay);
        };
    },

    searchUser(value){
        let data = {
            team_id: this.data.team_id,
            project_id: this.data.project_id,
            keyword:value,
            page_size:20,
            page_no:1,
        }
        dmNetwork.get(dmNetwork.searchUser,data, res => {
            if(res.data.errno == 0){
                console.log(res.data.data)
                let personList = res.data.data.list;
                let index = 0;
                personList.forEach(item => {
                    item.checked = false;
                    item.nameIndex = index;
                    item.firstName = item.user_name.substr(0,1);
                    index++;

                    if(index > 4){
                        index = 0;
                    }

                })
                this.setData({
                    personList: res.data.data.list,
                })
            }
        }, res => {
            console.log(res)
        },true)
    },

    handleTapCheckbox(e){
        let index = e.currentTarget.dataset.index;
        let personList = this.data.personList;
        let user_id = e.currentTarget.dataset.userid;
        let item = personList[index];
        item.checked = !item.checked;
        personList[index] = item;

        this.setData({
            personList:personList,
        })
        //调用上一个页面的方法
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setPerson({
            user_id:user_id,
            user_name:item.user_name,
        });
        wx.navigateBack({
            delta: 1
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