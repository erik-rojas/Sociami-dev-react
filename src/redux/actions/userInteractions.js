import Axios from 'axios';

import ConfigMain from '~/configs/main';

export function userInteractionPush(userID, type, subType, data = null) {
  return function(dispatch) {
    const url = `${ConfigMain.getBackendURL()}/userInteractionAdd`;
    const body = { userID: userID, type: type, subType: subType, data: data };

    return Axios.post(url, body)
      .then(function(response) {})
      .catch(error => {});
  };
}
