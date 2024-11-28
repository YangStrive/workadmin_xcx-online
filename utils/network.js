var config = require('../config.js')

var dmlog = "https://analytics.doumi.com/wechatly.gif"
//我的工作
var mywork = config.host + '/sea/api/1.0/client/v1/project/get/mywork';
// 我的工作考勤排行榜排在多少名
var myworkRanking = config.host + '/sea/api/1.0/client/v1/attendance/ranking';
var lalg2city = config.host + '/sea/api/1.0/client/v1/common/city/latlng';


//微信登录
var session = config.host + '/sea/api/1.0/client/v1/project/get/session';
//获取项目列表
var proJectList = config.host + '/sea/api/1.0/client/v1/project/list/get';
//考勤重新打卡
var kqupdate = config.host + '/sea/api/1.0/client/v1/attendance/attendance/update';
//考勤打卡
var kqadd = config.host + '/sea/api/1.0/client/v1/attendance/attendance/add';
//公告列表
var noticelist = config.host + '/sea/api/1.0/client/v1/notice/list';
//获取手机验证码
var noticelist = config.host + '/sea/api/1.0/client/v1/';
//考勤详情
var noticelist = config.host + '/sea/api/1.0/client/v1/notice/list';
//加入项目邀请
var inviteProject = config.host + '/sea/api/1.0/client/v1/group/invite_wechat';

var invitePosition = config.host + '/sea/api/1.0/client/v1/common/geography/get';

var inviteAdd = config.host + '/sea/api/1.0/client/v1/protocol/check';
//表单项列表
var formitemlist = config.host + '/sea/api/1.0/client/v1/form/info';
//上报位置需要参数
var commitDataSetting = config.host + '/sea/api/1.0/client/v1/sign/project/setting';

var commitData = config.host + '/sea/api/1.0/client/v1/sign/user/submit';
//提交表单
var reportform = config.host + '/sea/api/1.0/client/v1/form/report';
var formdetail = config.host + '/sea/api/1.0/client/v1/form/user/report/info';

var checkNeedInsure = config.host + '/sea/api/1.0/client/v1/insurance/user_info/get'

var getInsure = config.host + '/sea/api/1.0/client/v1/insurance/user_info/set'

var attdanceMonthStatus = config.host + '/sea/api/1.0/client/v1/attendance/user_attendance_status_month'
var attdanceMonthStatus2 = config.host + '/sea/api/1.0/client/v1/attendance/user_attendance_status_month2'
var punch_apply_create = config.host + '/sea/api/1.0/client/v1/attendance/punch_apply_create'

var attdanceDetail = config.host + '/sea/api/1.0/client/v1/attendance/user_attendance_stats'

var positionList = config.host + '/sea/api/1.0/client/v1/sign/user/list'


var login = config.host + "/sea/api/1.0/client/v1/wechatapp/login"

//保险邀请
var bxInvite = config.host + '/sea/api/1.0/client/v1/insurance/order/order_info/get';

var bxVcode = config.host + '/sea/api/1.0/client/v1/insurance/msg/get';

var bxVcodeCheck = config.host + '/sea/api/1.0/client/v1/insurance/msg/check';

var bxprotocol = config.host + '/sea/api/1.0/client/v1/protocol/check';
//获取表单列表
var getformlist = config.host + '/sea/api/1.0/client/v1/form/user/report/list';

//删除提交表单
var delform = config.host + '/sea/api/1.0/client/v1/form/user/report/del';

var exitProject = config.host + '/sea/api/1.0/client/v1/project/user/quit';
//获取个人信息
var getuserinfo = config.host + '/sea/api/1.0/client/v1/user/info';
//获取个人活体验证信息
var getFaceResult = config.host + '/sea/api/1.0/client/v1/user/faceid/get_result';
//获取个人活体验证token
var geFaceToken = config.host + '/sea/api/1.0/client/v1/user/faceid/get_token';
//获取公告详情
var getGgDetail = config.host + '/sea/api/1.0/client/v1/notice/user/detail';
//公告确认判断
var checkreport = config.host + '/sea/api/1.0/client/v1/notice/user/report';
//获取验证码 
var getcode = config.host + '/sea/api/1.0/client/v1/wechatapp/login/sendcode';
//获取图形验证码
var getTxcode = config.host + '/sea/api/1.0/client/v1/wechatapp/gettxcode';

var getBindBankCardCode = config.host + '/sea/api/1.0/client/v1/user/sendcode';
//手机号登录
var phonelogin = config.host + '/sea/api/1.0/client/v1/wechatapp/login'
//考勤信息备注
var abnormal_reason = config.host + '/sea/api/1.0/client/v1/attendance/abnormal_reason/add'

var checkAddress = config.host + '/sea/api/1.0/client/v1/attendance/position/check'
//退出登录
var exitLogin = config.host + '/sea/api/1.0/client/v1/wechatapp/unbind_account'
//排班记录
var user_date_schedule = config.host + '/sea/api/1.0/client/v1/attendance/user_date_schedule'

var user_quit_project = config.host + '/sea/api/1.0/client/v1/permission/application'

var attendance_position = config.host + '/sea/api/1.0/client/v1/attendance/attendance_position'


var attendance_update = config.host + '/sea/api/1.0/client/v1/attendance/attendance/update'

var formid_collect = config.host + '/sea/api/1.0/client/v1/wechatapp/collect'

var overtime_add = config.host + '/sea/api/1.0/client/v1/overtime/add'

var overtime_list = config.host + '/sea/api/1.0/client/v1/overtime/index'
var flex_work_list = config.host + '/sea/api/1.0/client/v1/attendance/attendance_task_autonomy_list'

var flex_work_times = config.host + '/sea/api/1.0/client/v1/attendance/attendance_task_autonomy_date'

var flex_work_apply = config.host + '/sea/api/1.0/client/v1/attendance/attendance_task_autonomy_apply'

var change_phone_getcode = config.host + '/sea/api/1.0/client/v1/common/msg/get'

var change_phone = config.host + '/sea/api/1.0/client/v1/user/mobile/edit'

var overtime_delete = config.host + '/sea/api/1.0/client/v1/overtime/delete'

var location_feedback = config.host + '/sea/api/1.0/client/v1/user/feedback'

var rewarddetail = config.host + '/sea/api/1.0/client/v1/reward/reward_rule/get'

var rewardpraise = config.host + '/sea/api/1.0/client/v1/reward/rank/do_praise'

var rewardlist = config.host + '/sea/api/1.0/client/v1/attendance/list'

var servertime = config.host + '/sea/api/1.0/client/v1/common/time/get'

var update_userinfo = config.host + '/sea/api/1.0/client/v1/user/info/edit'

//被邀请的小组是否当前所在小组
var is_same_group = config.host + '/sea/api/1.0/client/v1/group/is_same'
//更换小组
var change_group = config.host + '/sea/api/1.0/client/v1/group/change_group'

var update_userinfo = config.host + '/sea/api/1.0/client/v1/user/info/edit'
//获取钱包余额
var getwallet = config.host + '/sea/api/1.0/client/v1/wallet/get'
//获取钱包流水
var getwalletrecord = config.host + '/sea/api/1.0/client/v1/wallet/record/get'
//银行卡提现
var bankWithdrawalway = config.host + '/sea/api/1.0/client/v1/wallet/bank_put_forward'
//获取是否实名认证
var getauthentication = config.host + '/sea/api/1.0/client/v1/user/check_real_name_authentication'
//获取用人单位
var getCompany = config.host + '/sea/api/1.0/client/v1/user/employercompany'
// 获取表单字段
var getFormFields = config.host + '/sea/api/1.0/client/v1/common/social/get'
//实名认证
var doauthentication = config.host + '/sea/api/1.0/client/v1/user/real_name_authentication'
//获取提现方式
var withdrawalway = config.host + '/sea/api/1.0/client/v1/wallet/withdraw/mode/get'
//获取提现方式详细
var withdrawaldetail = config.host + '/sea/api/1.0/client/v1/wallet/withdraw/mode_detail/get'
//获取提现方式
var bindwithdrawal = config.host + '/sea/api/1.0/client/v1/wallet/bind'
//绑定微信账号
var bindwx = config.host + '/sea/api/1.0/client/v1/wallet/bind'
//解绑微信账号
var unbindwx = config.host + '/sea/api/1.0/client/v1/wallet/remove_bind'
//获取提现code
var getwithdrawalcode = 'https://jz-c-test.doumi.com/api/mini/client/validatecode'
//验证提现验证码
var checkcode = config.host + '/sea/api/1.0/client/v1/wallet/withdraw/msg/check'
//确认提现
var confirmwithdrawal = config.host + '/sea/api/1.0/client/v1/wallet/put_forward'
//获取验证码
var msg_get = config.host + '/sea/api/1.0/client/v1/wallet/withdraw/msg/get'
//新体现接口
var new_put_forward = config.host + '/sea/api/1.0/client/v1/wallet/new_put_forward'

//广告卡片
var ad_card = config.host + '/sea/api/1.0/client/v1/cloud/card/get'

//检查是否有未签订的电子合同
var check_protocol = config.host + '/sea/api/1.0/client/v1/protocol/checkV3'

//获取电子合同模板
var get_template = config.host + '/sea/api/1.0/client/v1/protocol/template/getV2'
//签订电子合同发送短信验证码
var protocol_msg_get = config.host + '/sea/api/1.0/client/v1/protocol/msg/get'
//获取合同详情
var protocol_detail = config.host + '/sea/api/1.0/client/v1/protocol/get'
// 合同列表
var protocol_list = config.host + '/sea/api/1.0/client/v1/protocol/list/get'
var protocol_sign = config.host + '/sea/api/1.0/client/v1/protocol/sign/add'
var protocol_download = config.host + '/sea/api/1.0/client/v1/protocol/download'

//灵云向伯乐导量统计
var drainage = config.host + '/sea/api/1.0/client/v1/project/bole/statistics'

//获取是否显示灵云向伯乐导量统计的按钮
var get_drainage = config.host + '/sea/api/1.0/client/v1/project/bole_entry/get'

//更新用户 unionId 
var update_account = config.host + '/sea/api/1.0/client/v1/wechatapp/update_account'

var detail_url = config.bole_host + '/api/interview/getcustomer'
var sigin_in_url_new = config.bole_host + '/api/interview/newUserCheckin'
var sigin_in_url_old = config.bole_host + '/api/interview/oldUserCheckin'


// 离职管理相关接口
var get_mywork_list = config.host + '/sea/api/1.0/client/v1/project/get/mywork_list'
var get_myquit_info = config.host + '/sea/api/1.0/client/v1/leaveapply/get/addpage'
var get_mystatus_info = config.host + '/sea/api/1.0/client/v1/leaveapply/info/get'
var create_recommend = config.host + '/sea/api/1.0/client/v1/leaveapply/create'
//检测是否实名认证
var check_real_name = config.host + '/sea/api/1.0/client/v1/user/check_real_name_authentication'
//检测实名认证
var nameAuthentication = config.host + '/sea/api/1.0/client/v1/user/real_name_authentication'

// 判断是否需要弹出微众弹窗
var check_we = config.host + '/sea/api/1.0/client/v1/notify/register/check'
// 记录用户微众信息
var record_we = config.host + '/sea/api/1.0/client/v1/notify/record/add'

// 回访任务接口-------------------------------------start

// 获取回访任务筛选条件
var select_visit_list = config.host + '/sea/api/1.0/client/v1/visit/select_visit_list'
var get_visit_list = config.host + '/sea/api/1.0/client/v1/visit/get_visit_list'
var get_visit_history = config.host + '/sea/api/1.0/client/v1/visit/get_visit_history'
var add_visit_record = config.host + '/sea/api/1.0/client/v1/visit/add_visit_record'
var get_visit_count = config.host + '/sea/api/1.0/client/v1/visit/get_visit_count'

// 标记离职
var member_remove = config.host + '/sea/api/1.0/client/v1/visit/member_remove'
// 获取首页信息
var getIndexInfo = config.host + '/sea/api/1.0/client/v1/navigation/xcxindex'


//身份证认证接口
var auth = config.host + '/sea/api/1.0/client/v1/user/real_name_auth_xcx'

//获取认证信息
var get_auth_info = config.host + '/sea/api/1.0/client/v1/user/get_real_name_auth_xcx'
var unbindBankCard = config.host + '/sea/api/1.0/client/v1/user/info/unbind_bank_card'
// 回访任务接口-------------------------------------end
var bindBankCard = config.host + '/sea/api/1.0/client/v1/user/info/bind_bank_card'
//发送离职申请验证码
var apply_quit_code=config.host+'/sea/api/1.0/client/v1/common/msg/get'
//校验离职申请验证码
var check_quit_code=config.host+''
//用户续签状态检查
var canRenewTheContract=config.host+'/sea/api/1.0/client/v1/protocol/renew/check'
//续签合同
var renewTheContract=config.host+'/sea/api/1.0/client/v1/protocol/renew'
//我的驾照
var driving_license=config.host+'/sea/api/1.0/client/v1/user/driver_license_info/get'
//提交证件信息
var submit_driver_license_info=config.host+'/sea/api/1.0/client/v1/user/driver_license_info/edit'
// 预支付工资列表
var geSalaryList=config.host+'/sea/api/1.0/client/v1/wage/payable/userlist'
// 提交申请预支付工资列表
var submitApply=config.host+'/sea/api/1.0/client/v1/wage/advance/create'
// 提交申请预支付工资详情
var getSalaryDetail=config.host+'/sea/api/1.0/client/v1/wage/advance/apply'
// 查询是否签订协议
var advance_check=config.host+'/sea/api/1.0/client/v1/protocol/advance_check'
// 是否是会员
var isMember=config.host+'/sea/api/1.0/client/v1/wage/user/check'
// 获取微信支付参数
var getWxPay=config.host+'/sea/api/1.0/client/v1/wage/advance/membership/create'
// 支付成功通知
var orderNotice=config.host+'/sea/api/1.0/client/v1/wage/advance/membership/order/query' //orderNotice

//获取门店
const getStoreList = config.host + '/sea/api/1.0/client/v1/changestore/select_list'
const changeStoreApply = config.host + '/sea/api/1.0/client/v1/changestore/create'
const changeStoreRecord = config.host + '/sea/api/1.0/client/v1/changestore/list'

//休息打卡
const restClock = config.host + '/sea/api/1.0/client/v1/attendance/attendance/add_rest'
//新签约接口
const newESinging = config.host + '/sea/api/1.0/client/v1/protocol/sign_url/get'
//上报签约成功接口
const reportSignSuccess = config.host + '/sea/api/1.0/client/v1/protocol/sign_url/notify'

//获取排班详情
const getScheduleDetail = config.host + '/sea/api/1.0/client/v1/attendance/user_schedule2'

//获取排班
const getShiftList = config.host + '/sea/api/1.0/client/v1/attendance/task_schedule2'
//保存临时班次
const saveTempShift = config.host + '/sea/api/1.0/client/v1/attendance/task_schedule/add'
//删除排班
const delShift = config.host + '/sea/api/1.0/client/v1/attendance/del_schedule_user'
//给人排班
const giveShift = config.host + '/sea/api/1.0/client/v1/attendance/user_schedule/set'
//删除某个人某个的排班
const delShiftUser = config.host + '/sea/api/1.0/client/v1/attendance/del_ss_user'
///sea/api/1.0/client/v1/attendance/confirm_list
//待确认工时列表
const clockInList = config.host + '/sea/api/1.0/client/v1/attendance/detail'
//重新补卡
const reClockIn = config.host + '/sea/api/1.0/client/v1/attendance/add_punch'

//查看考勤
const checkClockIn = config.host + '/sea/api/1.0/client/v1/attendance/view_list'
//确认工时列表/sea/api/1.0/client/v1/attendance/confirm_list
const confirmClockInList = config.host + '/sea/api/1.0/client/v1/attendance/confirm_list'
//确认工时/sea/api/1.0/client/v1/attendance/confirm
const confirmClockIn = config.host + '/sea/api/1.0/client/v1/attendance/confirm'

//搜索用户
const searchUser = config.host + '/sea/api/1.0/client/v1/group/member_search'
// get请求
const get = (host, params, callbacksuccess, callbackfail, disLoading) => {
  if (!disLoading)
    wx.showToast({
      icon: 'loading',
      title: '加载中...',
      mask: true
    })
  var app = getApp();
  var cookie = ''
  if (null != app.globalData.userInfo) {
    cookie = app.globalData.userInfo.cookie
  }
  wx.request({
    url: host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinqy",
    data: params,
    header: {
      "Content-Type": "application/json",
      "Cookie": cookie
    },
    success: (res) => {
      wx.hideToast()

      if (res.data.errno != undefined || res.data.code != undefined) {
        if(res.data.errno==104){
          wx.reLaunch({
            url: "/pages/uc/login/login",
          });
          return
        }
        if (typeof (callbacksuccess) == 'function')
          callbacksuccess(res)
      }
    },
    fail: function (err) {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })

}


const getInBackground = (host, params, callbacksuccess, callbackfail) => {
  var app = getApp();
  var cookie = ''

  if (app != undefined && null != app.globalData.userInfo) {
    cookie = app.globalData.userInfo.cookie
  }
  // console.log(host,"cacasca")
  // console.log(host.indexOf("?"),"ccccc")
  var url = host
  if (host.indexOf("?") == -1) {
    url = host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinqy"
  }
  // console.log(url)
  wx.request({
    url: url,
    data: params,
    header: {
      "Content-Type": "application/json",
      "Cookie": cookie
    },
    success: (res) => {

      if (res.data.errno != undefined || res.data.code != undefined) {
        if (typeof (callbacksuccess) == 'function')
          callbacksuccess(res)
      }
    },
    fail: function (err) {
      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })

}

//获取今日工作的考勤排行榜排在多少名
const getMyworkRanking = (host, params, callbacksuccess, callbackfail) => {
  var app = getApp();
  var cookie = ''
  if (null != app.globalData.userInfo) {
    cookie = app.globalData.userInfo.cookie
  }
  wx.request({
    url: host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinqy",
    data: params,
    header: {
      "Content-Type": "application/json",
      "Cookie": cookie
    },
    success: (res) => {

      if (res.data.errno != undefined || res.data.code != undefined) {
        if (typeof (callbacksuccess) == 'function')
          callbacksuccess(res)
      }
    },
    fail: function (err) {
      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })

}

// post 请求
const post = (host, params, callbacksuccess, callbackfail, disLoading=true) => {
  if (disLoading){
    wx.showToast({
      icon: 'loading',
      title: '加载中...',
      mask: true
    })
  }
  var app = getApp();
  if (null != app.globalData.userInfo) {
    var cookie = app.globalData.userInfo.cookie
  }
  wx.request({ //weixinxcx
    url: host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinxcx",
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie,
      "AccessToken": " LmRlaxA+Ms/BTJMj+vNCVQ1CFshZPgIaEWyzFooW4nDdkhb4nFsHCtRZpjOf41e0zFfT7Zi6",
    },
    method: 'POST',
    success: (res) => {
      if (disLoading){
        wx.hideToast()
      }
      

      if (res.data.errno != undefined || res.data.code != undefined) {
        if(res.data.errno==104){
          wx.reLaunch({
            url: "/pages/uc/login/login",
          });
          return
        }

        if (typeof (callbacksuccess) == 'function') {

          callbacksuccess(res)
        }
      }

    },
    fail: function (err) {

      wx.showToast({
        title: '网络连接失败',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })
}

const postInBackground = (host, params, callbacksuccess, callbackfail) => {

  var app = getApp();
  if (null != app.globalData.userInfo) {
    var cookie = app.globalData.userInfo.cookie
  }
  wx.request({ //weixinxcx
    url: host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinxcx",
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie,
      "AccessToken": " LmRlaxA+Ms/BTJMj+vNCVQ1CFshZPgIaEWyzFooW4nDdkhb4nFsHCtRZpjOf41e0zFfT7Zi6",
    },
    method: 'POST',
    success: (res) => {


      if (res.data.errno != undefined || res.data.code != undefined) {

        if (typeof (callbacksuccess) == 'function') {

          callbacksuccess(res)
        }
      }

    },
    fail: function (err) {
      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })
}


const upload = (filePath, name, formData, success, fail) => {
  wx.uploadFile({
    url: config.uploadUrl,
    filePath: filePath,
    name: name,
    formData: formData,
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function (res) {

      if (res.data == '') {
        fail(res)
        return
      }
      var data = JSON.parse(res.data);
      var result = [];
      for (var i = 0; i < data.info.length; i++) {
        var resultData = {}
        resultData.thumb_url = config.imageBaseUrl + data.info[i].thumbUrl
        resultData.url = config.imageBaseUrl + data.info[i].url
        result.push(resultData)
      }

      success(result);
    },
    fail: function (res) {

      fail(res)
    }
  });

}

const uploadInvite = (filePath, name, formData, success, fail) => {
  wx.uploadFile({
    url: config.uploadUrlInvite,
    filePath: filePath,
    name: name,
    formData: formData,
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function (res) {
      

      if (res.data == '') {
        fail(res)
        return
      }
      var data = JSON.parse(res.data);
      console.log('inviteee>>>>',data);
      var result = [
        {name:data.data.file_name,url:data.data.file_url}
      ];
      // for (var i = 0; i < data.info.length; i++) {
      //   var resultData = {}
      //   resultData.thumb_url = config.imageBaseUrl + data.info[i].url
      //   resultData.url = config.imageBaseUrl + data.info[i].url
      //   result.push(resultData)
      // }

      success(result);
    },
    fail: function (res) {

      fail(res)
    }
  });

}


const getSim = (host, params, callbacksuccess, callbackfail) => {
  wx.showToast({
    title: '数据加载中...',
    icon: 'loading',
  })
  wx.request({
    url: host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinxcx",
    data: params,
    header: {
      "Content-Type": "application/json",
      "Cookie": "dm_userinfo=125066; doumi_melon=eyJpdiI6IktxQXNPbkordDN4Y0FtaWUrQkNYWFE9PSIsInZhbHVlIjoiTDlFdkp2eHlSQlNMXC93dytYK3cwUnVkZHYyc0FzTklsN3VRNkdNb1lMVEhINEN2d0c3eHB2RlVJMllIYk94VGdSNHJpaTA0U1wvNm11eWhTeGU2aG80dz09IiwibWFjIjoiNmI3ODU1Mzk0NTUwNjcxOWY5NDJmZWVhODMxYmI1MjlkNTUwMmIzZWVlNGFkYTkxN2RmZDlhY2YxMTkxZjhlZSJ9",
      "AccessToken": " LmRlaxA+Ms/BTJMj+vNCVQ1CFshZPgIaEWyzFooW4nDdkhb4nFsHCtRZpjOf41e0zFfT7Zi6",
    },
    success: (res) => {
      wx.hideToast()
      if (res.data.errno) {
        if (typeof (callbacksuccess) == 'function')
          callbacksuccess(res)
      }
    },
    fail: function (err) {
      wx.hideToast()
      console.log(err, 666)
      console.log(err)

      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })

}

const postSim = (host, params, callbacksuccess, callbackfail) => {
  wx.showToast({
    title: '数据加载中...',
    icon: 'loading'
  })

  wx.request({
    url: host + "?dmclient=weixinxcx&X-Doumi-Agent=weixinxcx",
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "dm_userinfo=125066; doumi_melon=eyJpdiI6IktxQXNPbkordDN4Y0FtaWUrQkNYWFE9PSIsInZhbHVlIjoiTDlFdkp2eHlSQlNMXC93dytYK3cwUnVkZHYyc0FzTklsN3VRNkdNb1lMVEhINEN2d0c3eHB2RlVJMllIYk94VGdSNHJpaTA0U1wvNm11eWhTeGU2aG80dz09IiwibWFjIjoiNmI3ODU1Mzk0NTUwNjcxOWY5NDJmZWVhODMxYmI1MjlkNTUwMmIzZWVlNGFkYTkxN2RmZDlhY2YxMTkxZjhlZSJ9",
      "AccessToken": " LmRlaxA+Ms/BTJMj+vNCVQ1CFshZPgIaEWyzFooW4nDdkhb4nFsHCtRZpjOf41e0zFfT7Zi6",
    },
    method: 'POST',
    success: (res) => {
      console.log(res.data)
      wx.hideToast()
      if (res.data.errno == 0) {
        if (typeof (callbacksuccess) == 'function')
          callbacksuccess(res)
      }
    },
    fail: function (err) {

      wx.hideToast()
      console.log(err)
      if (typeof (callbackfail) == 'function')
        callbackfail(err)
    }
  })
}



module.exports = {
  mywork: mywork, // 我的工作
  myworkRanking: myworkRanking, // 我的工作考勤排行榜排在多少名
  session: session,
  proJectList: proJectList,
  // get: getSim,
  // post: postSim,
  getInBackground: getInBackground,
  getMyworkRanking: getMyworkRanking,
  postInBackground: postInBackground,
  get: get,
  post: post,
  kqupdate: kqupdate,
  kqadd: kqadd,
  noticelist: noticelist,
  upload: upload,
  uploadInvite:uploadInvite,
  inviteProject: inviteProject,
  formitemlist: formitemlist,
  commitDataSetting: commitDataSetting,
  commitData: commitData,
  formdetail: formdetail,
  attdanceMonthStatus: attdanceMonthStatus,
  attdanceMonthStatus2,
  punch_apply_create:punch_apply_create,
  positionList: positionList,
  attdanceDetail: attdanceDetail,
  getformlist: getformlist,
  bxInvite: bxInvite,
  bxVcode: bxVcode,
  bxVcodeCheck: bxVcodeCheck,
  bxprotocol: bxprotocol,
  login: login,
  reportform: reportform,
  delform: delform,
  invitePosition: invitePosition,
  exitProject: exitProject,
  getuserinfo: getuserinfo,
  getFaceResult:getFaceResult,
  geFaceToken:geFaceToken,
  getGgDetail: getGgDetail,
  checkreport: checkreport,
  inviteAdd: inviteAdd,
  checkNeedInsure: checkNeedInsure,
  getInsure: getInsure,
  getcode: getcode,
  getTxcode: getTxcode,
  phonelogin: phonelogin,
  abnormal_reason: abnormal_reason,
  checkAddress: checkAddress,
  exitLogin: exitLogin,
  user_date_schedule: user_date_schedule,
  user_quit_project: user_quit_project,
  attendance_position: attendance_position,
  attendance_update: attendance_update,
  formid_collect: formid_collect,
  flex_work_list: flex_work_list,
  flex_work_times: flex_work_times,
  flex_work_apply: flex_work_apply,
  change_phone_getcode: change_phone_getcode,
  change_phone: change_phone,
  formid_collect: formid_collect,
  overtime_add: overtime_add,
  overtime_list: overtime_list,
  overtime_delete: overtime_delete,
  rewarddetail: rewarddetail,
  rewardpraise: rewardpraise,
  servertime: servertime,
  rewardlist: rewardlist,
  update_userinfo: update_userinfo,
  is_same_group: is_same_group,
  change_group: change_group,

  getwallet: getwallet,
  getwalletrecord: getwalletrecord,
  bankWithdrawalway:bankWithdrawalway,
  getauthentication: getauthentication,
  getFormFields:getFormFields,
  getCompany,
  doauthentication: doauthentication,
  withdrawalway: withdrawalway,
  withdrawaldetail: withdrawaldetail,
  bindwithdrawal: bindwithdrawal,
  bindwx: bindwx,
  unbindwx: unbindwx,
  getwithdrawalcode: getwithdrawalcode,
  checkcode: checkcode,
  confirmwithdrawal: confirmwithdrawal,
  msg_get: msg_get,
  new_put_forward: new_put_forward,
  ad_card: ad_card,
  update_account: update_account,

  check_protocol: check_protocol,
  protocol_msg_get: protocol_msg_get,
  protocol_detail: protocol_detail,
  protocol_list: protocol_list,
  protocol_sign: protocol_sign,
  protocol_download: protocol_download,
  drainage: drainage,
  get_drainage: get_drainage,

  detail_url: detail_url,
  sigin_in_url_new: sigin_in_url_new,
  sigin_in_url_old: sigin_in_url_old,
  location_feedback: location_feedback,
  dmlog: dmlog,
  lalg2city: lalg2city,
  get_mywork_list,
  get_myquit_info,
  get_mystatus_info,
  create_recommend,
  check_real_name: check_real_name,
  nameAuthentication: nameAuthentication,
  select_visit_list: select_visit_list,
  get_visit_list: get_visit_list,
  get_visit_history: get_visit_history,
  add_visit_record: add_visit_record,
  get_visit_count: get_visit_count,
  member_remove: member_remove,
  auth: auth,
  get_auth_info: get_auth_info,
  getBindBankCardCode: getBindBankCardCode,
  unbindBankCard: unbindBankCard,
  bindBankCard: bindBankCard,
  get_template: get_template,
  check_we: check_we,
  record_we: record_we,
  getIndexInfo: getIndexInfo,
  apply_quit_code:apply_quit_code,
  canRenewTheContract:canRenewTheContract,
  renewTheContract:renewTheContract,
  driving_license:driving_license,
  submit_driver_license_info:submit_driver_license_info,
  geSalaryList,
  submitApply,
  getSalaryDetail,
  advance_check,
  isMember,
  getWxPay,
  orderNotice,
  getStoreList,
  changeStoreApply,
  changeStoreRecord,
  restClock,
  newESinging,
  reportSignSuccess,
  getScheduleDetail,
  getShiftList,
  saveTempShift,
  delShift,
  giveShift,
  delShiftUser,
  clockInList,
  reClockIn,
  checkClockIn,
  confirmClockInList,
  confirmClockIn,
  searchUser,
}
