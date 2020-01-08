import * as linkify from 'linkifyjs';

export function findUrlInText(text) {
  const findUrlResult = linkify.find(text);
  const hasUrl = Object.keys(findUrlResult).length > 0;

  if (!hasUrl) return { hasUrl: false };
  const firstUrl = findUrlResult['0'].href;

  return { hasUrl, firstUrl };
};

export function isSameLink(url1, url2) {
  if (typeof url1 !== 'undefined' && typeof url2 !== 'undefined') {
    return url1.replace(/^http(s)\:/ig, '') === url2.replace(/^http(s)\:/ig, '');
  }

  return false;
};
