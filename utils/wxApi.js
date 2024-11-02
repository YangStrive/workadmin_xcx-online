/* 检查session是否过期 */
const doumiCheckSession = async () => {
  return new Promise((reslove, reject) => {
    wx.checkSession({
      async success() {
        reslove("success");
      },
      async fail() {
        reslove("fail");
      },
    });
  });
};
/**
 * 检查小程序是否更新
 */
const doumiUpdateManager = async () => {
  return new Promise((reslove, reject) => {
    // 获取小程序更新机制兼容
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: "更新提示",
            content: "有新版发布，请点击更新后使用!",
            success: function (res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                reslove(updateManager);
              } else if (res.cancel) {
                reject('取消更新小程序。')
              }
            },
          });
        }else{
            reject('版本已经是最新的。')
        }
      });
    } else {
      reject('当前微信版本过低，无法使用升级功能，请升级到最新微信版本后重试。');
    }
  });
};
/**
 * 下载小程序新版本并重启应用
 */
const doumiDownLoadAndUpdate = async (updateManager) => {
  return new Promise((reslove, reject) => {
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading();
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
      reslove();
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: "已经有新版本了哟~",
        content: "更新失败，请删除小程序后重新进入使用!",
      });
      reject('更新失败');
    });
  });
};
export default {
  doumiCheckSession,
  doumiUpdateManager,
  doumiDownLoadAndUpdate
};
