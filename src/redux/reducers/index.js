import { combineReducers } from 'redux';

import { exactLocation } from './miscReducers';
import { bookmarks } from './bookmarks';
import {
  isFetchInProgress,
  searchResults,
  isOpenSearchResultsPending,
  searchQuery,
  resultsSelectedCategory,
} from './fetchResults';
import { roadmaps, roadmapsDetailed, roadmapsAdmin } from './roadmaps';
import { tasks, lastSavedTask, lastStartedTask } from './tasks';
import { isOpenProfilePending, userProfile, isSignUpFormOpen } from './authorization';
import { projects, isProjectSaveInProgress, isProjectsFetchInProgress } from './projects';
import { userFriends } from './social';
import { userFriendsActivities } from './activities';
import { characterCreation, characterCreationData } from './characterCreation';
import { accounting } from './accounting';
import { progression } from './progression';
import { achievements, achievementGroups, addAchievementGroup, updateAchievementGroup } from './achievements';
import { timers } from './timers';
import { teams } from './teams';
import { articles } from './articles';
import { houses } from './houses';
import { company } from './company';
import { skills } from './story';

export default combineReducers({
  resultsSelectedCategory,
  isOpenProfilePending,
  isOpenSearchResultsPending,
  isFetchInProgress,
  searchResults,
  userProfile,
  userFriends,
  userFriendsActivities,
  bookmarks,
  roadmaps,
  roadmapsDetailed,
  roadmapsAdmin,
  isSignUpFormOpen,
  searchQuery,
  exactLocation,
  tasks,
  lastSavedTask,
  lastStartedTask,
  projects,
  isProjectSaveInProgress,
  isProjectsFetchInProgress,
  characterCreation,
  characterCreationData,
  accounting,
  progression,
  achievements,
  achievementGroups,
  addAchievementGroup,
  updateAchievementGroup,
  timers,
  teams,
  articles,
  houses,
  company,
  skills
});
