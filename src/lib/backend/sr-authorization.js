import ServerRequestFactory from './server-request-factory';
console.log('ye', ServerRequestFactory);
const objToUrlString = function(obj) {
  var str = [];
  const objArr = Object.keys(obj);
  objArr.forEach(p => {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  })

  return str.join("&");
}

export function saveUserLocation(id, data) {
  var params = { id : id, country: data.country };
  // console.log('param is', params, objToUrlString(params));
  // const urlString = objToUrlString(params);
  return ServerRequestFactory().post(`/saveUserLocation/${params.id}`, { data: params });
}

// export function get() {
//   return new Promise(function(resolve, reject) {
//     setTimeout(resolve, 100, 'foo');
//   });
// }
