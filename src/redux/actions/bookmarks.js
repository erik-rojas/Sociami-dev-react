import { BOOKMARK_ADD, BOOKMARK_REMOVE, BOOKMARKS_SET, BOOKMARK_REMOVE_ALL } from './actionTypes';

export function bookmarkAdd(newBookmark) {
  return {
    type: BOOKMARK_ADD,
    bookmark: newBookmark,
  };
}

export function bookmarksSet(newBookmarks) {
  return {
    type: BOOKMARKS_SET,
    bookmarks: newBookmarks,
  };
}

export function bookmarkRemove(bookmarkToRemove) {
  return {
    type: BOOKMARK_REMOVE,
    bookmark: bookmarkToRemove,
  };
}

export function bookmarkRemoveAll() {
  return {
    type: BOOKMARK_REMOVE_ALL,
  };
}
