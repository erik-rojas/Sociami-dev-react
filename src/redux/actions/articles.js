import {
  FETCH_ARTICLES_INITIATE,
  FETCH_ARTICLES_COMPLETE,
} from './actionTypes'
import Axios from 'axios';
import ConfigMain from '~/configs/main';

export function fetchArticlesInitiate() {
  return {
      type: FETCH_ARTICLES_INITIATE,
      articles: []
  }
}

export function fetchArticlesComplete(data) {
  return {
      type: FETCH_ARTICLES_COMPLETE,
      articles: data,
  }
}

export function fetchArticles() {
  return function (dispatch) {
    dispatch(fetchArticlesInitiate());
    const url = `${ConfigMain.getBackendURL()}/articles`;
      return (
      Axios.get(url)
      .then(function(response) {
          dispatch(fetchArticlesComplete(response.data));
      })
      .catch(function(error) {
          dispatch(fetchArticlesComplete([]));
      }));
  }
}