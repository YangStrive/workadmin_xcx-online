const util = require("../../utils/util");
const dmNetwork = require("../../utils/network.js");
const app = getApp();
// 跳转登录
export function login () {
  wx.reLaunch({
    url: "../uc/login/login"
  });
}
// 检测被邀请的人员是否当前所在小组
export function checkIsSameGroup (data) {
  const promise = new Promise((resolve, reject) => {
    dmNetwork.post(dmNetwork.is_same_group, data, (res) => {
      if (res.data.errno == 0) {
        resolve(res.data.data)
      } else {
        reject(res.data)
      }
    }, (err) => { });
  })
  return util.awaitWrap(promise)
}

// 加入小组
export function changeGroup ({ team_id, project_id, group_id }) {
  const promise = new Promise((resolve, reject) => {
    const group_post_data = {
      team_id,
      project_id,
      group_id
    }
    dmNetwork.post(dmNetwork.change_group, group_post_data, (res) => {
      if (res.data.errno == 0) {
        resolve(res.data.data);
      } else {
        reject(res.data);
      }
    })
  })
  return util.awaitWrap(promise)
}

//获取项目列表
export function getProjectList () {
  const promise = new Promise((resolve, reject) => {
    const data = {
      team_id: 0,
      status: 1,
    }
    dmNetwork.getInBackground(dmNetwork.proJectList, data, (res) => {
      if (res.data.errno == 0) {
        resolve(res.data.data)
      } else if (res.data.errno === 104) {
        login()
      } else {
        reject(res.data)
      }
    }, (err) => {
      reject(err)
    })
  })
  return util.awaitWrap(promise)
}