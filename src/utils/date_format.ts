import moment from "moment";

moment.updateLocale("vi", {
  relativeTime: {
    future: "trong %s",
    past: "%s trước",
    s: "vài giây",
    ss: "%d giây",
    m: "1 phút",
    mm: "%d phút",
    h: "1 giờ",
    hh: "%d giờ",
    d: "1 ngày",
    dd: "%d ngày",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

moment.locale("vi");

export const convertTicksToMoment = (
  ticks: number | null | undefined
): moment.Moment | null => {
  if (!ticks || typeof ticks !== "number") return null;

  const epochTicks = 621355968000000000;
  const ticksPerMillisecond = 10000;
  const millisecondsSinceEpoch = (ticks - epochTicks) / ticksPerMillisecond;
  const m = moment(millisecondsSinceEpoch);

  return m.isValid() ? m : null;
};

// 'dd/mm/yyyy'
export const formatTicksToDateString = (
  ticks: number | null | undefined
): string => {
  const m = convertTicksToMoment(ticks);
  return m ? m.format("DD/MM/YYYY") : "Không có dữ liệu thời gian";
};

// ... ago
export const formatTicksToRelativeTime = (
  ticks: number | null | undefined
): string => {
  const m = convertTicksToMoment(ticks);
  return m ? m.fromNow() : "Không có dữ liệu thời gian";
};

// HH:mm dd/MM/yyyy
export const formatVietnamTimeFromTicks = (ticks: number): string => {
  const epochTicks = 621355968000000000;
  const ticksPerMs = 10000;
  const jsUtcMs = (ticks - epochTicks) / ticksPerMs;
  const utcDate = new Date(jsUtcMs);
  const vietnamMs = utcDate.getTime() - 7 * 60 * 60 * 1000;
  const vietnamDate = new Date(vietnamMs);
  return vietnamDate.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getCurrentTicks = (): number => {
  const utcMs = Date.now() + 7 * 60 * 60 * 1000;
  return utcMs * 10000 + 621355968000000000;
};
