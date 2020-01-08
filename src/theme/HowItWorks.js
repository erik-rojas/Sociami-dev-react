/*
    author: Alexander Zolotov
*/
import React, { Component } from 'react';
import { Icon } from 'react-fa';
import ActionLink from '~/src/components/common/ActionLink';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setSearchQuery } from '~/src/redux/actions/fetchResults';

import '~/src/css/howItWorks.css';

const NAV_TAB_ID_TREND_SCANNER = 'nav_tab_id_trend_scanner';
const NAV_TAB_ID_DEVELOPMENT_ROADMAPS = 'nav_tab_id_development_roadmaps';
const NAV_TAB_ID_TASK_MANAGER = 'nav_tab_id_task_manager';
const NAV_TAB_ID_PROJECT_MANAGER = 'nav_id_project_manager';

const NAV_TABS = [
  NAV_TAB_ID_TREND_SCANNER,
  NAV_TAB_ID_DEVELOPMENT_ROADMAPS,
  NAV_TAB_ID_TASK_MANAGER,
  NAV_TAB_ID_PROJECT_MANAGER,
];

//text
const SECTION_TITLES = [
  'Get Jobs, Gigs, Events, Training for Trends',
  'Find out how to achieve your goals with a roadmap',
  'Get Jobs, Gigs, Events, Training for Trends',
  "Kickstart projects at your heart's desires",
];
//

const SECTION_BODIES = [
  <span>
    <div className="row">
      <div className="col-lg-12">
        <p>
          A lifetime of "Just Do One Thing Well" has created tons of platforms that just do one thing. The
          problem that it leads for users is browsing fatique. Unless you have tons of time and spend hours
          everyday monitoring websites reptitively, chances are you will be missing opportunities when you are
          not looking. What is missing is a one stop shop where you can find what you need without having to
          spend too much time browsing.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Our Trend Scanner aggregates core activities that can affect decisions you make for your learning
          curve for new trends. Save time by keying a search and going through the results!
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p className="pull-right">Start Now!</p>
      </div>
    </div>
  </span>,

  <span>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Existing platforms (eg social networks) give a wealth of data about trends based on what your
          network thinks. But do you feel that you are sometimes either overloaded with content, or sometimes
          a lot of content is replicated? Do you truly know how to get deep into the topic, to find people who
          are similarly interested in the topic as you to truly make sense and do something meaningful?
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Keying in a search in our trend scanner will load up development roadmaps that you can scan to find
          out how you can reach your goals. With each roadmap, you also have the opportunity to trigger tasks
          that reach out to your network to help power your roadmap better!
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p className="pull-right">Start now with a search!</p>
      </div>
    </div>
  </span>,

  <span>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Social Networks today are just that - a Network. And a Newsfeed. These networks encourage to
          "connect the world" mostly on (how many followers you have, how many friends you have.) Yet when you
          think about the interest and goals you have and relate back to social networks, chances are - you
          aren't able to determine which friends closest to you are on the same journey. This leads to missed
          opportunities with the ones you trust the most (friends) who could help you.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Our Task Manager connects your roadmaps to the social network. We call this a social roadmap.
          Initial use cases link you to mentors within your network who could help you out. In return for a
          SOQQ token (which you will start with some for a sign on bonus). You can also help others by seeing
          what help your friends need, to earn tokens.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p className="pull-right">Start by keying a trend search, and checking out our roadmaps!</p>
      </div>
    </div>
  </span>,

  <span>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Do you have desires that you want to achieve but are unable to execute because of high barrier to
          entries? Some of these may be lack of a team, lack of money or lack of knowledge. Especially where
          the desire may be a complex project (eg a new tech startup) and it is not clear how to start.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <p>
          Our Project Manager will automatically provide you templates to create projects which can be
          reflected on your social network for your friends to join and help in. Yes you guessed it - costs
          and tasks can be managed through tokens that you have earned by helping others.
        </p>
      </div>
    </div>
  </span>,
];

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progressValue: 0,
      currentTab: NAV_TAB_ID_TREND_SCANNER,
      currentIndex: 0,
    };
  }

  componentWillMount() {
    let foundTabIndex = NAV_TABS.indexOf(this.state.currentTab);
    let newProgressValue = foundTabIndex != -1 ? (foundTabIndex + 1) * (100 / NAV_TABS.length) : 0;
    let copy = Object.assign({}, this.state, { progressValue: newProgressValue });
    this.setState(copy);
  }

  handleSelectCategory(e) {
    if (e.currentTarget.id) {
      let newTabSelection = e.currentTarget.id;

      let foundTabIndex = NAV_TABS.indexOf(newTabSelection);

      let newProgressValue = foundTabIndex != -1 ? (foundTabIndex + 1) * (100 / NAV_TABS.length) : 0;

      let copy = Object.assign({}, this.state, {
        currentTab: newTabSelection,
        progressValue: newProgressValue,
        currentIndex: foundTabIndex,
      });
      this.setState(copy);
    }
  }

  renderNavigationTabs() {
    const tab1ClassName = this.state.currentTab == NAV_TABS[0] ? 'active' : '';
    const tab2ClassName = this.state.currentTab == NAV_TABS[1] ? 'active' : '';
    const tab3ClassName = this.state.currentTab == NAV_TABS[2] ? 'active' : '';
    const tab4ClassName = this.state.currentTab == NAV_TABS[3] ? 'active' : '';

    return (
      <div className="tabpanel styled-tabs uniform-height" role="tabpanel">
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation" className={tab1ClassName}>
            <ActionLink
              href="#tabs-tab1"
              aria-controls="tabs-tab1"
              role="tab"
              data-toggle="tab"
              id={NAV_TAB_ID_TREND_SCANNER}
              onClick={e => this.handleSelectCategory(e)}
            >
              <Icon className="icon" name="search" />
              <span>Trend Scanner</span>
            </ActionLink>
          </li>
          <li role="presentation" className={tab2ClassName}>
            <ActionLink
              href="#tabs-tab2"
              aria-controls="tabs-tab2"
              role="tab"
              data-toggle="tab"
              id={NAV_TAB_ID_DEVELOPMENT_ROADMAPS}
              onClick={e => this.handleSelectCategory(e)}
            >
              <Icon className="icon" name="road" />
              <span>Development Roadmaps</span>
            </ActionLink>
          </li>
          <li role="presentation" className={tab3ClassName}>
            <ActionLink
              href="#tabs-tab3"
              aria-controls="tabs-tab3"
              role="tab"
              data-toggle="tab"
              id={NAV_TAB_ID_TASK_MANAGER}
              onClick={e => this.handleSelectCategory(e)}
            >
              <Icon className="icon" name="graduation-cap" />
              <span>Task Manager</span>
            </ActionLink>
          </li>
          <li role="presentation" className={tab4ClassName}>
            <ActionLink
              href="#tabs-tab3"
              aria-controls="tabs-tab3"
              role="tab"
              data-toggle="tab"
              id={NAV_TAB_ID_PROJECT_MANAGER}
              onClick={e => this.handleSelectCategory(e)}
            >
              <Icon className="icon" name="server" />
              <span>Project Manager</span>
            </ActionLink>
          </li>
        </ul>
      </div>
    );
  }

  renderSectionTitle() {
    return <h3>{SECTION_TITLES[this.state.currentIndex]}</h3>;
  }

  renderProjectsButton() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <a href="http://soqqle.com/howItWorks" className="btn btn-lg btn-outline-inverse pull-right">
            Browse Projects
          </a>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.props.setSearchQuery(e.target.value);
  }

  handleStartSearch(e) {
    e.preventDefault();
    this.props.onHandleStartSearch();
  }

  renderSearchInput() {
    const waitingText = this.props.isFetchInProgress ? <b>(Wait...)</b> : '';

    const TextInput = this.props.isFetchInProgress ? (
      <h6>Searching...</h6>
    ) : (
      <input
        type="text"
        className="text-field form-control validate-field required"
        data-validation-type="string"
        id="form-name"
        name="query"
        autoComplete="off"
        placeholder="Key in a job or a skill you are exploring"
        onChange={e => this.handleChange(e)}
        autoFocus
      />
    );

    return (
      <div className="row">
        <div className="col-lg-12">
          <form className="form-inline pull-right" action="#" onSubmit={e => this.handleStartSearch(e)}>
            <div className="form-group">{TextInput}</div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid howItWorksPage">
        <div className="row">
          <div className="col-lg-12">{this.renderNavigationTabs()}</div>
        </div>

        <div className="row">
          <div className="col-lg-12">{this.renderSectionTitle()}</div>
        </div>
        <div className="row">
          <div className="col-lg-12">{SECTION_BODIES[this.state.currentIndex]}</div>
        </div>
        {this.state.currentTab == NAV_TAB_ID_PROJECT_MANAGER
          ? this.renderProjectsButton()
          : this.renderSearchInput()}
      </div>
    );
  }
}

HowItWorks.propTypes = {
  isFetchInProgress: PropTypes.bool.isRequired,

  setSearchQuery: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setSearchQuery: bindActionCreators(setSearchQuery, dispatch),
});

const mapStateToProps = state => ({
  isFetchInProgress: state.isFetchInProgress,
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HowItWorks);
