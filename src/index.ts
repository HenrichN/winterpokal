import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver, VNode, span, div } from '@cycle/dom';
import { html } from 'snabbdom-jsx';
import storageDriver from '@cycle/storage';
import { makeHTTPDriver } from '@cycle/http';
import * as _ from 'lodash';
import { BaseSources, BaseSinks } from './interfaces';
import { FantasySinks } from '@cycle/run/lib/types';
import { getDays, mergeDaysAndEntries } from './model';
import { renderWeek } from './components/week';
import * as Requests from './requests';
import { fetch } from './requests';

function main(sources: BaseSources): FantasySinks<BaseSinks> {
    const apiToken$ = sources.storage.local
        .getItem('api-token');

    const dateToUpdate$ = sources.DOM.select('.day')
        .events('click')
        .map(ev => (ev.target as any).dataset['day']);

    const intent = {
        updateEntry$: xs.combine(dateToUpdate$, apiToken$)
            .map(([date, apiToken]) => Requests.update(date, apiToken as string)),
        entries$: xs.combine(
            sources.HTTP.select('update')
                .flatten()
                .map(() => true)
                .startWith(true),
            apiToken$)
            .map(([_, apiToken]) => Requests.fetch(apiToken as string))
    };

    const model$ = xs.combine(
        sources.HTTP.select('entries')
            .flatten()
            .map(response => Requests.mapResponse()(response)),
        xs.of(getDays()))
        .map(([entries, days]) => mergeDaysAndEntries(days, entries));

    const view$ = model$.map(weeks => {
        let acc: VNode[] = [];
        let elements = _.reduce(weeks, (acc, cur, index) => {
            acc.push(renderWeek(cur));
            return acc;
        }, acc);
        return div('.test', acc);
    });

    return {
        DOM: view$,
        HTTP: xs.merge(intent.entries$, intent.updateEntry$)
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    storage: storageDriver,
    HTTP: makeHTTPDriver()
};

run(main, drivers as any);