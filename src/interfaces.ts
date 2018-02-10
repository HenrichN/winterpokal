import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StorageSource, StorageRequest, ResponseCollection } from '@cycle/storage';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { TimeSource } from '@cycle/time';
import { RouterSource, HistoryAction } from 'cyclic-router';
import { Moment } from 'moment';

export interface BaseSources {
    DOM: DOMSource;
    HTTP: HTTPSource;
    storage: ResponseCollection;
}

export interface BaseSinks {
    DOM?: Stream<VNode>;
    HTTP?: Stream<RequestOptions>;
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