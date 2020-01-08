/*
  author: Alexander Zolotov
*/

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import ConfigMain from '~/configs/main';
import { fetchAllTasks } from '~/src/redux/actions/tasks';
import { fetchHousesByEmail } from '~/src/redux/actions/houses';
import { fetchCompanyByEmail } from '~/src/redux/actions/company';
import { fetchStories } from '~/src/redux/actions/story';
import { fetchRoadmaps, fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';
import { markActivitySeen } from '~/src/redux/actions/activities';

import { Icon } from 'react-fa';

import '~/src/style.css';
import '~/src/theme/css/main.css';

import ThemeHeader from '~/src/theme/components/themeHeader/ThemeHeader';
// import SidebarLeft from '~/src/theme/SidebarLeft';

//routes
import Authorize from '~/src/authentication/Authorize';

import HomePage from '~/src/theme/components/homepage/HomePage';
// import Heroes from '~/src/theme/Heroes';
import Heroes from '~/src/theme/components/heroes/Heroes';
import TaskManager from '~/src/theme/TaskManager';
import TrendScanner from '~/src/theme/TrendScanner.js';
import ProjectManager from '~/src/theme/ProjectManagement';
import ProjectBrowser from '~/src/theme/ProjectBrowser';
import TaskBrowser from '~/src/theme/components/tasks/TaskBrowser';
import ProgressionTreeBrowser from '~/src/theme/components/progressiontrees/ProgressiontreeBrowserNew';
import ProgressionTrees from '~/src/theme/ProgressionTrees';
import SkillBrowser from '~/src/theme/components/progressiontrees/SkillBrowser';
import Connections from '~/src/theme/components/connections/Connections.js';
import ConnectionsViewOld from '~/src/theme/ConnectionsViewOld.js';
import Story from '~/src/theme/components/story/Story';
import Challenges from '~/src/theme/components/challenges/Challenges';
// import UserProfile from '~/src/theme/UserProfile.js';
import UserProfile from '~/src/theme/components/userProfile/UserProfile';
import Teams from '~/src/theme/components/teams/Teams.js';
import Company from '~/src/theme/components/company/Company';
import Achievements from '~/src/theme/components/achievements/Achievements';
import Settings from '~/src/theme/Settings.js';
import PrivacyPolicy from '~/src/theme/new_ui/PrivacyPolicy';
import TermsOfUse from '~/src/theme/new_ui/TermsOfUse';

import Levels from './theme/components/levels/Levels';
import Sparks from './theme/components/sparks/Sparks';
import Tasks from './theme/components/tasks/Tasks';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false,
    };
  }

  handleSidebarOpen(open) {
    this.setState({ isSidebarOpen: open });
  }
  getRedirectLocation() {
    let RedirectTo = null;
    if (this.props.isOpenSearchResultsPending) {
      if (this.props.location.pathname != '/searchResults') {
        RedirectTo = <Redirect to="/searchResults" push />;
      }
    } else if (this.props.isOpenProfilePending) {
      if (this.props.location.pathname != '/userProfile') {
        RedirectTo = <Redirect to="/userProfile" push />;
      }
    }

    return RedirectTo;
  }

  componentDidMount() {
    this.props.onFetchHouseByEmail(this.props.profile.email);
    this.props.onFetchCompanyByEmail(this.props.profile.email);
    this.props.onFetchStories();
    this.props.fetchRoadmaps();
    this.props.fetchRoadmapsFromAdmin(this.props.isAuthorized ? this.props.userProfile._id : undefined);
  }

  renderRoutes() {
    return (
      <Switch>
        <Route exact path="/" render={routeProps => <HomePage {...routeProps} {...this.props} />} />
        <Route path="/authorize" render={routeProps => <Authorize {...routeProps} {...this.props} />} />)}/>
        <Route
          exact
          path="/story"
          render={routeProps => <Story {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/progressionTrees"
          render={routeProps => <ProgressionTrees {...routeProps} {...this.props} />}
        />
        <Route
          path="/progressionTreeBrowser"
          render={routeProps => <ProgressionTreeBrowser {...routeProps} {...this.props} />}
        />
        <Route path="/skillBrowser" render={routeProps => <SkillBrowser {...routeProps} {...this.props} />} />
        <Route
          path="/taskManagement"
          render={routeProps => <TaskManager {...routeProps} {...this.props} />}
        />
        <Route path="/taskBrowser" render={routeProps => <TaskBrowser {...routeProps} {...this.props} />} />
        <Route
          path="/heroes"
          render={routeProps => <Heroes {...routeProps} {...this.props} />}
        />
        {!ConfigMain.ChallengesScannerDisabled && (
          <Route
            path="/projectManagement"
            render={routeProps => <ProjectManager {...routeProps} {...this.props} />}
          />
        )}
        <Route
          path="/projectBrowser"
          render={routeProps => <ProjectBrowser {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/connections"
          render={routeProps => <Connections {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/connectionsView"
          render={routeProps => <ConnectionsViewOld {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/challenges"
          render={routeProps => <Challenges {...routeProps} {...this.props} />}
        />
        <Route path="/settings" render={routeProps => <Settings {...routeProps} {...this.props} />} />
        <Route
          exact
          path="/termsOfUse"
          render={routeProps => <TermsOfUse {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/privacyPolicy"
          render={routeProps => <PrivacyPolicy {...routeProps} {...this.props} />}
        />
        <Route path="/userProfile" render={routeProps => <UserProfile {...routeProps} {...this.props} />} />
        {this.props.isAdmin && (
          <Route path="/company" render={routeProps => <Company {...routeProps} {...this.props} />} />
        )}
        {this.props.isAdmin && (
          <Route path="/teams" render={routeProps => <Teams {...routeProps} {...this.props} />} />
        )}

        <Route path="/sparks" render={routeProps => <Sparks {...routeProps} {...this.props} />} />)}/>

        <Route path="/levels" render={routeProps => <Levels {...routeProps} {...this.props} />} />)}/>

        <Route path="/tasks" render={routeProps => <Tasks {...routeProps} {...this.props} />} />)}/>

        <Route path="/achievements" render={routeProps => <Achievements {...routeProps} {...this.props} />} />)}/>

      </Switch>
    );
  }

  render() {
    let RedirectTo = this.getRedirectLocation();
    if (this.props.history.location.pathname == "/characterCreation") {
      RedirectTo = <Redirect to="/" push />;
    }
    return (
      <div className="soqqle-page-wrapper">
        {RedirectTo}
        <ThemeHeader
          localeData={this.props.localeData}
          isAdmin={this.props.isAdmin}
          isAuthorized={this.props.isAuthorized}
          userActivities={this.props.userActivities}
          logout={() => this.props.logout()}
          fetchUserActivities={() => this.props.fetchUserActivities()}
          fetchUserTasks={() => this.props.fetchUserTasks()}
          houses={this.props.houses}
          companies={this.props.companies}
          userTasks={this.props.userTasks}
          markActivitySeen={() => this.props.markActivitySeen()}
          openSidebar={open => this.handleSidebarOpen(open)}
          isSidebarOpen={this.state.isSidebarOpen}
          userProfile={this.props.userProfile}
          accounting={this.props.accounting}
        />

        <div className="soqqle-page-content">{this.renderRoutes()}</div>

      </div>
    );
  }
}

Main.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onFetchAllTasks: PropTypes.func.isRequired,
  userActivities: PropTypes.array.isRequired,
  markActivitySeen: PropTypes.func.isRequired,
  onFetchHouseByEmail: PropTypes.func.isRequired,
  onFetchCompanyByEmail: PropTypes.func.isRequired,
  onFetchStories: PropTypes.func.isRequired,
  roadmapsAdmin: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  onFetchAllTasks: bindActionCreators(fetchAllTasks, dispatch),
  markActivitySeen: bindActionCreators(markActivitySeen, dispatch),
  onFetchHouseByEmail: bindActionCreators(fetchHousesByEmail, dispatch),
  onFetchCompanyByEmail: bindActionCreators(fetchCompanyByEmail, dispatch),
  onFetchStories: bindActionCreators(fetchStories, dispatch),
  fetchRoadmaps: bindActionCreators(fetchRoadmaps, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch)
});

const mapStateToProps = state => ({
  localeData: state.userProfile.locale,
  currentUserID: state.userProfile.profile._id,
  isAuthorized: state.userProfile.isAuthorized,
  userActivities: state.userProfile.activities.data,
  userTasks: state.userProfile.tasks,
  isAdmin: state.userProfile.isAdmin,
  company: state.userProfile.company,
  houses: state.houses,
  companies: state.company,
  skills: state.skills,
  roadmapsAdmin: state.roadmapsAdmin,
  profile: state.userProfile.profile
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Main),
);
