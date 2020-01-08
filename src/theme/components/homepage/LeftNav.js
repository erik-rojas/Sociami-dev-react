import React from 'react';
import { Link } from 'react-router-dom';

const LeftNav = (props) => {
  return (
    <div className="col fixed-wp">
      <div className="col-box-wp p-0">
        <div className="left-content">
          <div className="top-head">
            <div className="icon">
              <img src={props.profilePic} alt="" />
            </div>
            <span className="col-heading">{props.userProfile.firstName} {props.userProfile.lastName}</span>
          </div>
          <ul>
            <li>
              <a href="#">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/newsfeed-menu-icon.png" />
                </span>
                <p>News Feed</p>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/messages-menu-icon.png" />
                </span>
                <p>Messages</p>
              </a>
            </li>
            <div className="line-devider"></div>
            <li>
              <a href="#">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/team-menu-icon.png" />
                </span>
                <p>Team</p>
              </a>
            </li>
            <li className="l-h40">
              <Link to="/sparks">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/sparks-menu-icon.png" />
                </span>
                <p>Sparks [{props.accounting.data.numTokens}]</p>
              </Link>
            </li>
            <li className="l-h40">
              <Link to="/achievements">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/achievements-menu-icon.png" />
                </span>
                <p>Achievements</p>
                <span className="icon-exclam">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/exclam-icon.svg" />
                </span>
              </Link>
            </li>
            <li className="l-h40">
              <Link to="/connections">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/connections-menu-icon.png" />
                </span>
                <p>Connections</p>
              </Link>
            </li>
            <li className="l-h40">
              <Link to="/levels">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/levels-menu-icon.png" />
                </span>
                <p>Levels</p>
              </Link>
            </li>
            <li className="l-h40">
              <a href="#">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/rewards-menu-icon.png" />
                </span>
                <p>Rewards</p>
              </a>
            </li>
            <li className="l-h40">
              <a href="#">
                <span className="icon-wp">
                  <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/roles-menu-icon.png" />
                </span>
                <p>Roles</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
