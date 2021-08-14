// 1. 현재 시간(Locale)
const curr = new Date();

// 2. UTC 시간 계산
const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

// 3. UTC to KST (UTC + 9시간)
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const krCurr = new Date(utc + KR_TIME_DIFF);

const getNow = () => {
  const year = krCurr.getFullYear();
  const month = ('0' + (1 + krCurr.getMonth())).slice(-2);
  const day = ('0' + krCurr.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
};

export default getNow;
