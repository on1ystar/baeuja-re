// 1. 현재 시간(Locale)
const curr: Date = new Date();

// 2. UTC 시간 계산
const utc: number = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

// 3. UTC to KST (UTC + 9시간)
const KR_TIME_DIFF: number = 9 * 60 * 60 * 1000;
const krCurr: Date = new Date(utc + KR_TIME_DIFF);

export const getNowKO = () => {
  const year: string = String(krCurr.getFullYear());
  const month: string = ('0' + (1 + krCurr.getMonth())).slice(-2);
  const day: string = ('0' + krCurr.getDate()).slice(-2);
  const hours: string = ('0' + krCurr.getHours()).slice(-2);
  const minutes: string = ('0' + krCurr.getMinutes()).slice(-2);
  const seconds: string = ('0' + krCurr.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
