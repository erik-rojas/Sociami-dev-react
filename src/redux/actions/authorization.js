import Axios from 'axios';

import {
  OPEN_USER_PROFILE,
  OPEN_USER_PROFILE_COMPLETE,
  FETCH_USER_PROFILE_INITIATE,
  FETCH_USER_PROFILE_COMPLETE,
  FETCH_USER_PROFILE_TASKS_INITIATE,
  FETCH_USER_PROFILE_TASKS_COMPLETE,
  FETCH_USER_PROFILE_ACTIVITIES_INITIATE,
  FETCH_USER_PROFILE_ACTIVITIES_COMPLETE,
  USER_PROFIE_UPDATE_FREQUENTLY,
  FETCH_USER_THEME_INITIATE,
  FETCH_USER_THEME_COMPLETE,
  UPDATE_USER_THEME_INITIATE,
  UPDATE_USER_THEME_COMPLETE,
  PROGRESSION_TREE_START_INITIATE,
  PROGRESSION_TREE_START_COMPLETE,
  PROGRESSION_TREE_STOP_INITIATE,
  PROGRESSION_TREE_STOP_COMPLETE,
  SIGNUP_FORM_OPEN,
  SIGNUP_FORM_CLOSE,
  UPDATE_USER_PROFILE_COMPLETE,
  UPDATE_USER_PROFILE_INITIATE,
  UPDATE_USER_AVATAR,
  UPDATE_USER_COVERBACKGROUND,
  USER_LOG_OUT,
  USER_SIGN_UP,
  SET_USER_LOCALE_DATA,
  UPDATE_SELECTED_LANGUAGE
} from './actionTypes';

import ConfigMain from '~/configs/main';

export function openSignUpForm() {
  return {
    type: SIGNUP_FORM_OPEN,
  };
}

export function closeSignUpForm() {
  return {
    type: SIGNUP_FORM_CLOSE,
  };
}

export function openUserProfile() {
  return {
    type: OPEN_USER_PROFILE,
  };
}

export function openUserProfileComplete() {
  return {
    type: OPEN_USER_PROFILE_COMPLETE,
  };
}

export function setUserLocaleData(data) {
  return {
    type: SET_USER_LOCALE_DATA,
    locale: data
  }
}

export function fetchUserProfileComplete(userProfile, authorized, adminUser, company) {
  return {
    type: FETCH_USER_PROFILE_COMPLETE,
    profile: userProfile,
    isAuthorized: authorized,
    isAdmin: adminUser,
    company
  };
}

export function updateUserProfileInitiate() {
  return {
    type: UPDATE_USER_PROFILE_INITIATE,
  };
}

export function updateUserProfileComplete(userProfile) {
  return {
    type: UPDATE_USER_PROFILE_COMPLETE,
    profile: userProfile,
  };
}

export function setUserLocaleDataI18Next(module) {
  return dispatch => {
    module.init(
      {
        fallbackLng: 'en',
        detection: {
          order: [
            "querystring",
            "cookie",
            "localStorage",
            "navigator",
            "htmlTag",
            "path",
            "subdomain"
          ]
        }
      },
      (a, b) => {
        if (module && module.language && module.languages && module.languages.length) {
          let selectedLanguage = 'en';
          if(module.language.includes('ko')){
            selectedLanguage = 'ko'
          }
          else if (module.language.includes('vi')){
            selectedLanguage = 'vi'
          }
          else if (module.language.includes('th')){
            selectedLanguage = 'th'
          }
          else if (module.language.includes('cn') || module.language.includes('zh')){
            selectedLanguage = 'cn'
          }
          dispatch(
            setUserLocaleData({
              current: module.language,
              languages: module.languages,
              selectedLanguage
            })
          );
        }
      }
    );
  };
}

export function logout(userID) {
  const url = `${ConfigMain.getBackendURL()}/logout`;

  const body = { userID: userID };

  Axios.post(url, body)
    .then(function(response) {})
    .catch(function(error) {});
  return {
    type: USER_LOG_OUT,
  };
}

export function fetchUserProfileInitiate() {
  return {
    type: FETCH_USER_PROFILE_INITIATE,
  };
}

export function fetchUserProfileTasksInitiate() {
  return {
    type: FETCH_USER_PROFILE_TASKS_INITIATE,
  };
}

export function fetchUserProfileTasksComplete(assignedTasks, createdTasks) {
  return {
    type: FETCH_USER_PROFILE_TASKS_COMPLETE,
    tasksAssigned: assignedTasks,
    tasksCreated: createdTasks,
  };
}

export function fetchUserThemeInitiate() {
  return {
    type: FETCH_USER_THEME_INITIATE,
  };
}

export function fetchUserThemeComplete(theme) {
  return {
    type: FETCH_USER_THEME_COMPLETE,
    theme: theme,
  };
}

export function fetchUserTheme(userId) {
  return function(dispatch) {
    dispatch(fetchUserThemeInitiate());

    const url = `${ConfigMain.getBackendURL()}/preferences/${userId}`;

    return Axios.get(url)
      .then(function(response) {
        dispatch(
          fetchUserThemeComplete(response.data.theme),
        );
      })
      .catch(function(error) {
        dispatch(fetchUserThemeComplete('Dark'));
      });
  };
}

export function updateUserThemeInitiate() {
  return {
    type: UPDATE_USER_THEME_INITIATE,
  };
}

export function updateUserThemeComplete(theme) {
  return {
    type: UPDATE_USER_THEME_COMPLETE,
    theme: theme,
  };
}

export function updateUserTheme(userId, theme) {
  return function(dispatch) {
    dispatch(updateUserThemeInitiate());

    const url = `${ConfigMain.getBackendURL()}/preferences/${userId}`;
    const body = { theme: theme };

    return Axios.put(url, body)
      .then(function(response) {
        dispatch(
          updateUserThemeComplete(response.data.theme),
        );
      })
      .catch(function(error) {
        dispatch(updateUserThemeComplete('Dark'));
      });
  };
}

export function fetchUserActivitiesInitiate() {
  return {
    type: FETCH_USER_PROFILE_ACTIVITIES_INITIATE,
  };
}

export function fetchUserActivitiesComplete(activities) {
  return {
    type: FETCH_USER_PROFILE_ACTIVITIES_COMPLETE,
    activities: activities,
  };
}

export function fetchUserActivities(userId) {
  return function(dispatch) {
    dispatch(fetchUserActivitiesInitiate());

    const url = `${ConfigMain.getBackendURL()}/userActivitiesGet?id=${userId}&doNotTransform=1`;

    return Axios.get(url)
      .then(function(response) {
        dispatch(
          fetchUserActivitiesComplete(
            response.data[0].activities.map(function(userActivityData, i) {
              return userActivityData.activity;
            }),
          ),
        );
      })
      .catch(function(error) {
        dispatch(fetchUserActivitiesComplete([]));
      });
  };
}

export function startProgressionTreeInitiate() {
  return {
    type: PROGRESSION_TREE_START_INITIATE,
  };
}

export function startProgressionTreeComplete(tree) {
  return {
    type: PROGRESSION_TREE_START_COMPLETE,
    tree: tree,
  };
}

export function stopProgressionTreeInitiate(tree) {
  return {
    type: PROGRESSION_TREE_STOP_INITIATE,
  };
}

export function stopProgressionTreeComplete(tree) {
  return {
    type: PROGRESSION_TREE_STOP_COMPLETE,
    tree: tree,
  };
}

export function startProgressionTree(userId, progressionTree) {
  return function(dispatch) {
    dispatch(startProgressionTreeInitiate());

    const url = `${ConfigMain.getBackendURL()}/userProgressionTreeStart`;

    const body = { userId: userId, progTree: progressionTree };

    return Axios.post(url, body)
      .then(function(response) {
        dispatch(startProgressionTreeComplete(response.data));
      })
      .catch(function(error) {
        dispatch(startProgressionTreeComplete([]));
      });
  };
}

export function stopProgressionTree(userId, progressionTree) {
  return function(dispatch) {
    dispatch(startProgressionTreeInitiate());

    const url = `${ConfigMain.getBackendURL()}/userProgressionTreeStop`;

    const body = { userId: userId, progTree: progressionTree };

    return Axios.post(url, body)
      .then(function(response) {
        dispatch(stopProgressionTreeComplete(response.data));
      })
      .catch(function(error) {
        dispatch(stopProgressionTreeComplete([]));
      });
  };
}

export function fetchUserTasks(userId) {
  return function(dispatch) {
    dispatch(fetchUserProfileTasksInitiate());

    const url = `${ConfigMain.getBackendURL()}/tasksGetForUser?userId=${userId}&assigneeId=${userId}`;

    return Axios.get(url)
      .then(function(response) {
        let tasksAssigned = [];
        let tasksCreated = [];

        for (let i = 0; i < response.data.length; ++i) {
          if (
            response.data[i].assignees &&
            response.data[i].assignees.find(function(assignee) {
              return assignee._id == userId;
            })
          ) {
            tasksAssigned.push(response.data[i]);
          } else if (response.data[i].userID == userId) {
            tasksCreated.push(response.data[i]);
          }
        }

        dispatch(fetchUserProfileTasksComplete(tasksAssigned, tasksCreated));
      })
      .catch(function(error) {
        dispatch(fetchUserProfileTasksComplete([], []));
      });
  };
}

export function update_userProfile(userIdFacebook, userIdLinkedIn) {
  return function(dispatch) {
    const url = userIdFacebook
      ? `${ConfigMain.getBackendURL()}/fetchUserProfile?faceBookID=${userIdFacebook}`
      : `${ConfigMain.getBackendURL()}/fetchUserProfile?linkedInID=${userIdLinkedIn}`;

    return Axios.get(url)
      .then(function(response) {
        const responseProfile = response.data.profile;
        let newUserProfile = {
          _id: response.data._id,
          progressionTrees: response.data.progressionTrees,
          progressionTreeLevels: response.data.profile.progressionTreeLevels,
        };
        //async action exit point
        dispatch({
          type: USER_PROFIE_UPDATE_FREQUENTLY,
          profile: newUserProfile,
        });
      })
      .catch(function(error) {
        // Fail? Ignore.
      });
  };
}
export function updateAvatar(url) {
  return {
    type: UPDATE_USER_AVATAR,
    url: url
  };
}
export function updateCoverBackground(url) {
  return {
    type: UPDATE_USER_COVERBACKGROUND,
    url: url
  };
}
export function fetchUserProfile(userIdFacebook, userIdLinkedIn, id) {
  return function(dispatch) {
    //async action entry point
    dispatch(fetchUserProfileInitiate());

    let url = userIdFacebook
      ? `${ConfigMain.getBackendURL()}/fetchUserProfile?faceBookID=${userIdFacebook}`
      : `${ConfigMain.getBackendURL()}/fetchUserProfile?linkedInID=${userIdLinkedIn}`;

    if (id) {
      url = `${ConfigMain.getBackendURL()}/fetchUserProfileById?id=${id}`;
    }

    return Axios.get(url)
      .then(function(response) {
        const responseProfile = response.data.profile;
        let newUserProfile = {
          _id: response.data._id,
          hangouts: response.data.hangouts,
          illuminates: response.data.illuminates,
          roadmaps: response.data.roadmaps,
          progressionTrees: response.data.progressionTrees,
          connectionDetails: response.data.connectionDetails,
          facebook: response.data.facebook,
          facebookID: response.data.facebookID
        };

        newUserProfile = Object.assign({}, newUserProfile, { ...responseProfile });

        Axios.get(`${ConfigMain.getBackendURL()}/fetchUserCompany?emailId=${responseProfile.email}`)
          .then(function(response) {
            //async action exit point
            if (response.data && response.data._id) {
              dispatch(fetchUserProfileComplete(newUserProfile, true, true, response.data));
            } else {
              dispatch(fetchUserProfileComplete(newUserProfile, true, false));
            }
          })
          .catch(function(error) {
            dispatch(fetchUserProfileComplete(newUserProfile, true, false));
          });
      })
      .catch(function(error) {
        //async action exit point
        dispatch(fetchUserProfileComplete({}, false, false));
      });
  };
}

export function setUserProfileCharacter(profileId, characterData) {
  return function(dispatch) {
    //async action entry point
    dispatch(updateUserProfileInitiate());

    const url = `${ConfigMain.getBackendURL()}/userProfileCharacterSet`;
    const body = {
      id: profileId,
      characterData: characterData,
    };

    return Axios.post(url, body)
      .then(function(response) {
        const responseProfile = response.data.profile;
        let newUserProfile = {
          _id: response.data._id,
          hangouts: response.data.hangouts,
          roadmaps: response.data.roadmaps,
          progressionTrees: response.data.progressionTrees,
          facebook: response.data.facebook,
        };

        newUserProfile = Object.assign({}, newUserProfile, { ...responseProfile });

        //async action exit point
        dispatch(updateUserProfileComplete(newUserProfile));
      })
      .catch(function(error) {
        //async action exit point
        dispatch(updateUserProfileComplete({}));
      });
  };
}

export const signUp = data => {
  return dispatch => {
    dispatch({
      type: USER_SIGN_UP,
      payload: data._id,
    });
    return dispatch(fetchUserProfile(null, null, data._id));
  };
};

export const changePageLanguage = language => {
  return dispatch => {
    dispatch({
      type: UPDATE_SELECTED_LANGUAGE,
      payload: language,
    });
  };
};
