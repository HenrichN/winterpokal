import * as _ from 'lodash';
import * as moment from 'moment';

export function getWeeks() {
  const WINTERPOKAL_START_DATE = '2017-10-30';
  const start = moment(WINTERPOKAL_START_DATE).startOf('isoweek' as any);
  console.log(start);
  const end = moment().endOf('isoweek' as any);
  console.log(end);
  var days = [];
  for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
    days.push(m);
  }
  days.pop();
  console.log(_.chunk(days, 7));
  return _.chunk(days, 7);
}