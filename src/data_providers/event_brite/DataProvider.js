/*
    author: Alexander Zolotov
    Helper class for fetching response from remote API
*/

/*
    @url: API url
    @listener(result): callback to invoke on success
    @convertToArrayOfObjects: should we convert result to array of objects, or return plain xml
 */

import 'whatwg-fetch';

const requestApiData = function(url, listener) {
  const headers = new Headers();
  headers.set('Content-Type', 'text/json');

  //use fetch API to get response from remote API
  fetch(url, headers)
    .then(function(response) {
      if (response.status !== 200) {
        listener();
        return;
      }
      //upon success - invoke callback, and pass 'result' as an argument
      response.text().then(function(text) {
        let eventBriteItems = [];

        if (text != '') {
          let parsedJSON = JSON.parse(text);

          let events = parsedJSON.events;

          for (let event in events) {
            let name = events[event].name.text;
            let description = events[event].description.text;
            let start = events[event].start.utc;
            let end = events[event].end.utc;
            let status = events[event].status;
            let url = events[event].url;
            let logoUrl = '';
            let id = events[event].id;

            if (events[event].logo) {
              logoUrl = events[event].logo.url;
            }

            let eventBriteItem = {};

            eventBriteItem['name'] = name;
            eventBriteItem['description'] = description;
            eventBriteItem['start'] = start;
            eventBriteItem['end'] = end;
            eventBriteItem['status'] = status;
            eventBriteItem['url'] = url;
            eventBriteItem['logoUrl'] = logoUrl;

            eventBriteItem['_id'] = id;

            eventBriteItems.push(eventBriteItem);
          }
        }

        listener(eventBriteItems);
      });
    })
    .catch(function(err) {
      listener([]);
    });
};

module.exports.requestApiData = requestApiData;
