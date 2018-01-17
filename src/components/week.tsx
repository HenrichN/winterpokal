import { VNode, span, div } from "@cycle/dom";
import * as _ from "lodash";
import { Moment } from "moment";

export function renderWeek(week: Moment[]): VNode {
  const days = _.map(week, day => <span>{day.format('D.M')}</span>);
  return <div>{days}</div>;
}