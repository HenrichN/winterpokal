import * as _ from 'lodash';
import * as moment from 'moment';
import { WinterpokalEntry, Day } from './interfaces';

export function getDays() {
  const WINTERPOKAL_START_DATE = '2017-10-30';
  const start = moment(WINTERPOKAL_START_DATE).startOf('isoweek' as any);
  // console.log(start.format());
  const end = moment().endOf('isoweek' as any);
  // console.log(end.format());
  var days = [];
  for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
    days.push(moment(m));
  }
  days.pop();
  return days;
}

export function mergeDaysAndEntries(days: moment.Moment[], entries: WinterpokalEntry[]): Day[][] {
  const result = days.map(day => ({
    date: day,
    entry: entries.find(entry => moment(entry.entry.date).isSame(day))
  }));
  return _.chunk(result, 7);
}