
// import CONFIG from '../../config/config'
// import {create} from 'apisauce';
// const api = create({
  // baseURL: CONFIG.isLocal ? CONFIG.local.url : CONFIG.remote.url,
  // headers: {'Accept': 'application/vnd.github.v3+json'}
// });

import Axios from 'axios';
export default function ServerRequestFactory() {
  return {
    get: Axios.get,
    post: Axios.post,
    // get: api.get,
  }
}
