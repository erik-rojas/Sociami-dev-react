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

const OnlyActiveProjects = true;

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
      const urlPrefix = 'https://www.freelancer.com/projects/';
      //devfortest.000webhostapp.com/udemy_api/?query=php
      //upon success - invoke callback, and pass 'result' as an argument
      response.text().then(function(text) {
        let freelancerProjectItems = [];

        if (text != '') {
          let parsedJSON = JSON.parse(text);

          let projects = parsedJSON.result.projects;

          for (let project in projects) {
            if (projects[project].status != 'active' && OnlyActiveProjects) {
              continue;
            }

            let title = projects[project].title;
            let description = projects[project].preview_description;
            let status = projects[project].status;
            let url = urlPrefix + projects[project].seo_url;
            let submitdate = projects[project].submitdate;

            let id = projects[project].id;

            let freelanceProjectItem = {};

            freelanceProjectItem['title'] = title;
            freelanceProjectItem['description'] = description;
            freelanceProjectItem['status'] = status;
            freelanceProjectItem['url'] = url;
            freelanceProjectItem['submitdate'] = submitdate;

            freelanceProjectItem['_id'] = String(id);

            freelancerProjectItems.push(freelanceProjectItem);
          }
        }
        listener(freelancerProjectItems);
      });
    })
    .catch(function(err) {
      listener([]);
    });
};

module.exports.requestApiData = requestApiData;
