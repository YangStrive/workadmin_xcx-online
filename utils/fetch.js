var config = require('../config.js')
var QQMapWX = require('../lib/qqmap-wx-jssdk.js');


// 腾讯地图逆向解析地址
const reverseGeocoder = (latitude, longitude, callback) => {

    var that = this;
    var value = Math.round((Math.random() * 1000))%3
    var qKey = config.QQMAPKEY[value]
    console.log('a111111111',value,qKey)
    var qqlocation = new QQMapWX({
      key: qKey // 必填
    });

    // 调用接口
    qqlocation.reverseGeocoder({
        location: {
            latitude: latitude,
            longitude: longitude
        },
        // get_poi:1,
        poi_options: 'policy=2',
        success: function(res) {
            console.log(res.result.address);
            if (res.status == 0) 
            {
                if(typeof(callback) == 'function')
                    callback(res)
            }
        },
        fail: function(res) {
        },
        complete: function(res) {
            console.log(res);
        }
    });

}
// 腾讯地图点距离
const calculateDistance = (to, callback, failcallback) => {

    var value = Math.round((Math.random() * 1000)) % 3
    var qKey = config.QQMAPKEY[value]
    console.log('aaaaaaaaa', value, qKey)
    var qqmapsdk = new QQMapWX({
      key: qKey // 必填
    });
    
// 调用接口
    qqmapsdk.calculateDistance({
        to:to,
        success: function(res) {
            console.log(res);
            if (res.status == 0) 
            {
                if(typeof(callback) == 'function')
                    callback(res)
            }
        },
        fail: function (res) {
          failcallback && failcallback(res);
        },
        complete: function(res) {
            console.log(res);
        }
    });
}

const calculateDistanceFT = (form,to, callback, failcallback) => {
  var value = Math.round((Math.random() * 1000)) % 3
  var qKey = config.QQMAPKEY[value]
  var qqmapsdk = new QQMapWX({
    key: qKey // 必填
  });

  // 调用接口
  qqmapsdk.calculateDistance({
    form: form,
    to: to,
    success: function (res) {
      console.log(res);
      if (res.status == 0) {
        if (typeof (callback) == 'function')
          callback(res)
      }
    },
    fail: function (res) {
      failcallback && failcallback(res);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}

module.exports = {
    reverseGeocoder: reverseGeocoder,
    calculateDistance:calculateDistance,
    calculateDistanceFT: calculateDistanceFT
}

 
