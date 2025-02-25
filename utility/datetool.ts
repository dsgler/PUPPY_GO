export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isWeekday(d: Date) {
  return d.getDay() >= 1 && d.getDay() <= 5;
}
const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
export function AddDays(date: Date, days: number) {
  const result = new Date(date); // 创建日期的副本以避免修改原始日期
  result.setTime(result.getTime() + days * oneDay); // 减去指定天数的毫秒数
  return result;
}

/**
 * 周日在最后
 */
export function getDatesInWeek(d: Date): Date[] {
  let dateArr: Date[] = Array.from({ length: 7 });
  let t = d.getDay();
  let off = t === 0 ? -6 : -t + 1;
  for (let i = 0; i < 7; i++) {
    dateArr[i] = AddDays(d, off + i);
  }
  return dateArr;
}
export function getmulti(Minutes: number, d: Date = new Date()) {
  // month 从0开始多少有点逆天
  let obj = {
    date: d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(),
    timeend: d.getTime(),
    timestart: d.getTime() - 60 * 1000 * Minutes,
  };
  return obj;
}

export function getTimeString(t: number) {
  let d = new Date(t);
  let hours = d.getHours().toString();
  let minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getGapTimeString(t: number, isChinese: boolean = false) {
  let totalMinutes = Math.floor(t / 60000); // 将毫秒转换为分钟
  let hours = Math.floor(totalMinutes / 60).toString(); // 计算小时数并补零
  let minutes = (totalMinutes % 60).toString().padStart(2, "0"); // 计算剩余分钟数并补零

  if (isChinese) {
    return `${hours}小时${minutes}分钟`;
  } else {
    return `${hours}:${minutes}`;
  }
}

export function getDateNumber(t: number | Date) {
  let d = new Date(t);
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function dateNumberToDate(t: number) {
  return new Date(
    Math.floor(t / 10000),
    Math.floor((t / 100) % 100),
    Math.floor(t % 100)
  );
}

export function getDatesInMonth(t: Date | number): Date[] {
  let d = new Date(t);
  let month = d.getMonth();
  t = d.getTime();
  t -= d.getDate() * oneDay;
  let ret: Date[] = [];
  while (true) {
    t += oneDay;
    d = new Date(t);
    if (d.getMonth() === month) {
      ret.push(d);
    } else {
      break;
    }
  }
  return ret;
}

export type withDate = { date: Date };
export function divideMonthIntoWeek<T>(src: (T & withDate)[]) {
  // console.log("重新计算");
  const arr: ((T & withDate) | undefined)[][] = [];

  for (const ele of src) {
    if (ele.date.getDate() === 1) {
      const temp: ((T & withDate) | undefined)[] = [];
      for (let j = (ele.date.getDay() + 6) % 7; j > 0; j--) {
        temp.push(undefined);
      }
      temp.push(ele);
      arr.push(temp);
      continue;
    }

    if (ele.date.getDay() === 1) {
      arr.push([]);
    }

    arr[arr.length - 1].push(ele);
  }
  for (let i = 7 - arr[arr.length - 1].length; i > 0; i--) {
    arr[arr.length - 1].push(undefined);
  }
  return arr;
}
