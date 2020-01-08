export const GetHours12 = date => {
  return (date.getHours() + 24) % 12 || 12;
};
export const GetAmPM = date => {
  const Noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  date.getTime() < Noon.getTime() ? 'am' : 'pm';
};

const Hours12 = date => {
  return (date.getHours() + 24) % 12 || 12;
};

/*Helper functions*/
const DayFromNumber = dayNum => {
  const DayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return DayNames[dayNum];
};

const MonthFromNumber = monthNum => {
  const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'];

  return MonthNames[monthNum];
};

export const GenerateDateString = time => {
  const DateFromTime = new Date(time);

  const Noon = new Date(
    DateFromTime.getFullYear(),
    DateFromTime.getMonth(),
    DateFromTime.getDate(),
    12,
    0,
    0,
  );

  const AmPm = DateFromTime.getTime() < Noon.getTime() ? 'am' : 'pm';

  const Hours = String(Hours12(DateFromTime)) + AmPm;

  const CurrentDate = new Date();

  const Today = new Date();
  const Tomorrow = new Date(Today.getTime() + 24 * 60 * 60 * 1000);
  const AfterTomorrow = new Date(Tomorrow.getTime() + 24 * 60 * 60 * 1000);
  const ThisSunday = new Date(CurrentDate.setDate(CurrentDate.getDate() - CurrentDate.getDay() + 6));

  let DateString = '';

  if (
    DateFromTime.getFullYear() == Today.getFullYear() &&
    DateFromTime.getMonth() == Today.getMonth() &&
    DateFromTime.getDate() == Today.getDate()
  ) {
    DateString = ` Today at ${Hours}`;
  } else if (
    DateFromTime.getFullYear() == Tomorrow.getFullYear() &&
    DateFromTime.getMonth() == Tomorrow.getMonth() &&
    DateFromTime.getDate() == Tomorrow.getDate()
  ) {
    DateString = ` Tomorrow at ${Hours}`;
  } else if (
    DateFromTime.getFullYear() == ThisSunday.getFullYear() &&
    DateFromTime.getMonth() == ThisSunday.getMonth() &&
    DateFromTime.getDate() <= ThisSunday.getDate()
  ) {
    DateString = ` on ${DayFromNumber(DateFromTime.getDay())} at ${Hours}`;
  } else {
    DateString = `${DateFromTime.getDate()} ${MonthFromNumber(DateFromTime.getMonth())} at ${Hours}`;
  }

  return DateString;
};
