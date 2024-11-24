//生成当前日期的当前周，上一周，下一周的数据
const generateWeekData = (date) => {
  console.log(date, 666);
  const weekData = [];
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const weekMilliseconds = 7 * dayMilliseconds;
  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const getWeekArray = (startDate) => {
    const weekArray = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate.getTime() + i * dayMilliseconds);
      //datestr 为日期字符串，格式为yyyy-MM-dd 日期小于10的前面补0，如2021-01-01

      let currentDay = currentDate.getDate();
      let day = currentDay < 10 ? "0" + currentDay : currentDay;
      let currentMonth = currentDate.getMonth() + 1;
      let month = currentMonth < 10 ? "0" + currentMonth : currentMonth;
      weekArray.push({
        date: weekDays[
          currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
        ],
        day,
        datestr: `${currentDate.getFullYear()}-${month}-${day}`,
        month: month,
      });
    }
    return weekArray;
  };

  const inputDate = new Date(date);
  const currentDay = inputDate.getDay();
  const startOfWeek = new Date(
    inputDate.getTime() -
      ((currentDay === 0 ? 7 : currentDay) - 1) * dayMilliseconds
  );

  // 上一周
  weekData.push(
    getWeekArray(new Date(startOfWeek.getTime() - weekMilliseconds))
  );
  // 当前周
  weekData.push(getWeekArray(startOfWeek));
  // 下一周
  weekData.push(
    getWeekArray(new Date(startOfWeek.getTime() + weekMilliseconds))
  );
  console.log(weekData, 888);

  return weekData;
};

//解析出用户信息
const analysisuserList = (data) => {
  let userList = [];

  if (data && Array.isArray(data)) {
    let bgIndex = 0;
    data.map((item,index) => {
      if (bgIndex > 4) {
        bgIndex = 0;
      }
      userList.push({
        user_id: item.user_id,
        user_name: item.user_name,
        first_name: item.user_name[0],
        bgcolor:bgIndex
      });
      bgIndex++;
    });
  }

  return userList;
};
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};
export { generateWeekData, analysisuserList, debounce };
