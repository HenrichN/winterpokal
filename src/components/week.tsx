import { VNode, span, div } from "@cycle/dom";
import * as _ from "lodash";
import { Moment } from "moment";
import { Day } from "../interfaces";

export function renderWeek(days: Day[]): VNode {
  const elements = _.map(days, day => {
    const classes = 'day' + (day.entry ? ' day-trained' : '');
    return <div className={classes} data-day={day.date.format('Y-M-D')}>
      <div className='date-container'>
        <span className='date'>
          {day.date.format('D.M')}
        </span>
      </div>
    </div>
  });
  return <div className='week'>{elements}</div>;
}