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
    const apiToken$ = sources.storage.local
        .getItem('api-token');

    const dateToUpdate$ = sources.DOM.select('.day')
        .events('click')
        .map(ev => (ev.target as any).dataset['day']);

    const updateEntry$ = xs.combine(dateToUpdate$, apiToken$)
        .map(([date, apiToken]) => ({
            url: 'https://cors-anywhere.herokuapp.com/https://winterpokal.mtb-news.de/api/v1/entries/add.json',
            category: 'update',
            method: 'POST',
            send: {
                "category": "radfahren",
                date,
                "duration": 40,
                "distance": 12000,
                "nightride": false,
                "description": "Maloche"
            },
            headers: {
                'api-token': apiToken
            }
        }));

    const entries$ = xs.combine(
        sources.HTTP.select('update')
            .flatten()
            .map(() => true)
            .startWith(true),
        apiToken$)
        .map(([_, apiToken]) => ({
            url: 'https://cors-anywhere.herokuapp.com/https://winterpokal.mtb-news.de/api/v1/entries/my.json',
            category: 'entries',
            method: 'GET',
            headers: {
                'api-token': apiToken
            }
        }));

    const sinks = {
        DOM: xs.combine(
            sources.HTTP.select('entries')
                .flatten()
                .map(entry => entry.body.data),
            xs.of(getDays()))
            .map(([entries, days]) => mergeDaysAndEntries(days, entries))
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