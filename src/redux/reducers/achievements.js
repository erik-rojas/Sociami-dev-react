import {
  FETCH_ACHIEVEMENTS_INITIATE,
  FETCH_ACHIEVEMENTS_COMPLETE,
  FETCH_ACHIEVEMENT_GROUPS_INITIATE,
  FETCH_ACHIEVEMENT_GROUPS_COMPLETE,
  ADD_ACHIEVEMENT_GROUP_INITIATE,
  ADD_ACHIEVEMENT_GROUP_COMPLETE,
  UPDATE_ACHIEVEMENT_GROUP_INITIATE,
  UPDATE_ACHIEVEMENT_GROUP_COMPLETE
} from '~/src/redux/actions/actionTypes';

const achievementsInitialState = {
  data: [],
  isFetchingAchievements: false
};

const achievementGroupsInitialState = {
  data: [],
  isFetchingAchievementGroups: false
};

const addAchievementInitialState = {
  data: {},
  isAddingAchievementGroup: false
};

const updateAchievementInitialState = {
  data: {},
  isUpdatingAchievementGroup: false
};

export function achievements(state = achievementsInitialState, action) {
  switch (action.type) {
    case FETCH_ACHIEVEMENTS_INITIATE:
      return { ...state, isFetchingAchievements: true };
    case FETCH_ACHIEVEMENTS_COMPLETE:
      return { ...state, data: action.data, isFetchingAchievements: false };
    default:
      return state;
  }
}

export function achievementGroups(state = achievementGroupsInitialState, action) {
  switch (action.type) {
    case FETCH_ACHIEVEMENT_GROUPS_INITIATE:
      return { ...state, isFetchingAchievementGroups: true };
    case FETCH_ACHIEVEMENT_GROUPS_COMPLETE:
      return { ...state, data: action.data, isFetchingAchievementGroups: false };
    default:
      return state;
  }
}

export function addAchievementGroup(state = addAchievementInitialState, action) {
  switch (action.type) {
    case ADD_ACHIEVEMENT_GROUP_INITIATE:
      return { ...state, isAddingAchievementGroup: true };
    case ADD_ACHIEVEMENT_GROUP_COMPLETE:
      return { ...state, data: action.data, isAddingAchievementGroup: false };
    default:
      return state;
  }
}

export function updateAchievementGroup(state = updateAchievementInitialState, action) {
  switch (action.type) {
    case UPDATE_ACHIEVEMENT_GROUP_INITIATE:
      return { ...state, isUpdatingAchievementGroup: true };
    case UPDATE_ACHIEVEMENT_GROUP_COMPLETE:
      return { ...state, data: action.data, isUpdatingAchievementGroup: false };
    default:
      return state;
  }
}
