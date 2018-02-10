const DEV = false;

export function update(date: string, apiToken: string) {
  const url = DEV ? 'https://my-json-server.typicode.com/HenrichN/fuzzy-journey/entries' :
    'https://cors-anywhere.herokuapp.com/https://winterpokal.mtb-news.de/api/v1/entries/add.json?' + Date.now();

  return {
    url,
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
  };
}

export function mapResponse(){
  return DEV ? (response: any) => response.body.map((e :any) => e.data).filter((e:any) => e) :
    (entry: any) => entry.body.data;
}

export function fetch(apiToken: string) {
  const url = DEV ? 'https://my-json-server.typicode.com/HenrichN/fuzzy-journey/entries?' + Date.now() :
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