//this should correspond to same file in back-end
const UserInteractions = {
  Types: {
    PAGE_OPEN: 'page_open',
    PAGE_CLOSE: 'page_close',
    ACTION_EXECUTE: 'action_execute',
  },
  SubTypes: {
    SKILL_VIEW: 'skill_view',

    PROG_TREE_VIEW: 'progression_tree_view',

    DEEPDIVE_PREPARE: 'deepdive_prepare',
    DEEPDIVE_START: 'deepdive_start',
    DEEPDIVE_FINISH: 'deepdive_finish',
    DEEPDIVE_COMPLETE: 'deepdive_complete',
  },
};

export default UserInteractions;
