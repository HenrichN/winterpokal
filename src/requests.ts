import { EntryTemplate } from './interfaces';

const DEV = false;

export function update(date: string, entryTemplate: EntryTemplate, apiToken: string) {
  // const url = DEV ? 'https://my-json-server.typicode.com/HenrichN/fuzzy-journey/entries' :
  const url = DEV ? 'http://localhost:3000/entries' :
    'https://cors-anywhere.herokuapp.com/https://winterpokal.mtb-news.de/api/v1/entries/add.json?' + Date.now();
  const entry = Object.assign({}, entryTemplate, { date, nightride: false });

  if (DEV) {
    return {
      url,
      category: 'update',
      method: 'POST',
      send: {
        data: {
          entry
        }
      },
      headers: {
        'api-token': apiToken
      }
    };
  } else {
    return {
      url,
      category: 'update',
      method: 'POST',
      send: entry,
      headers: {
        'api-token': apiToken
      }
    };
  }
}

export function mapResponse() {
  return DEV ? (response: any) => response.body.map((e: any) => e.data).filter((e: any) => e) :
    (entry: any) => entry.body.data;
}

export function fetch(apiToken: string) {
  // const url = DEV ? 'https://my-json-server.typicode.com/HenrichN/fuzzy-journey/entries?' + Date.now() :
  const url = DEV ? 'http://localhost:3000/entries' :
    'https://cors-anywhere.herokuapp.com/https://winterpokal.mtb-news.de/api/v1/entries/my.json';

  return {
    url,
    category: 'entries',
    method: 'GET',
    headers: {
      'api-token': apiToken
    }
  };
}