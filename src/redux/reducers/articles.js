import {
  FETCH_ARTICLES_INITIATE,
  FETCH_ARTICLES_COMPLETE
} from '~/src/redux/actions/actionTypes';

const articlesInitialState = {
}

export function articles(state = articlesInitialState, action) {
  switch (action.type) {
    case FETCH_ARTICLES_INITIATE:
      return {...state, isFetchingArticles: true};
    case FETCH_ARTICLES_COMPLETE:
      return {...state, articles: action.articles, isFetchingArticles: false};
    default:
      return state;
  }
}