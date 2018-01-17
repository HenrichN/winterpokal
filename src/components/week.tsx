import { VNode, span, div } from "@cycle/dom";
import * as _ from "lodash";

export function renderWeek(week: any): VNode {
  const days = _.map(week, day => <span>day</span>);
  return <div>{days}</div>;
}