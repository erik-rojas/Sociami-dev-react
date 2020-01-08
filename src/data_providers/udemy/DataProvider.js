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
        const urlPrefix = 'https://www.udemy.com';
        let udemyItems = [];

        if (text != '') {
          let parsedJSON = JSON.parse(text);

          let courses = parsedJSON.results;

          for (let course in courses) {
            let title = courses[course].title;
            let image = courses[course].image_240x135;
            let price = courses[course].price;
            let url = urlPrefix + courses[course].url;

            let id = courses[course].id;

            let instructors = [];

            if (courses[course].visible_instructors.length > 0) {
              for (let i = 0; i < courses[course].visible_instructors.length; ++i) {
                let instructor = {};

                instructor['title'] = courses[course].visible_instructors[i].title;
                instructor['url'] = urlPrefix + courses[course].visible_instructors[i].url;

                instructors.push(instructor);
              }
            }

            let udemyItem = {};

            udemyItem['title'] = title;
            udemyItem['image'] = image;
            udemyItem['price'] = price;
            udemyItem['url'] = url;
            udemyItem['instructors'] = instructors;

            udemyItem['_id'] = String(id);

            udemyItems.push(udemyItem);
          }
        }
        listener(udemyItems);
      });
    })
    .catch(function(err) {
      listener([]);
    });
};

module.exports.requestApiData = requestApiData;
