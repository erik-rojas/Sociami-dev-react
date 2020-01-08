import {
  BOOKMARK_ADD,
  BOOKMARK_REMOVE,
  BOOKMARK_REMOVE_ALL,
  BOOKMARKS_SET,
} from '~/src/redux/actions/actionTypes';

const bookmarksInitialState = { bookmarks: [], amount: 0 };

export function bookmarks(state = bookmarksInitialState, action) {
  switch (action.type) {
    case BOOKMARK_ADD: {
      for (let i = 0; i < state.bookmarks.length; ++i) {
        if (
          state.bookmarks[i]._id == action.bookmark._id &&
          state.bookmarks[i]._type == action.bookmark._type
        ) {
          return state;
        }
      }
      let newBookMarks = state.bookmarks.concat({ _id: action.bookmark._id, _type: action.bookmark._type });
      return { ...state, bookmarks: newBookMarks, amount: newBookMarks.length };
    }
    case BOOKMARKS_SET: {
      let newBookmarks = action.bookmarks.map(function(bookmark) {
        return { _id: bookmark._id, _type: bookmark._type };
      });

      return { ...state, bookmarks: newBookmarks, amount: newBookmarks.length };
    }
    case BOOKMARK_REMOVE: {
      for (let i = 0; i < state.bookmarks.length; ++i) {
        if (
          state.bookmarks[i]._id == action.bookmark._id &&
          state.bookmarks[i]._type == action.bookmark._type
        ) {
          let newBookMarks = Object.assign(state.bookmarks);
          newBookMarks.splice(i, 1);
          return { ...state, bookmarks: newBookMarks, amount: newBookMarks.length };
        }
      }
      return state;
    }
    case BOOKMARK_REMOVE_ALL:
      return bookmarksInitialState;
    default:
      return state;
  }
}
