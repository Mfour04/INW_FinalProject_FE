import moment from 'moment';

moment.updateLocale('vi', {
  relativeTime: {
    future: 'trong %s',
    past: '%s trước',
    s: 'vài giây',
    ss: '%d giây',
    m: '1 phút',
    mm: '%d phút',
    h: '1 giờ',
    hh: '%d giờ',
    d: '1 ngày',
    dd: '%d ngày',
    M: '1 tháng',
    MM: '%d tháng',
    y: '1 năm',
    yy: '%d năm'
  }
});

moment.locale('vi');




export const convertTicksToMoment = (ticks: number): moment.Moment => {
  const epochTicks = 621355968000000000;
  const ticksPerMillisecond = 10000;
  const millisecondsSinceEpoch = (ticks - epochTicks) / ticksPerMillisecond;
  return moment(millisecondsSinceEpoch);
};


// 'dd/mm/yyyy'
export const formatTicksToDateString = (ticks: number): string =>
  convertTicksToMoment(ticks).format('DD/MM/YYYY');


// ... ago
export const formatTicksToRelativeTime = (ticks: number): string =>
  convertTicksToMoment(ticks).fromNow();
