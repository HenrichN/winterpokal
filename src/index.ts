import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver, VNode, span, div } from '@cycle/dom';
import { html } from 'snabbdom-jsx';
import storageDriver from '@cycle/storage';
import { makeHTTPDriver } from '@cycle/http';
import * as _ from 'lodash';
import { BaseSources, BaseSinks, UPDATE_ENTRY, FETCH_ENTRIES, UPDATE_ENTRIES } from './interfaces';
import { FantasySinks } from '@cycle/run/lib/types';
import { getDays, mergeDaysAndEntries } from './model';
import { renderWeek } from './components/week';
import * as Requests from './requests';
import { fetch } from './requests';

function main(sources: BaseSources): FantasySinks<BaseSinks> {
    const apiToken$ = sources.storage.local
        .getItem('api-token');

    const intent$ = xs.merge(
        sources.DOM.select('.day')
            .events('click')
            .map(ev => ({
                type: UPDATE_ENTRY,
                payload: (ev.target as any).dataset['day']
            })),
        sources.HTTP.select('update')
            .flatten()
            .mapTo({ type: FETCH_ENTRIES }),
        sources.HTTP.select('entries')
            .flatten()
            .map(response => Requests.mapResponse()(response))
            .map(response => ({
                type: UPDATE_ENTRIES,
                payload: response
            })))
        .startWith({ type: FETCH_ENTRIES });

    const updateEntriesReducer$ = intent$
        .filter(action => action.type === UPDATE_ENTRIES)
        .map((action: any) => (state: any) => {
            return mergeDaysAndEntries(getDays(), action.payload);
        });

    const model$ = xs.merge(updateEntriesReducer$)
        .fold((state, reducer) => reducer(state), [] as any);

    const view$ = model$.map(weeks => {
        let acc: VNode[] = [];
        let elements = _.reduce(weeks, (acc, cur, index) => {
            acc.push(renderWeek(cur));
            return acc;
        }, acc);
        return div('.test', acc);
    });

    const fetchEntriesRequest$ = xs.combine(
        intent$.filter(action => action.type === FETCH_ENTRIES),
        apiToken$)
        .map(([_, apiToken]) => Requests.fetch(apiToken as string));

    const updateEntryRequest$ = xs.combine(
        intent$.filter(action => action.type === UPDATE_ENTRY),
        apiToken$)
        .map(([action, apiToken]) => Requests.update((action as any).payload, apiToken as string));

    return {
        DOM: view$,
        HTTP: xs.merge(fetchEntriesRequest$, updateEntryRequest$)
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    storage: storageDriver,
    HTTP: makeHTTPDriver()
};

run(main, drivers as any);