import React from 'react';
var fallbackProfilePic =
      'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';
function ConnectionCard(props) {
  return (
    <div className="connection-card">
      <div className="connection-profile-pic">
        <img
          onClick={props.onClickCheckUserProfile}
          src={props.connection.profilePic || fallbackProfilePic}
          onError={e => { e.target.src = fallbackProfilePic; }} />
      </div>
      <div className="connection-info">
        <h1 onClick={props.onClickCheckUserProfile} title={`${props.connection.firstName} ${props.connection.lastName}`}>
          {props.connection.firstName} {props.connection.lastName}
        </h1>
        <p>Innovation is widely known as a value which is worth pursuing</p>
      </div>
      <div className="connection-actions">
        <a href="#" className="btn-prim" onClick={props.onPrimaryAction}>{props.actionName || 'Add'}</a>
        {props.secondaryAction
          && <a href="#" className="btn-prim" onClick={props.onSecondaryAction}>{props.secondaryAction}</a> }
        <a href="#" className="btn-circ">
          <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/send-arrow.png" alt="" />
        </a>
      </div>
      <ul className="connection-details">
        <li>
          <span>Friends</span>
          <div className="sql-badge">
            <a href="#">{props.connection.connections.friendCount}</a>
          </div>
        </li>
        <li>
          <span>Progression Trees</span>
          <div className="sql-badge">
            <a href="#">{props.connection.connections.progressionCount}</a>
          </div>
        </li>
        <li>
          <span>Challenges</span>
          <div className="sql-badge">
            <a href="#">{props.connection.connections.projectCount}</a>
          </div>
        </li>
        <li>
          <span>Tasks</span>
          <div className="sql-badge">
            <a href="#">{props.connection.connections.taskCount}</a>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default ConnectionCard;