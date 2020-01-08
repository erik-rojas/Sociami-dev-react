import React from 'react';
import { Link } from 'react-router-dom';

const Friends = (props) => {
  const { connections } = props;
  let ids = [];
  return (
    <div className="col-box-wp">
      <div className="my-friends-wp">
        <h3 className="col-heading">{props.heading}</h3>
          {
            connections.length > 0
            ?
            <ul>
              {
                connections.map(friend => {
                  if(ids.indexOf(friend.id) === -1){
                    ids.push(friend.id)
                    return(
                      <li key={friend.id}><span className="img-wp"><img src={friend.profilePic} onClick={(event) => props.handleChange( friend.id )} /></span>
                      <p>{friend.firstName}</p> </li>
                    )
                  }                    
                })
              }
            </ul>
            :
            <div className="no-friends">
            {
              props.heading === 'Friends' 
              ?
             'No Friends'
             :
             <div>
              You have no friends!
              <Link to="/connections">
                Add one?</Link>
              </div>
            }            
            </div>
          }
        
      </div>
    </div>
  );
}

export default Friends;
