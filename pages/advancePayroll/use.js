const dmNetwork = require('../../utils/network.js')
const util = require("../../utils/util")

// 获取user工资支付列表
export const geSalaryList = () => {
  return new Promise((resolve, reject) => {
    dmNetwork.get(dmNetwork.geSalaryList, {}, (res) => {
      console.log("新获取工资支付列表", res)
      if (res.data.errno == '0') {
        const list = res.data.data
        resolve(list)
      } else {
        reject(res.data.errmsg)
      }
    }, (err) => {
      reject('网络异常处理')
    })
  })
}
// 查询是否已经签订协议,获取协议protocol_order_id
export const isSignAnAgreement = () => {
  return new Promise((resolve, reject) => {
    dmNetwork.get(dmNetwork.advance_check, {}, (res) => {
      console.log("新查询是否已经签订协议", res)
      if (res.data.errno == '0') {
        const data = res.data.data;
        resolve(data);
      } else {
        reject(res.data.errmsg);
      }
    }, (err) => {
      //网络异常处理
      reject('网络异常处理');
    })
  })
}
// 查询是否是会员
export const isMember = (submitItem = {}) => {
  console.log('eeeeee', submitItem)
  return new Promise((resolve, reject) => {
    const { team_id, project_id } = submitItem;
    dmNetwork.get(dmNetwork.isMember, { team_id, project_id }, (res) => {
      console.log("新查询是否已经成为会员", res)
      if (res.data.errno == '0') {
        const isMember = res.data.data.is_member;
        const goodsId = res.data.data.goods_id;
        if (isMember == 2) {
          reject(res.data.errmsg);
        } else {
          resolve({isMember,goodsId});
        }
      } else {
        reject(res.data.errmsg);
      }
    }, (err) => {
      reject('网络异常');
    })
  })
}
// 提交预支工资申请
export const submitApply = (params) => {
  return new Promise((reslove, reject) => {
    dmNetwork.get(dmNetwork.submitApply, params, (res) => {
      if (res.data.errno == '0') {
        const apply_id = res.data.data.apply_id;
        reslove(apply_id);
      } else {
        reject(res.data.errmsg);
      }
    }, (err) => {
      reject(err);
    })
  })
}
// 签协议
export const protocolSign = (request_data) => {
  return new Promise((resolve, reject) => {
    dmNetwork.post(dmNetwork.protocol_sign, request_data, (res) => {
      if (res.data.errno == 0) {
        resolve()
      } else {
        reject(res.data.errmsg)
      }
    });
  })
}
// 获取支付参数
export const getWxPay = (params) => {
  return new Promise((resolve, reject) => {
    dmNetwork.get(dmNetwork.getWxPay, params, (res) => {
      console.log("获取支付参数", res)
      if (res.data.errno == '0') {
        const data = res.data;
        if (data) {
          resolve(data);
        } else {
          reject('未获取到支付参数，请重试！');
        }
      } else if (res.data.errno == '42303') {
        const data = res.data.data;
        const merrmsg = data.error_list && data.error_list.length ? data.error_list.join(',') : res.data.errmsg;
        reject(merrmsg);
      } else {
        reject(res.data.errmsg);
      }
    }, (err) => {
      reject('网络异常');
    })
  })
}
export const protocol_detail = (protocol_order_ids) => {
  const { protocol_order_id, protocol_sign } = protocol_order_ids[0];
  const url = dmNetwork.protocol_download + '?dmclient=weixinxcx&X-Doumi-Agent=weixinqy&protocol_order_id=' + protocol_order_id + '&protocol_user_id=&protocol_sign=' + protocol_sign;
  wx.downloadFile({
    url: url,
    success: function (res) {
      console.log(res)
      const Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
      wx.openDocument({
        filePath: Path,
        success: function (res) {
          console.log('打开成功');
        }
      })
    },
    fail: function (res) {
      console.log(res);
      wx.showToast({
        title: 'error',
      })
    }
  })
}
// 支付成功通知
export const orderNotice = (params) => {
  return new Promise((resolve, reject) => {
    dmNetwork.post(dmNetwork.orderNotice, params, (res) => {
      if (res.data.errno == 0) {
        resolve()
      } else {
        reject(res.data.errmsg)
      }
    });
  })
}