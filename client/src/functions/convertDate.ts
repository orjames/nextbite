import moment from 'moment';

export function convertDate() {
  return (date: Date) => {
    let m = moment(date);
    let newDate = m.fromNow();
    return newDate;
  };
}