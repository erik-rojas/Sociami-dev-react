import {
  FETCH_SKILLS_INITIATE,
  FETCH_SKILLS_COMPLETE,
} from '~/src/redux/actions/actionTypes';

const skillsInitialState = {
  skills: [],
  isFetchingSkills: false
}

export function skills (state = skillsInitialState, action) {
  switch(action.type) {
    case FETCH_SKILLS_INITIATE: return {...state, isFetchingSkills: true};
    case FETCH_SKILLS_COMPLETE: return {...state, skills: action.skills, isFetchingSkills: false};
    default: return state;
  }
}
