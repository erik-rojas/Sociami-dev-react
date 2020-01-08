import {
  USER_ACCOUNTING_FETCH_INITIATE,
  USER_ACCOUNTING_FETCH_COMPLETE,
} from '~/src/redux/actions/actionTypes';

const initialState = { data: { numTokens: 0, userTransactions: [] }, isLoading: false };

export function accounting(state = initialState, action) {
  switch (action.type) {
    case USER_ACCOUNTING_FETCH_INITIATE:
      return { ...state, isLoading: true };
    case USER_ACCOUNTING_FETCH_COMPLETE: {
      if (!action.data) {
        return initialState;
      }
      return {
        ...state,
        isLoading: false,
        data: {
          numTokens:
            action.data.userAccounting && action.data.userAccounting.numTokens
              ? action.data.userAccounting.numTokens
              : state.data.numTokens,
          userTransactions: action.data.userTransactions || state.data.userTransactions,
        },
      };
    }

    default:
      return state;
  }
}
