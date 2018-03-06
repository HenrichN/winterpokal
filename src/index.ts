import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver, VNode, span, div, p, pre } from '@cycle/dom';
import storageDriver from '@cycle/storage';
import { makeHTTPDriver } from '@cycle/http';
import * as _ from 'lodash';
import { BaseSources, BaseSinks, UPDATE_ENTRY, FETCH_ENTRIES, UPDATE_ENTRIES, EntryTemplate } from './interfaces';
import { FantasySinks } from '@cycle/run/lib/types';
import { getDays, mergeDaysAndEntries } from './model';
import { renderWeek } from './components/week';
import * as Requests from './requests';
import { fetch } from './requests';
import 'bootstrap/dist/css/bootstrap.min.css';

function main(sources: BaseSources): FantasySinks<BaseSinks> {
    const apiToken$ = sources.storage.local
        .getItem('api-token');

    const entryTemplate$ = sources.storage.local
        .getItem('entry-template')
        .map(entry => JSON.parse(entry as string))

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
            const weeks = mergeDaysAndEntries(getDays(), action.payload);
            return Object.assign({}, state, { weeks });
        });

    const entryTemplateExistsReducer$ = entryTemplate$
        .map((template: EntryTemplate) => (state: any) => {
            return Object.assign({}, state, { entryTemplate: template });
        });

    const model$ = xs.merge(updateEntriesReducer$, entryTemplateExistsReducer$)
        .fold((state, reducer) => reducer(state), {} as any);

    const view$ = model$.map(state => {
        if (state.entryTemplate) {
            let acc: VNode[] = [];
            console.log(state);
            let elements = _.reduce(state.weeks, (acc, cur, index) => {
                acc.push(renderWeek(cur));
                return acc;
            }, acc);
            return div('.test', acc);
        } else {
            return div('.alert .alert-danger',
                [p('No entry template found - please add an entry "entry-template" to local storage'),
                pre('{ "category": "radfahren", "duration": 40, "distance": 12000, "description": "Maloche" }')]);
        }
    });

    const fetchEntriesRequest$ = xs.combine(
        intent$.filter(action => action.type === FETCH_ENTRIES),
        apiToken$)
        .map(([_, apiToken]) => Requests.fetch(apiToken as string));

    const updateEntryRequest$ = xs.combine(
        intent$.filter(action => action.type === UPDATE_ENTRY),
        apiToken$,
        entryTemplate$.filter(e => e !== null))
        .map(([action, apiToken, entryTemplate]) => Requests.update((action as any).payload,
            entryTemplate as EntryTemplate,
            apiToken as string));

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