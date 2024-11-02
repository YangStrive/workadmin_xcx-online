function formatTime (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if ((month + '').length == 1) {
    month = '0' + month
  }
  if ((day + '').length == 1) {
    day = '0' + day
  }
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTimeNew (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return year + '-' + month + '-' + day
}

function formatTimeHM (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if ((month + '').length == 1) {
    month = '0' + month
  }
  if ((day + '').length == 1) {
    day = '0' + day
  }
  if ((minute + '').length == 1) {
    minute = '0' + minute
  }

  return hour + ":" + minute
}

function formatTimeDate (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  if ((month + '').length == 1) {
    month = '0' + month
  }
  if ((day + '').length == 1) {
    day = '0' + day
  }
  return year + "年" + month + "月" + day + "日"
}
function formatTimeDate2 (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if ((month + '').length == 1) {
    month = '0' + month
  }
  if ((day + '').length == 1) {
    day = '0' + day
  }
  return year + "-" + month + "-" + day
}
function formatTimeDate3 (opt) {
  var time = (opt.toString()).length === 10 ? opt * 1000 : opt;
  var date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if ((month + '').length == 1) {
    month = '0' + month
  }
  if ((day + '').length == 1) {
    day = '0' + day
  }
  return year + "-" + month + "-" + day
}
function getCurrentYMDHMW () {
  const date = new Date();
  const cur_year = date.getFullYear();
  const cur_month = date.getMonth() + 1;
  const cur_date = date.getDate();
  const weeks_ch = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const currentYM = cur_year + '-' + cur_month;
  const currentYMD = cur_year + '-' + cur_month + '-' + cur_date;
  return {
    cur_year,
    cur_month,
    cur_date,
    weeks_ch,
    currentYM,
    currentYMD
  }
}

function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getQueryString (name) {
  var pages = getCurrentPages(),    //获取加载的页面
    currentPage = pages[pages.length - 1],    //获取当前页面的对象
    options = currentPage.options;
  return name ? options[name] : options;
}

function json2Form (json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
function previewImage (urllist, current) {
  wx.previewImage({ urls: urllist, current: current })
}

function compareVersion (v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * 1447603200 => 2015-11-16
 * 1520923833
 */
function formatDate (unixtime) {
  if ('Invalid Date' == new Date(unixtime) || unixtime == 0) {
    return '未知';
  }
  unixtime *= 1000;

  let ut_year = getLocalTime(unixtime, "yyyy")
  let ut_month = getLocalTime(unixtime, "MM-dd")
  let ut = ut_year + "-" + ut_month;

  //作为标记的今天、昨天、今年时间戳
  let d = new Date();
  let today = getStampFromDate(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
  let yesterday = today - 86400000;
  let year = getStampFromDate(d.getFullYear() + "-01-01");

  // console.log(ut, "today:"+today,"yesterday:"+yesterday, "year:"+year);

  if (unixtime >= today) {//今天 
    return getLocalTime(unixtime, "HH:mm");
  } else if (unixtime >= yesterday && unixtime < today) {//昨天
    return '昨天';
  } else if (unixtime < year) {//小于今年
    return ut;
  } else {//昨天之前
    return ut_month;
  }
}

/**
 * [时间字符串转时间戳]
 * @param  {[String]} dateString [时间字符串，可以有两种格式1：'2016/11/15' 2：'2016-11-15']
 * @return {[Number]} Stamp      [时间戳(毫秒数)]
 */
function getStampFromDate (dateString) {
  dateString = dateString.replace(/-/g, '/')
  let d = new Date(dateString)
  let Stamp = d.getTime()
  return Stamp
}

//日期格式初始化
function getLocalTime (unixtime, pattern) {
  Date.prototype.format = function (pattern) {
    var pad = function (source, length) {
      var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));

      if (string.length < length) {
        pre = (new Array(length - string.length + 1)).join('0');
      }

      return (negative ? "-" : "") + pre + string;
    };

    if ('string' != typeof pattern) {
      return this.toString();
    }

    var replacer = function (patternPart, result) {
      pattern = pattern.replace(patternPart, result);
    }

    var year = this.getFullYear(),
      month = this.getMonth() + 1,
      date2 = this.getDate(),
      hours = this.getHours(),
      minutes = this.getMinutes(),
      seconds = this.getSeconds();

    replacer(/yyyy/g, pad(year, 4));
    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
  };
  var timestr = new Date(parseInt(unixtime));
  var datetime = timestr.format(pattern);
  return datetime;
}

function throttle (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null
  return function (e) {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(e)
      _lastTime = _nowTime
    }
  }
}

function js_date_time (unixtime) {
  var dateTime = new Date(parseInt(unixtime) * 1000)
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());
  var milliseconds = now_new - dateTime;
  // var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  var timeSpanStr = year + '年' + month + '月' + day + '日';
  return timeSpanStr;
}
function accAdd (arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
function accSub (arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
// 格式化金额(https://juejin.cn/post/7028086399601475591)
function formatAmount (money, decimals = 2, symbol = "") {
  //处理四舍五入的精度问题(https://juejin.cn/post/7028841955056418847)
  const formatToFixed = (money, decimals = 2) => {
    return (
      Math.round((parseFloat(money) + Number.EPSILON) * Math.pow(10, decimals)) /
      Math.pow(10, decimals)
    ).toFixed(decimals);
  }
  return formatToFixed(money, decimals).replace(/\B(?=(\d{3})+\b)/g, ",").replace(/^/, `${symbol}`)
}

//返回一个月总天数
function getThisMonthDays (year, month) {
  return new Date(year, month, 0).getDate();
}
//返回1号是星期几
function getFirstDayOfWeek (year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
}

/**
 * 异步错误处理函数
 */
const awaitWrap = (promise) => {
  return promise
    .then(data => [null, data])
    .catch(err => [err, null])
}

// 判断数据类型
function getDataType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

module.exports = {
  formatTime: formatTime,
  json2Form: json2Form,
  formatTimeHM: formatTimeHM,
  formatTimeDate: formatTimeDate,
  getQueryString: getQueryString,
  formatTimeDate2: formatTimeDate2,
  previewImage: previewImage,
  compareVersion: compareVersion,
  formatDate: formatDate,
  getLocalTime: getLocalTime,
  getStampFromDate: getStampFromDate,
  formatTimeDate3: formatTimeDate3,
  formatTimeNew: formatTimeNew,
  throttle: throttle,
  js_date_time: js_date_time,
  awaitWrap,
  accAdd,
  accSub,
  formatAmount,
  getThisMonthDays,
  getFirstDayOfWeek,
  getCurrentYMDHMW,
  getDataType
}

