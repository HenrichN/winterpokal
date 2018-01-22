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

function main(sources: BaseSources): FantasySinks<BaseSinks> {
    const apiKey$ = sources.storage.local
        .getItem('apiKey')
        .startWith('');

    const updateEntry$ = sources.DOM.select('.day')
        .events('click')
        .debug(ev => console.log((ev.target as any).dataset['day']))
        .map(() => ({
            url: 'http://localhost:3000/entries',
            category: 'update',
            method: 'POST'
        }));

    const entries$ = sources.HTTP.select('update')
        .map(() => true)
        .startWith(true)
        .map(() => ({
            url: 'http://localhost:3000/entries',
            category: 'entries',
            method: 'GET'
        }));

    const sinks = {
        DOM: xs.combine(
            sources.HTTP.select('entries').flatten()
                .map(entry => {
                    return entry.body.map((e: any) => e.data);
                }),
            xs.of(getDays()))
            .map(([res, days]) => mergeDaysAndEntries(days, res))
            .debug()
            .map(weeks => {
                let acc: VNode[] = [];
                let elements = _.reduce(weeks, (acc, cur, index) => {
                    acc.push(renderWeek(cur));
                    return acc;
                }, acc);
                return div('.test', acc);
            }),
        HTTP: xs.merge(entries$, updateEntry$)
    };
    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    storage: storageDriver,
    HTTP: makeHTTPDriver()
};

run(main, drivers as any);