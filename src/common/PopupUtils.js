const ParentElementID = 'popup-root';

export const getPopupParentElement = () => {
  let parentElement = document.getElementById(ParentElementID);

  if (!parentElement) {
    parentElement = document.body;
  }

  return parentElement;
};
