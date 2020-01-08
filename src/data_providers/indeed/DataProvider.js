/*
    author: Alexander Zolotov
    Helper class for fetching response from remote API
*/

/*
    @data: input data in xml format
    returns array of objects in a form of 'object{xmlNodeName: xmlNodeValue}'
*/

import 'whatwg-fetch';
/*
    @url: API url
    @listener(result): callback to invoke on success
    @convertToArrayOfObjects: should we convert result to array of objects, or return plain xml
 */
const requestApiData = function(url, listener, convertToArrayOfObjects) {
  const headers = new Headers();
  headers.set('Content-Type', 'text/json');

  //use fetch API to get response from remote API
  fetch(url, headers)
    .then(function(response) {
      if (response.status !== 200) {
        listener();
        return;
      }
      const urlPrefix = 'https://www.freelancer.com/projects/';
      //devfortest.000webhostapp.com/udemy_api/?query=php
      //upon success - invoke callback, and pass 'result' as an argument
      response.text().then(function(text) {
        let indeedJobs = [];

        if (text != '') {
          let parsedJSON = JSON.parse(text);

          let jobs = parsedJSON.results;

          for (let i = 0; i < jobs.length; ++i) {
            let indeedJob = {};

            let jobtitle = jobs[i].jobtitle;
            let company = jobs[i].company;
            let formattedLocation = jobs[i].formattedLocation;
            let country = jobs[i].country;
            let url = jobs[i].url;
            let date = jobs[i].date;
            let jobkey = jobs[i].jobkey;
            let formattedRelativeTime = jobs[i].formattedRelativeTime;

            indeedJob['jobtitle'] = jobtitle;
            indeedJob['company'] = company;
            indeedJob['formattedLocation'] = formattedLocation;
            indeedJob['country'] = formattedLocation;
            indeedJob['url'] = url;
            indeedJob['date'] = date;
            indeedJob['_id'] = jobkey;
            indeedJob['formattedRelativeTime'] = formattedRelativeTime;

            indeedJobs.push(indeedJob);
          }
        }
        listener(indeedJobs);
      });
    })
    .catch(function(err) {
      listener([]);
    });
};

module.exports.requestApiData = requestApiData;
