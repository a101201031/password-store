import dayjs from 'dayjs';

export const dateToString = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

export const nowDiffDays = (date1: Date) => {
  return dayjs().diff(dayjs(date1), 'day');
};
