/**收集器 */
var dmNetwork = require('network.js')
let uuid = '-';
function saveFormid(formid){

  var timestamp = Date.parse(new Date());
  var idsData = {time: timestamp, value: formid}
  var ids 
  var idsStr = wx.getStorageSync("formid")
  if (idsStr == ''){
    ids = []
  }else{
    ids = JSON.parse(idsStr)
  }
  ids.push(idsData)
  wx.setStorageSync("formid", JSON.stringify(ids))
}

function uploadFormid(){
  var idsStr = wx.getStorageSync('formid')
  dmNetwork.postInBackground(dmNetwork.formid_collect, {
    form_id: idsStr
  }, (res) => {
    wx.setStorageSync("formid", '')
  }, (error) => {

  })

}
getUUid()
function dmLogPV(){
  var url = dmNetwork.dmlog + "?uuid=" + uuid + "&ts=" + (new Date()).valueOf() + "&site=miniprogram"
  dmNetwork.getInBackground(url)
  
}

function getUUid() {
  let mathUuid = '';
  mathUuid = wx.getStorageSync('uuid');
  if (!mathUuid) {
    mathUuid = MathUuid();
    wx.setStorage({
      key: 'uuid',
      data: MathUuid
    })
  }
  function MathUuid(len, radix) {
    let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let chars = CHARS, uuidStr = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form   
      for (i = 0; i < len; i++) uuidStr[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form   
      let r;

      // rfc4122 requires these characters   
      uuidStr[8] = uuidStr[13] = uuidStr[18] = uuidStr[23] = '-';
      uuidStr[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as   
      // per rfc4122, sec. 4.1.5   
      for (i = 0; i < 36; i++) {
        if (!uuidStr[i]) {
          r = 0 | Math.random() * 16;
          uuidStr[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuidStr.join('');
  }
  uuid = mathUuid || '-';
}

module.exports={
  saveFormid: saveFormid,
  uploadFormid: uploadFormid,
  getUUid: getUUid,
  uuid: uuid,
  dmLogPV: dmLogPV
}

