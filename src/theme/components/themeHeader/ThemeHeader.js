/*
    author: Akshay Menon
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

import UserIconToggle from '~/src/theme/components/themeHeader/UserIconToggle';
import Notifications from '~/src/theme/components/themeHeader/Notifications';
import StatsDropdown from '~/src/theme/components/themeHeader/StatsDropdown';
import UserMenuDropdown from '~/src/theme/components/themeHeader/UserMenuDropdown';
import CompanyDropDown from '~/src/theme/components/themeHeader/CompanyDropdown';
import MobileMainMenu from '~/src/theme/components/themeHeader/MobileMainMenu';

import ConfigMain from '~/configs/main';

import { ToastContainer, toast } from 'react-toastify';

import { ListGroupItem, ListGroup } from 'react-bootstrap';

import PubSub from 'pubsub-js';

import '~/src/theme/css/ThemeHeader.css';

import logoSrc from '../../../../assets/img/logo.png'
import flagSrc from '~/src/theme/images/flag.png'

import defaultHouseCompanyImage from '../../../../assets/img/question-mark.jpg';

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/">
        <img
          src={logoSrc}
          alt="logo"
        />
      </Link>
    </div>
  );
};

const MobileMenu = ({ isOpen, closeMenu, onSignOut, userProfile }) => {
  const mobileClass = isOpen ? 'mobile-menu open' : 'mobile-menu close';

  return (
    <div className={`${mobileClass} ${userProfile.theme.toLowerCase()}-theme-wrapper main-bg`}>
      <MobileMainMenu
        userProfile={userProfile}
        onSignOut={onSignOut}
        closeMenu={closeMenu}
      />
    </div>
  );
};

class ThemeHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userToggleOpen: false,
      notificationsOpen: false,
      isOpen: false,
      isCompanyOpen: false,
      companies: [],
      activeCompany: {imageUrl: defaultHouseCompanyImage}
    };

    this.toggle = this.toggle.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.toggleCompany = this.toggleCompany.bind(this);
    this.handleOutsideClickCompany = this.handleOutsideClickCompany.bind(this);
    this.selectCompany = this.selectCompany.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
  }

  toggleCompany() {
    this.setState({isCompanyOpen: !this.state.isCompanyOpen})
  }

  handleOutsideClickCompany() {
    this.setState({isCompanyOpen: !this.state.isCompanyOpen})
  }

  selectCompany(id) {
    const activeCompany = this.props.companies.company.filter(c => c._id === id)[0];
    this.setState({activeCompany: activeCompany});
    const companyArr = this.props.companies.company;
    this.setState({companies: companyArr.filter(c => c._id !== activeCompany._id)});
    this.setState({isCompanyOpen: !this.state.isCompanyOpen});
  }

  componentDidMount() {
    // $(window).scroll(function() {
    //   var distanceY = window.pageYOffset;
    //   var breakpoint = 100;
    //   var soqqleLogo = $('.logo');
    //   var navLinks = $('#nav-links');
    //   var navTasks = $('#nav-tasks');
    //   var sessionHeader = $('.session-header');
    //   if (distanceY > breakpoint) {
    //     soqqleLogo.addClass('logo-scroll');
    //     navLinks.addClass('nav-links-scroll');
    //     navTasks.addClass('nav-tasks-scroll');
    //     sessionHeader.addClass('session-header-scroll');
    //   } else {
    //     soqqleLogo.removeClass('logo-scroll');
    //     navLinks.removeClass('nav-links-scroll');
    //     navTasks.removeClass('nav-tasks-scroll');
    //     sessionHeader.removeClass('session-header-scroll');
    //   }
    // });
  }

  handleNotificationsOpen() {
    if (this.props.userTasks.created.length > 0) {
      this.setState({ notificationsOpen: true, isOpen:false });
    }
  }

  handleNotificationsClose() {
    this.setState({ notificationsOpen: false });
  }

  handleUserToggleOpen() {
    this.setState({ userToggleOpen: true });
  }

  handleUserToggleClose() {
    this.setState({ userToggleOpen: false });
  }

  componentWillMount() {
    this.PubsubEventsSubscribe();
  }

  componentWillUnmount() {
    this.PubsubEventsUnSubscribe();
  }

  PubsubEventsSubscribe() {
    if (!this.token_server_event_accounting_update) {
      this.token_server_event_accounting_update = PubSub.subscribe(
        'accounting_updated',
        this.serverEventAccountingUpdated.bind(this),
      );
    }
  }

  PubsubEventsUnSubscribe() {
    if (this.token_server_event_accounting_update) {
      PubSub.unsubscribe(this.token_server_event_accounting_update);
      this.token_server_event_accounting_update = undefined;
    }
  }

  serverEventAccountingUpdated(msg, data) {
    if (data && data.numTokens) {
      let source = '';

      if (data.source) {
        if (data.source.illuminate) {
          source = `for ${data.source.illuminate.name}`;
        } else if (data.source.deepdive) {
          source = `for ${data.source.deepdive.name}`;
        }
      }

      this.showNotification(
        `Congratulations: You've earned ${data.numTokens} ${
          data.numTokens > 1 ? 'tokens' : 'token'
        } ${source}!!!`,
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuthorized != this.props.isAuthorized) {
      if (this.props.isAuthorized) {
        this.props.fetchUserActivities(this.props.currentUserID);
        this.PubsubEventsUnSubscribe();
        this.PubsubEventsSubscribe();
      } else {
        this.PubsubEventsUnSubscribe();
      }
    }
    if (prevProps.companies.company != this.props.companies.company) {
      if(this.props.companies.company.length > 0) {
        const activeCompany = this.props.companies.company[0];
        this.setState({activeCompany: activeCompany})
        const companyArr = this.props.companies.company;
        this.setState({companies: companyArr.filter(c => c._id !== activeCompany._id)});
      }
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  closeMenu(){
    this.setState({
      isOpen: false
    });
  }

  showNotification(message) {
    toast(message, { position: toast.POSITION.TOP_CENTER });
  }

  onSignOut() {
    this.props.logout();
  }

  render() {
    const CurrentUserID = this.props.currentUserID;

    const NumNotifications = this.props.userActivities
      ? this.props.userActivities.filter(function(activity) {
          return (
            !activity.witnessIDs ||
            !activity.witnessIDs.find(function(witnessID) {
              return witnessID == CurrentUserID;
            })
          );
        }).length
      : 0;

    const NumNotificationsString = NumNotifications > 0 ? `${NumNotifications}` : '';

    const labelNotif =
      NumNotifications > 0 ? <span className="label-notif">{NumNotificationsString}</span> : '';

    const OpenMenuClass = !this.props.isSidebarOpen ? 'open-menu' : 'open-menu';
    const CloseMenuClass = this.props.isSidebarOpen ? 'close-menu' : 'close-menu';

    
    let houseImage = this.props.userProfile.character.characterImage ? this.props.userProfile.character.characterImage : defaultHouseCompanyImage;
    if(this.props.houses.houses.length > 0) {
      const findHouse = this.props.houses.houses.find(item => item.name == this.props.userProfile.character.characterName);
      if(findHouse && findHouse.imageUrl) houseImage = findHouse.imageUrl;
    }

    return (
      <div className="soqqle-header" id="popup-root">
        <ToastContainer />

        {this.state.userToggleOpen && (
          <UserIconToggle
            onClose={() => this.handleUserToggleClose()}
          />
        )}

        <div className="navbar-wrapper">
            <header>
                <Logo/>
                <div className="header">
                  <button className="burger" onClick={this.toggle}>
                    <span> </span>
                    <span> </span>
                    <span> </span>
                  </button>

                  <Link to="/story" className="navbar-button">
                    <div className="navbar-btn-img">
                      <img
                      src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/Story.png"
                      style={{ marginTop: '-4px', width: '16px' }}
                      />
                    </div>
                    <div className="navbar-btn-name">
                      Story
                    </div>
                  </Link>

                  <Link to="/heroes" className="navbar-button">
                    <div className="navbar-btn-img">
                      <img
                      src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/Heroes.png"
                      style={{ marginTop: '-5px', width: '18px' }}
                      />
                    </div>
                    <div className="navbar-btn-name">
                      Heroes
                    </div>
                  </Link>

                  <Link to="/tasks" className="navbar-button">
                    <div className="navbar-btn-img">
                      <img
                      src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/Tasks.png"
                      style={{ width: '18px' }}
                      />
                    </div>
                    <div className="navbar-btn-name">
                      Tasks
                    </div>
                  </Link>

                  <div className="navbar-options">
                    <li className="nav-bar-icon-holder">
                      <Link to="/story" onClick={this.closeMenu}>
                        <span className="nav-bar-icon">
                          <img
                            src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/Story.png"
                          />
                        </span>
                      </Link>
                    </li>
                    <li className="nav-bar-icon-holder">
                      <Link to="/heroes" onClick={this.closeMenu}>
                        <span className="nav-bar-icon">
                          <img
                            src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/themeHeader/Heroes.png"
                          />
                        </span>
                      </Link>
                    </li>
                    <li className="nav-bar-icon-holder">
                      <Link to="/tasks" onClick={this.closeMenu}>
                        <span className="nav-bar-icon">
                          <img
                            src={flagSrc}
                          />
                        </span>
                      </Link>
                    </li>

                    <li className="navbar-home">
                      {/*<ActionLink href="#" onClick={() => this.handleUserToggleOpen()}>*/}
                      <ActionLink href="#" onClick={() => {}}>
                        <span className="new-img-icon-head">
                          <img src={houseImage} alt="" />
                        </span>
                      </ActionLink>
                    </li>
                    <li className="navbar-company">
                      {this.state.companies.length > 0 && this.state.isCompanyOpen && (
                        <CompanyDropDown companies={this.state.companies} handleClickOutside={this.handleOutsideClickCompany} selectCompany={this.selectCompany}/>
                      )}
                      <a href="javascript:" onClick={this.toggleCompany} className="navbar-company-a">
                        <span className="new-img-icon-head">
                          <img src={this.state.activeCompany.imageUrl ? this.state.activeCompany.imageUrl : ''} alt="" />
                        </span>
                      </a>
                    </li>
                    {/* <StatsDropdown userProfile={this.props.userProfile} accounting={this.props.accounting} /> */}
                    <li className="notification">
                      {this.state.notificationsOpen && (
                        <Notifications
                          onClose={() => this.handleNotificationsClose()}
                          userActivities={this.props.userActivities}
                          markActivitySeen={() => this.props.markActivitySeen()}
                        />
                      )}
                      <ActionLink href="#" onClick={() => this.handleNotificationsOpen()}>
                        <Icon name="bell" aria-hidden="true" />
                        {/* {labelNotif} */}
                      </ActionLink>
                    </li>
                    <li className="register">
                      <Link href="#" to="/connections">
                        <Icon name="user-plus" aria-hidden="true" />
                      </Link>
                    </li>
                    <UserMenuDropdown
                      localeData={this.props.localeData}
                      isAdmin={this.props.isAdmin}
                      userProfile={this.props.userProfile}
                      onSignOut={() => this.onSignOut()}
                    />
                  </div>
                </div>
            </header>
            <MobileMenu
              userProfile={this.props.userProfile}
              isOpen={this.state.isOpen}
              closeMenu={this.toggle}
              onSignOut={this.onSignOut}
            />
        </div>
      </div>
    );
  }
}

export default ThemeHeader;
