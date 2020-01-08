import React from 'react';
import { Link } from 'react-router-dom';

import challengeMenuIcon from '~/src/theme/images/goal.png';
import settingMenuIcon from '~/src/theme/images/settings-gears.png';

const MobileMainMenu = (props) => {
  return (
      <div className="left-content">
        <ul>
          <div className="line-devider-unset line-devider"/>
          <li>
            <a href="#" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/newsfeed-menu-icon.png" />
              </span>
              <p>News Feed</p>
            </a>
          </li>
          <li>
            <a href="#" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img
                  className="message-img"
                  src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/messages-menu-icon.png"
                />
              </span>
              <p>Messages</p>
            </a>
          </li>
          <div className="line-devider"/>
          <li className="mobile-menu-li">
            <a href="" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src={challengeMenuIcon} />
              </span>
              <p>Challenge</p>
            </a>
          </li>
          <li className="mobile-menu-li">
            <Link to="/teams" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/team-menu-icon.png" />
              </span>
              <p>Team</p>
            </Link>
          </li>
          <li className="mobile-menu-li">
            <a href="#" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/sparks-menu-icon.png" />
              </span>
              <p>Sparks</p>
            </a>
          </li>
          <li className="mobile-menu-li">
            <Link to="/achievements" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/achievements-menu-icon.png" />
              </span>
              <p>Achievements</p>
            </Link>
          </li>
          <li className="mobile-menu-li">
            <Link to="/connections" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/connections-menu-icon.png" />
              </span>
              <p>Connections</p>
            </Link>
          </li>
          <li className="mobile-menu-li">
            <Link to="/levels" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/levels-menu-icon.png" />
              </span>
              <p>Levels</p>
            </Link>
          </li>
          <li className="mobile-menu-li">
            <a href="#" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/rewards-menu-icon.png" />
              </span>
              <p>Rewards</p>
            </a>
          </li>
          <li className="mobile-menu-li">
            <a href="#" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/roles-menu-icon.png" />
              </span>
              <p>Roles</p>
            </a>
          </li>
          <div className="line-devider"/>
          <li className="mobile-menu-li">
            <a href="#" onClick={props.closeMenu}>
              <span className="icon-wp">
                <img src={settingMenuIcon} />
              </span>
              <p>Settings</p>
            </a>
          </li>
          <li className="mobile-menu-li">
            <a href="#" onClick={props.onSignOut}>
              <span className="icon-wp">
                <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/sparks-menu-icon.png" />
              </span>
              <p>Log Out</p>
            </a>
          </li>
        </ul>
      </div>
  );
};

export default MobileMainMenu;
