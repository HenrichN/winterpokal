import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StorageSource, StorageRequest, ResponseCollection } from '@cycle/storage';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { TimeSource } from '@cycle/time';
import { RouterSource, HistoryAction } from 'cyclic-router';
import { Moment } from 'moment';

export type Component = (s: BaseSources) => BaseSinks;

export interface BaseSources {
    DOM: DOMSource;
    HTTP: HTTPSource;
    time?: TimeSource;
    router?: RouterSource;
    storage: ResponseCollection;
}

export interface BaseSinks {
    DOM?: Stream<VNode>;
    HTTP?: Stream<RequestOptions>;
    router?: Stream<HistoryAction>;
    storage?: Stream<StorageRequest>;
}

export interface Day {
    date: Moment;
    entry: any;
}

export interface WinterpokalEntry {
    entry: {
        id: string;
        category: string;
        date: string;
        description: string;
        duration: number,
        distance: number,
        nightride: boolean,
        points: number,
        created: string;
    },
    category: {
        id: string;
        title: string;
    },
    user: {
        id: string;
        name: string;
        entries: string;
        points: string;
        duration: string;
        url: string;
    }
}