import xs from 'xstream';
import { run } from '@cycle/run';
import { h1, makeDOMDriver, div, input, p } from '@cycle/dom';
import storageDriver from '@cycle/storage';
import { makeHTTPDriver } from '@cycle/http';
import { BaseSources, BaseSinks } from './interfaces';
import { FantasySinks } from '@cycle/run/lib/types';

const data = [{"entry":{"id":"2194600","category":"Radfahren","date":"2017-11-20","description":"Erledigungen in der großen Stadt","duration":60,"distance":20000,"nightride":false,"points":4,"created":"2017-11-20 16:54:38"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2186177","category":"Radfahren","date":"2017-11-15","description":"Maloche","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-15 20:46:49"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2186173","category":"Radfahren","date":"2017-11-14","description":"Maloche","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-15 20:46:26"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2183116","category":"Radfahren","date":"2017-11-05","description":"Durchs Wohngebiet im dunkeln","duration":44,"distance":7160,"nightride":false,"points":2,"created":"2017-11-14 10:13:55"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2183115","category":"Laufen","date":"2017-11-07","description":"Durchs Wohngebiet","duration":48,"distance":7630,"nightride":false,"points":2,"created":"2017-11-14 10:12:48"},"category":{"id":"laufen","title":"Laufen"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2183113","category":"Laufen","date":"2017-11-12","description":"Flughafenrunde","duration":48,"distance":8200,"nightride":false,"points":2,"created":"2017-11-14 10:11:47"},"category":{"id":"laufen","title":"Laufen"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2183112","category":"Radfahren","date":"2017-11-13","description":"Maloche hin und zurück","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-14 10:10:14"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2175993","category":"Radfahren","date":"2017-11-09","description":"Maloche","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-10 08:30:06"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2175990","category":"Radfahren","date":"2017-11-08","description":"Maloche","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-10 08:29:29"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2172493","category":"Radfahren","date":"2017-11-07","description":"Maloche hin und zurück","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-08 10:26:14"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2172492","category":"Radfahren","date":"2017-11-06","description":"Maloche","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-08 10:25:16"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2172491","category":"Radfahren","date":"2017-11-03","description":"Maloche","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-08 10:24:52"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2172490","category":"Radfahren","date":"2017-11-02","description":"Maloche hin und zurück","duration":40,"distance":12000,"nightride":false,"points":2,"created":"2017-11-08 10:23:13"},"category":{"id":"radfahren","title":"Radfahren"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}},{"entry":{"id":"2172489","category":"Laufen","date":"2017-10-31","description":"","duration":40,"distance":6170,"nightride":false,"points":2,"created":"2017-11-08 10:22:34"},"category":{"id":"laufen","title":"Laufen"},"user":{"id":"277572","name":"StraffeKette","entries":"14","points":"30","duration":"600","url":"https://winterpokal.mtb-news.de/users/view/277572"}}];

function main(sources: BaseSources): FantasySinks<BaseSinks> {
    const apiKey$ = sources.storage.local
        .getItem('apiKey')
        .startWith('');

    const getStuff$ = xs.of(true)
        .map(() => ({
            url: 'http://localhost:8081',
            category: 'stuff',
            method: 'GET'
        }));

    const sinks = {
        DOM: sources.HTTP
            .select('stuff')
            .flatten()
            .debug()
            .map(response => div(response.text)),
        HTTP: getStuff$
    };
    return sinks;
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    storage: storageDriver,
    HTTP: makeHTTPDriver()
};

run(main, drivers as any);