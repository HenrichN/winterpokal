import { VNode, span, div } from "@cycle/dom";
import * as _ from "lodash";
import { Moment } from "moment";

export function renderWeek(week: Moment[]): VNode {
  const days = _.map(week, day =>
    <div className='day' data-day={day.format('Y-M-D')}>
      <div className='date-container'>
        <span className='date'>
          {day.format('D.M')}
        </span>
      </div>
    </div>
  );
  return <div className='week'>{days}</div>;
}