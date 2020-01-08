import {
  FETCH_COMPANY_INITIATE,
  FETCH_COMPANY_COMPLETE,
  UPDATE_COMPANY_INITIATE,
  UPDATE_COMPANY_COMPLETE
} from '~/src/redux/actions/actionTypes';

const companyInitialState = {
  company: [],
  isFetchingCompany: true,
  isUpdatingCompany: true
}

export function company(state = companyInitialState, action) {
  switch (action.type) {
    case FETCH_COMPANY_INITIATE:
      return { ...state, isFetchingCompany: true };
    case FETCH_COMPANY_COMPLETE:
      return { ...state, company: action.company, isFetchingCompany: false };
    case UPDATE_COMPANY_INITIATE:
      return { ...state, isUpdatingCompany: true };
    case UPDATE_COMPANY_COMPLETE:
      return { ...state, company: action.company, isUpdatingCompany: false };
    default:
      return state;
  }
}
