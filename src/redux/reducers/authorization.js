import {
  OPEN_USER_PROFILE,
  OPEN_USER_PROFILE_COMPLETE,
  FETCH_USER_PROFILE_COMPLETE,
  FETCH_USER_PROFILE_INITIATE,
  SIGNUP_FORM_OPEN,
  SIGNUP_FORM_CLOSE,
  FETCH_USER_PROFILE_TASKS_INITIATE,
  FETCH_USER_PROFILE_TASKS_COMPLETE,
  FETCH_USER_PROFILE_ACTIVITIES_INITIATE,
  FETCH_USER_PROFILE_ACTIVITIES_COMPLETE,
  UPDATE_USER_PROFILE_INITIATE,
  UPDATE_USER_PROFILE_COMPLETE,
  UPDATE_USER_AVATAR,
  UPDATE_USER_COVERBACKGROUND,
  USER_PROFIE_UPDATE_FREQUENTLY,
  FETCH_USER_THEME_INITIATE,
  FETCH_USER_THEME_COMPLETE,
  UPDATE_USER_THEME_INITIATE,
  UPDATE_USER_THEME_COMPLETE,
  PROGRESSION_TREE_START_INITIATE,
  PROGRESSION_TREE_START_COMPLETE,
  PROGRESSION_TREE_STOP_INITIATE,
  PROGRESSION_TREE_STOP_COMPLETE,
  USER_LOG_OUT,
  USER_SIGN_UP,
  SET_USER_LOCALE_DATA,
  UPDATE_SELECTED_LANGUAGE
} from '~/src/redux/actions/actionTypes';

export function isOpenProfilePending(state = false, action) {
  switch (action.type) {
    case OPEN_USER_PROFILE:
      return !state ? true : state;
    case OPEN_USER_PROFILE_COMPLETE:
      return state ? false : state;
    default:
      return state;
  }
}

const userProfileInitialState = {
  locale: {},
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    interests: 'programming, study',
    skills: 'javascript, c++',
    experience: 'Google',
    education: 'Harvard',
    pictureURL: null,
    coverBackgroundURL: null,
    facebook: null,
    linkedin: null,
    theme: 'Dark',
    progressionTrees: [],
    progressionTreeLevels: [],
  },
  tasks: {
    assigned: [],
    created: [],
    isLoading: false,
  },
  activities: {
    data: [],
    isLoading: false,
  },
  isAuthorized: false,
  isLoading: false,
  isAdmin: false,
  company: {}
};

export function userProfile(state = userProfileInitialState, action) {
  switch (action.type) {
    case FETCH_USER_PROFILE_INITIATE:
      return { ...state, isLoading: true };
    case USER_LOG_OUT:
      return userProfileInitialState;
    case USER_PROFIE_UPDATE_FREQUENTLY:
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case FETCH_USER_PROFILE_COMPLETE:
      return {
        ...state,
        profile: Object.assign({}, action.profile, {
          theme: state.profile.theme,
          firstName: action.profile.firstName || "",
          lastName: action.profile.lastName || ""
        }),
        isAdmin: action.isAdmin,
        isAuthorized: action.isAuthorized,
        isLoading: false,
        company: action.company || {}
      };
    case UPDATE_USER_PROFILE_INITIATE:
      return { ...state, isLoading: true };
    case UPDATE_USER_PROFILE_COMPLETE:
      return { ...state, isAuthorized: true, isLoading: false, profile: action.profile };
    case UPDATE_USER_AVATAR:
      return { ...state,profile: Object.assign({}, state.profile, { pictureURL: action.url }) };
    case UPDATE_USER_COVERBACKGROUND:
      return { ...state,profile: Object.assign({}, state.profile, { coverBackgroundURL: action.url }) };
    case FETCH_USER_PROFILE_TASKS_INITIATE: {
      return { ...state, tasks: { assigned: [], created: [], isLoading: true } };
    }
    case FETCH_USER_PROFILE_TASKS_COMPLETE: {
      return {
        ...state,
        tasks: { assigned: action.tasksAssigned, created: action.tasksCreated, isLoading: false },
      };
    }
    case FETCH_USER_PROFILE_ACTIVITIES_INITIATE: {
      return { ...state, activities: Object.assign({}, state.activities, { isLoading: true }) };
    }
    case FETCH_USER_PROFILE_ACTIVITIES_COMPLETE: {
      return {
        ...state,
        activities: Object.assign({}, state.activities, { data: action.activities, isLoading: false }),
      };
    }
    case FETCH_USER_THEME_INITIATE:
      return { ...state, isLoading: true };
    case FETCH_USER_THEME_COMPLETE: {
      return {
        ...state,
        profile: Object.assign({}, state.profile, {
          theme: action.theme
        }),
        isLoading: false,
      };
    }
    case UPDATE_USER_THEME_INITIATE:
      return { ...state, isLoading: true };
    case UPDATE_USER_THEME_COMPLETE: {
      return {
        ...state,
        profile: Object.assign({}, state.profile, {
          theme: action.theme
        }),
        isLoading: false,
      };
    }
    case PROGRESSION_TREE_START_INITIATE: {
      return { ...state, isLoading: true };
    }
    case PROGRESSION_TREE_START_COMPLETE:
      return {
        ...state,
        profile: Object.assign({}, state.profile, {
          progressionTrees: state.profile.progressionTrees.concat(action.tree),
        }),
        isLoading: false,
      };
    case PROGRESSION_TREE_STOP_INITIATE:
      return { ...state, isLoading: true };
    case PROGRESSION_TREE_STOP_COMPLETE:
      const foundTreeIndex = state.profile.progressionTrees.findIndex(function(tree) {
        return tree._id == action.tree._id;
      });

      if (foundTreeIndex == -1) {
        return { ...state, isLoading: false };
      } else {
        let progressionTreesCopy = state.profile.progressionTrees.slice();
        progressionTreesCopy.splice(foundTreeIndex, 1);

        return {
          ...state,
          profile: Object.assign({}, state.profile, { progressionTrees: progressionTreesCopy }),
          isLoading: false,
        };
      }
      return {
        ...state,
        profile: Object.assign({}, state.profile, {
          progressionTrees: state.profile.progressionTrees.concat(action.tree),
        }),
        isLoading: false,
      };
    case SET_USER_LOCALE_DATA:
      let localeTemporary = 'en';
      if (action.locale && action.locale.languages && action.locale.languages.length) {
        localeTemporary = action.locale.languages.join(' | ');
      }
      return {
        ...state,
        locale: { localeTemporary: localeTemporary, ...action.locale }
      };
    case UPDATE_SELECTED_LANGUAGE:
      return{
        ...state,
        locale:{
          ...state.locale,
          selectedLanguage:action.payload
        }
      };
    default:
      return state;
  }
}

export function isSignUpFormOpen(state = false, action) {
  switch (action.type) {
    case SIGNUP_FORM_OPEN:
      return !state ? true : state;
    case SIGNUP_FORM_CLOSE:
      return state ? false : state;
    default:
      return state;
  }
}
