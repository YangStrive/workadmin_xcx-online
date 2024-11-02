// 0:表示test环境 1:表示sim环境  2:表示online环境
const env = 1;
const host = {
  0: "https://saas-test.doumi.com", //测试环境
  1: "https://saas-sim.doumi.com", //sim环境
  2: "https://work.doumi.com", //线上q环境     
};
const bole_host = {
  0: "https://rpo-test.doumi.com", //测试环境
  1: "https://rpo-sim.doumi.com", //sim环境
  2: "https://rpo.doumi.com", //线上q环境
};
var config = {
  APPID: "wxad6f1aea84ff5623",
  QQMAPKEY: [
    "LICBZ-3LBCK-JAIJH-AAKLZ-PBYN3-W6BIX",
    "54CBZ-KP7WU-3E4VL-4RZVS-4AJ6F-XHFS3",
    "3CBBZ-PZMKW-SK2RK-RN55S-KGZJK-ZRB5E",
  ],
  imgDomain: "https://image.doumi.com",
  uploadUrl: "https://image.doumi.com/upload.php",
  uploadUrlInvite: "https://work.doumi.com/sea/api/1.0/client/v1/common/upload/accessory",
  imageBaseUrl: "https://cdn.doumistatic.com/",

  /*         上线前确保是线上环境         */
  /*         上线前确保是线上环境         */
  /*         上线前确保是线上环境         */

  host: host[env],

  bole_host: bole_host[env],

  qf_host: "https://qifu.doumi.com", //工资条-test/sim/online通过绑定host代理
};
module.exports = config;
