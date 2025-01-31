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

export function getDatesByWeek(d: Date): Date[] {
  let dateArr: Date[] = Array.from({ length: 7 });
  let t = d.getDay();
  let off = t === 0 ? -6 : -t + 1;
  for (let i = 0; i < 7; i++) {
    dateArr[i] = AddDays(d, off + i);
  }
  return dateArr;
}
